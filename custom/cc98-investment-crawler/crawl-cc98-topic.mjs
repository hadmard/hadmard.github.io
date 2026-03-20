#!/usr/bin/env node
/**
 * 文件说明：该文件实现 CC98 主题楼层抓取与本地整理导出。
 * 功能说明：负责解析主题链接、携带授权请求 CC98 API、保存原始 JSON，并整理为投资记录 Markdown/CSV。
 *
 * 结构概览：
 *   第一部分：常量、参数解析与基础工具
 *   第二部分：CC98 请求与数据归一化
 *   第三部分：投资记录导出
 *   第四部分：主流程与命令行入口
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const API_BASE_URL = "https://api.cc98.org";
const OPENID_TOKEN_URL = "https://openid.cc98.org/connect/token";
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_COUNT = 500;
const CC98_CLIENT_ID = "9a1fd200-8687-44b1-4c20-08d50a96e5cd";
const CC98_CLIENT_SECRET = "8b53f727-08e2-4509-8857-e34bf92b27f2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== 第一部分：常量、参数解析与基础工具 ==========

function parseArgs(argv) {
  const parsed = {
    positional: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) {
      parsed.positional.push(current);
      continue;
    }

    const [rawKey, inlineValue] = current.slice(2).split("=", 2);
    const nextValue = inlineValue ?? argv[index + 1];
    const consumeNext = inlineValue === undefined && nextValue && !nextValue.startsWith("--");

    if (consumeNext) {
      index += 1;
    }

    parsed[rawKey] = inlineValue ?? (consumeNext ? nextValue : true);
  }

  return parsed;
}

function printUsage() {
  const usageText = `
CC98 投资记录爬虫

用法：
  node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic https://www.cc98.org/topic/6450962

可选参数：
  --topic      CC98 主题链接或纯数字 topicId
  --token      CC98 access token，支持原值或 Bearer 前缀
  --username   CC98 用户名
  --password   CC98 密码
  --page-size  每次请求楼层数量，默认 20
  --out-dir    输出目录，默认写入 custom/cc98-investment-crawler/output/topic-<id>
  --help       显示帮助

环境变量：
  CC98_AUTH_TOKEN / CC98_ACCESS_TOKEN
  CC98_USERNAME / CC98_PASSWORD

说明：
  1. 当前主题如果返回 401/cannot_entry_board，说明该版面需要你自己的 CC98 登录授权。
  2. 如果不想手动复制 token，可以直接传用户名和密码，脚本会按当前 CC98 网页端登录流程换取 access token。
  3. 脚本会同时保存原始 JSON 与整理后的 Markdown/CSV，方便你后续继续加工。
`;

  process.stdout.write(`${usageText.trim()}\n`);
}

function normalizeToken(rawToken) {
  if (!rawToken) {
    return null;
  }

  const trimmed = String(rawToken).trim();
  if (!trimmed) {
    return null;
  }

  return /^Bearer\s+/i.test(trimmed) ? trimmed : `Bearer ${trimmed}`;
}

function extractTopicId(input) {
  if (!input) {
    return null;
  }

  const trimmed = String(input).trim();
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const topicUrl = new URL(trimmed);
    const matched = topicUrl.pathname.match(/\/topic\/(\d+)/i);
    return matched?.[1] ?? null;
  } catch {
    return null;
  }
}

function pickFirstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function pickFirstNumber(...values) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function decodeHtmlEntities(input) {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function cleanContent(rawContent) {
  if (!rawContent) {
    return "";
  }

  let content = String(rawContent).replace(/\r\n/g, "\n");

  // 这里优先保留链接文本和引用正文，避免直接整段删除后丢失投资记录上下文。
  content = content.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, "$2 ($1)");
  content = content.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, "$1");
  content = content.replace(/\[(img|video|audio)\]([\s\S]*?)\[\/\1\]/gi, "[$1] $2");
  content = content.replace(/\[upload\]([\s\S]*?)\[\/upload\]/gi, "[upload] $1");
  content = content.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, (_, quoted) => `\n[引用]\n${quoted}\n[/引用]\n`);
  content = content.replace(/\[\/?(b|i|u|del|size|color|align|replyview|markdown|code|table|tr|td|th|list|\*|posteronly)\b[^\]]*\]/gi, "");
  content = content.replace(/\[[^\]]+\]/g, "");
  content = content.replace(/<br\s*\/?>/gi, "\n");
  content = content.replace(/<\/p>/gi, "\n");
  content = content.replace(/<[^>]+>/g, "");
  content = decodeHtmlEntities(content);
  content = content.replace(/\n{3,}/g, "\n\n");

  return content.trim();
}

function ensureTrailingNewline(text) {
  return text.endsWith("\n") ? text : `${text}\n`;
}

function csvEscape(value) {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function formEncode(payload) {
  return new URLSearchParams(
    Object.entries(payload).map(([key, value]) => [key, value == null ? "" : String(value)])
  ).toString();
}

// ========== 第二部分：CC98 请求与数据归一化 ==========

async function requestAccessTokenWithPassword(username, password) {
  const response = await fetch(OPENID_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // 这里复用 CC98 当前网页端的密码登录流程，避免为了自动化登录再引入浏览器依赖。
    body: formEncode({
      client_id: CC98_CLIENT_ID,
      client_secret: CC98_CLIENT_SECRET,
      grant_type: "password",
      username,
      password,
      scope: "cc98-api openid offline_access",
    }),
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(`登录失败 ${response.status} ${response.statusText}: ${rawText.trim() || "空响应"}`);
  }

  let payload;
  try {
    payload = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`登录响应不是合法 JSON：${error instanceof Error ? error.message : String(error)}`);
  }

  if (!payload.access_token || !payload.token_type) {
    throw new Error("登录成功但未返回 access token。");
  }

  return `${payload.token_type} ${payload.access_token}`;
}

async function resolveAuthorizationToken(args) {
  const directToken = normalizeToken(args.token ?? process.env.CC98_AUTH_TOKEN ?? process.env.CC98_ACCESS_TOKEN);
  if (directToken) {
    return directToken;
  }

  const username = args.username ?? process.env.CC98_USERNAME;
  const password = args.password ?? process.env.CC98_PASSWORD;
  if (username && password) {
    return requestAccessTokenWithPassword(String(username), String(password));
  }

  throw new Error(
    "未提供可用登录信息。请传入 --token，或同时传入 --username / --password（也支持环境变量 CC98_USERNAME / CC98_PASSWORD）。"
  );
}

async function requestJson(url, token) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: token,
      "User-Agent": "Mozilla/5.0",
    },
  });

  const rawText = await response.text();

  if (!response.ok) {
    const detail = rawText.trim() || response.statusText;
    throw new Error(`请求失败 ${response.status} ${response.statusText}: ${detail}`);
  }

  try {
    return {
      data: rawText ? JSON.parse(rawText) : null,
      rawText,
    };
  } catch (error) {
    throw new Error(`响应不是合法 JSON：${error instanceof Error ? error.message : String(error)}`);
  }
}

function normalizeTopic(topicId, topicPayload) {
  const topic = topicPayload ?? {};

  return {
    topicId,
    title: pickFirstString(topic.title, topic.topicTitle, `CC98 主题 ${topicId}`),
    boardId: pickFirstNumber(topic.boardId),
    boardName: pickFirstString(topic.boardName),
    authorName: pickFirstString(topic.userName, topic.authorName),
    createdAt: pickFirstString(topic.time, topic.publishTime, topic.createTime),
    replyCount: pickFirstNumber(topic.replyCount),
    hitCount: pickFirstNumber(topic.hitCount),
    state: pickFirstNumber(topic.state),
    raw: topic,
  };
}

function normalizePost(post, fallbackFloor) {
  const contentRaw = pickFirstString(post.content, post.postContent);
  const floor = pickFirstNumber(post.floor, post.postBasicInfo?.floor) ?? fallbackFloor;
  const userId = pickFirstNumber(post.userId, post.postBasicInfo?.userId);
  const sourceUserName = pickFirstString(post.userName, post.postBasicInfo?.userName);
  const isAnonymous = Boolean(post.isAnonymous);
  const isDeleted = Boolean(post.isDeleted);

  return {
    floor,
    postId: pickFirstNumber(post.id, post.postId),
    userId,
    userName: isDeleted
      ? "已删除用户"
      : isAnonymous && sourceUserName
        ? `匿名${sourceUserName.toUpperCase()}`
        : sourceUserName || "未知用户",
    replyTime: pickFirstString(post.replyTime, post.time, post.createTime, post.lastTime),
    isAnonymous,
    isDeleted,
    contentRaw,
    // 这里同时保留原文和轻量清洗版，避免后续需要复核时只能依赖二次加工文本。
    contentText: isDeleted ? "[该楼层已删除]" : cleanContent(contentRaw),
    raw: post,
  };
}

async function fillBoardNameIfNeeded(topic, token) {
  if (topic.boardName || topic.boardId == null) {
    return topic;
  }

  try {
    const response = await requestJson(`${API_BASE_URL}/board/${topic.boardId}`, token);
    const boardName = pickFirstString(response.data?.name, response.data?.boardName);
    if (boardName) {
      return {
        ...topic,
        boardName,
      };
    }
  } catch {
    // 这里允许静默降级，因为缺少版面名不会影响楼层抓取主流程。
  }

  return topic;
}

async function fetchTopicAndPosts({ topicId, token, pageSize }) {
  const topicUrl = `${API_BASE_URL}/Topic/${topicId}`;
  const topicResponse = await requestJson(topicUrl, token);
  const normalizedTopic = await fillBoardNameIfNeeded(normalizeTopic(topicId, topicResponse.data), token);

  const postPages = [];
  const normalizedPosts = [];

  for (let pageIndex = 0; pageIndex < MAX_PAGE_COUNT; pageIndex += 1) {
    const from = pageIndex * pageSize;
    const pageUrl = `${API_BASE_URL}/Topic/${topicId}/post?from=${from}&size=${pageSize}`;
    const pageResponse = await requestJson(pageUrl, token);
    const pagePosts = Array.isArray(pageResponse.data) ? pageResponse.data : [];

    postPages.push({
      from,
      size: pageSize,
      count: pagePosts.length,
      items: pagePosts,
    });

    if (pagePosts.length === 0) {
      break;
    }

    for (const [index, post] of pagePosts.entries()) {
      normalizedPosts.push(normalizePost(post, from + index + 1));
    }

    if (pagePosts.length < pageSize) {
      break;
    }
  }

  return {
    topicResponse,
    normalizedTopic,
    postPages,
    normalizedPosts,
  };
}

// ========== 第三部分：投资记录导出 ==========

function buildMarkdownRecord({ sourceUrl, topic, posts, crawledAt }) {
  const headerLines = [
    `# 投资记录：${topic.title}`,
    "",
    `- 来源链接：${sourceUrl}`,
    `- 主题 ID：${topic.topicId}`,
    `- 抓取时间：${crawledAt}`,
    `- 版面：${topic.boardName || "未知版面"}${topic.boardId != null ? `（ID: ${topic.boardId}）` : ""}`,
    `- 发帖人：${topic.authorName || "未知"}`,
    `- 原帖时间：${topic.createdAt || "未知"}`,
    `- 楼层总数：${posts.length}`,
    `- 说明：正文为轻量清洗后的可读版本；原始数据已同步保存为 JSON 备查。`,
    "",
    "## 楼层目录",
    "",
    ...posts.map((post) => `- ${post.floor}楼 | ${post.userName} | ${post.replyTime || "时间未知"}`),
    "",
    "## 楼层正文",
    "",
  ];

  const sections = posts.map((post) => {
    const body = post.contentText || "[空内容]";
    return [
      `### ${post.floor}楼`,
      "",
      `- 用户：${post.userName}`,
      `- 时间：${post.replyTime || "未知"}`,
      `- 帖子 ID：${post.postId ?? "未知"}`,
      `- 匿名：${post.isAnonymous ? "是" : "否"}`,
      `- 已删除：${post.isDeleted ? "是" : "否"}`,
      "",
      "正文：",
      "",
      body,
      "",
    ].join("\n");
  });

  return ensureTrailingNewline([...headerLines, ...sections].join("\n"));
}

function buildCsvRecord(posts) {
  const header = [
    "floor",
    "postId",
    "userId",
    "userName",
    "replyTime",
    "isAnonymous",
    "isDeleted",
    "contentText",
    "contentRaw",
  ];

  const rows = posts.map((post) =>
    [
      post.floor,
      post.postId ?? "",
      post.userId ?? "",
      post.userName,
      post.replyTime,
      post.isAnonymous,
      post.isDeleted,
      post.contentText,
      post.contentRaw,
    ]
      .map(csvEscape)
      .join(",")
  );

  return ensureTrailingNewline([header.join(","), ...rows].join("\n"));
}

async function writeOutputs({ outDir, sourceUrl, topic, postPages, posts }) {
  const crawledAt = new Date().toISOString();
  const rawDir = path.join(outDir, "raw");
  const recordDir = path.join(outDir, "records");

  await fs.mkdir(rawDir, { recursive: true });
  await fs.mkdir(recordDir, { recursive: true });

  const summaryPayload = {
    sourceUrl,
    crawledAt,
    topic,
    postCount: posts.length,
  };

  await fs.writeFile(
    path.join(rawDir, "topic.json"),
    ensureTrailingNewline(JSON.stringify(topic.raw, null, 2)),
    "utf8"
  );
  await fs.writeFile(
    path.join(rawDir, "posts.json"),
    ensureTrailingNewline(JSON.stringify(postPages, null, 2)),
    "utf8"
  );
  await fs.writeFile(
    path.join(recordDir, "investment-summary.json"),
    ensureTrailingNewline(JSON.stringify(summaryPayload, null, 2)),
    "utf8"
  );
  await fs.writeFile(
    path.join(recordDir, "investment-record.md"),
    buildMarkdownRecord({ sourceUrl, topic, posts, crawledAt }),
    "utf8"
  );
  await fs.writeFile(
    path.join(recordDir, "investment-record.csv"),
    buildCsvRecord(posts),
    "utf8"
  );
}

// ========== 第四部分：主流程与命令行入口 ==========

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printUsage();
    return;
  }

  const topicInput = args.topic ?? args.positional[0];
  const topicId = extractTopicId(topicInput);
  const sourceUrl =
    typeof topicInput === "string" && topicInput.startsWith("http")
      ? topicInput
      : topicId
        ? `https://www.cc98.org/topic/${topicId}`
        : "";

  if (!topicId) {
    throw new Error("未能识别 topicId，请通过 --topic 传入 CC98 主题链接或纯数字 ID。");
  }

  const token = await resolveAuthorizationToken(args);

  const pageSize = Number.parseInt(String(args["page-size"] ?? DEFAULT_PAGE_SIZE), 10);
  if (!Number.isFinite(pageSize) || pageSize <= 0) {
    throw new Error("--page-size 必须是正整数。");
  }

  const outDir = path.resolve(
    String(args["out-dir"] ?? path.join(__dirname, "output", `topic-${topicId}`))
  );

  const result = await fetchTopicAndPosts({
    topicId,
    token,
    pageSize,
  });

  await writeOutputs({
    outDir,
    sourceUrl,
    topic: result.normalizedTopic,
    postPages: result.postPages,
    posts: result.normalizedPosts,
  });

  process.stdout.write(
    [
      "抓取完成。",
      `主题：${result.normalizedTopic.title}`,
      `楼层数：${result.normalizedPosts.length}`,
      `输出目录：${outDir}`,
    ].join("\n") + "\n"
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`抓取失败：${message}\n`);
  process.stderr.write("提示：如果报错里包含 401 或 cannot_entry_board，请先提供你自己的 CC98 登录 token。\n");
  process.exitCode = 1;
});
