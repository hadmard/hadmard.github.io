# hadmard.github.io

这是一个基于 `Astro 6 + Tailwind CSS 4 + MDX` 的个人博客站点。当前栏目：

- 投资记录：展示本地记录。
- 个人思考：放个人思考文章，适合长文阅读。
- 学习日历：同步学习记录。
- 健康作息：同步作息打卡。
- 日程：读取本机 vivo 日历导出的静态快照。
- 救赎之路：整理本地 Markdown 笔记。

## 目录结构

```text
src/
  components/           共享组件
  content/thoughts/     随笔 MDX 内容
  data/site.ts          首页、导航和基础文案
  pages/                页面路由
  styles/global.css     全站 Apple material 风格样式
custom/
  cc98-investment-crawler/  投资记录抓取脚本和输出
  vivo-calendar-sync/       vivo 本地日历同步库读取说明
docs/                       GitHub Pages 发布产物
```

## 本地开发

```bash
npm install
npm run dev
```

## 同步

本项目里，“同步”指同时刷新 vivo 日程、CS Learning 笔记和 CC98 帖子。完整口径与命令见：

```text
SYNC.md
```

## 视觉

- 字体：使用 Apple 平台系统字体栈，优先走 SF Pro，不在仓库内分发字体文件。
- 颜色：使用接近系统色的蓝、粉、橙、绿、青、紫，避免只剩黑白。
- 材质：使用 `backdrop-filter`、透明层、内高光和柔和阴影。
- 动效：保留 reveal、hover、pointer parallax 和 `prefers-reduced-motion` 降级。

## 发布

```bash
npm run build
git add .
git commit -m "你的提交说明"
git push
```

GitHub Pages 使用 `main` 分支的 `/docs` 目录发布，所以 `docs/` 构建产物需要一起提交。

## 添加随笔

在 `src/content/thoughts/` 下新建 MDX 文件。建议按语言分目录：

```text
src/content/thoughts/zh-cn/my-note.mdx
src/content/thoughts/en/my-note.mdx
```

中文示例：

```mdx
---
title: "文章标题"
excerpt: "一句话摘要。"
publishedAt: "2026-06-16"
lang: "zh-cn"
translationKey: "my-note"
readingTime: "3 min"
tags: ["思考"]
featured: false
---

正文写在这里。
```

英文版本把 `lang` 改成 `en`，`translationKey` 保持一致，就能在文章页互相切换。

生成路径：

- 中文：`/thinking/my-note/`
- 英文：`/en/thinking/my-note/`

## 添加投资记录

投资页读取：

```text
custom/cc98-investment-crawler/output/topic-6450962/raw/posts.json
custom/cc98-investment-crawler/output/topic-6450962/records/investment-summary.json
```

想刷新数据时，优先运行爬虫：

```bash
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic 6450962
```

如果只是手动补一条记录，可以编辑 `raw/posts.json`。

## vivo 日程同步

本机 vivo 办公套件 / PC 套件的日历同步库读取方式见：

```text
custom/vivo-calendar-sync/README.md
```

当前确认的本地库位置：

```text
/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db
```

刷新网站日程数据：

```bash
pnpm run sync:schedule
pnpm run build
```

站点不能在线上直接访问这台 Mac 的本地 SQLite，所以页面读取的是本地导出的静态 JSON：

```text
custom/vivo-calendar-sync/output/schedule-records.json
```
