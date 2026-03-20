# hadmard.github.io

这是一个基于 `Astro 6 + Tailwind CSS 4 + MDX + Astro i18n` 的双语个人站点仓库，当前按 GitHub Pages 官方“从分支部署”的方式组织。

## 当前部署方式

本仓库现在按下面这条路径部署：

1. 本地修改源码
2. 运行 `npm run build`
3. Astro 把静态产物输出到 `docs/`
4. 将源码和 `docs/` 一起提交到 `main`
5. GitHub Pages 从 `main` 分支的 `/docs` 目录发布

这和 GitHub 文档里的“Deploy from a branch”方式一致。

## 你需要在 GitHub 页面里确认的设置

打开仓库：

- `Settings`
- `Pages`

然后设置为：

- `Source`: `Deploy from a branch`
- `Branch`: `main`
- `Folder`: `/docs`

如果你之前已经启用了 GitHub Actions 部署，现在请切回这里的分支部署方式。

## 本地开发

```bash
npm install
npm run dev
```

## 生成线上页面

```bash
npm run build
```

运行后，静态页面会生成到 `docs/`，这部分内容需要一起提交到 GitHub，GitHub Pages 才会更新。

## 当前站点内容入口

- 主页结构数据：[src/data/site.ts](./src/data/site.ts)
- 全局样式：[src/styles/global.css](./src/styles/global.css)
- 中文首页：[src/pages/index.astro](./src/pages/index.astro)
- 英文首页：[src/pages/en/index.astro](./src/pages/en/index.astro)

## 备注

- 目前项目经历、投资记录、个人思考仍然是空态展示
- 评论基础组件还在，但当前文章页未启用
- 仓库目标站点为 [https://hadmard.github.io](https://hadmard.github.io)
