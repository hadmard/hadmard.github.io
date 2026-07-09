# 同步说明

本项目里，“同步”固定指下面三类数据一起刷新：

1. 日程：从本机 vivo 办公套件 / PC 套件的 SQLite 日历库导出到站点 JSON。
2. CS Learning 笔记：从 `/Users/yifei/Desktop/My Cs Learning` 复制真正的 Markdown 笔记到 `src/content/redemption-road/`。
3. CC98 帖子：刷新或重建投资记录、学习日历、健康作息三个 CC98 主题的本地快照与 Markdown/CSV 记录。

同步后需要重新构建 `docs/`，因为 GitHub Pages 读取的是静态产物。

## 一键顺序

当前建议按这个顺序执行：

```bash
pnpm run sync:schedule
pnpm run sync:redemption

node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic 6450962 --from-cache
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic 6548170 --from-cache
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic 6562405 --from-cache

pnpm run check
pnpm run build
```

`--from-cache` 表示不联网，只根据已有的 `raw/topic.json` 和 `raw/posts.json` 重建 `records/investment-record.md` 与 `records/investment-record.csv`。它会保留别人回复、引用、链接、图片、Unicode 表情和已知 CC98 表情。

如果要在线刷新 CC98 最新楼层，先在本地 shell 提供登录信息：

```bash
export CC98_USERNAME="你的用户名"
export CC98_PASSWORD="你的密码"

node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic 6450962
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic 6548170
node custom/cc98-investment-crawler/crawl-cc98-topic.mjs --topic 6562405
```

不要把 CC98 密码写进仓库、提交记录、README 示例或构建产物。

## 日程

入口脚本：

```bash
pnpm run sync:schedule
```

读取源：

```text
/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db
```

输出：

```text
custom/vivo-calendar-sync/output/schedule-records.json
```

脚本只读本地数据库，运行时会复制临时快照到 `custom/vivo-calendar-sync/tmp/`。该目录不提交。

## CS Learning 笔记

入口脚本：

```bash
pnpm run sync:redemption
```

读取源：

```text
/Users/yifei/Desktop/My Cs Learning
```

输出：

```text
src/content/redemption-road/
public/redemption-assets/
```

过滤规则：

- 跳过 `.git`、`.obsidian`、`node_modules`、`CS`、`docs`、`makefile-practice`、`superpowers`。
- 跳过 `exp0.md`、`exp1.md`。
- 标题包含“实验报告”或“实验记录”的 Markdown 不作为网站笔记。
- Typora 本地图片会复制到 `public/redemption-assets/`，正文图片路径改写为 `/redemption-assets/...`。

## CC98 帖子

站点当前读取三个主题：

```text
投资记录：6450962
学习日历：6548170
健康作息：6562405
```

输出目录：

```text
custom/cc98-investment-crawler/output/topic-6450962/
custom/cc98-investment-crawler/output/topic-6548170/
custom/cc98-investment-crawler/output/topic-6562405/
```

每个主题包含：

```text
raw/topic.json
raw/posts.json
records/investment-summary.json
records/investment-record.md
records/investment-record.csv
```

网站页面实际读取 `raw/posts.json` 和 `records/investment-summary.json`，再在构建期渲染 Markdown。`records/investment-record.md` 是给人直接阅读和复核的同步副本。
