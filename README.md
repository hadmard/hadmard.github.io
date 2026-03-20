# hadmard.github.io

一个基于 `Astro 6 + Tailwind CSS 4 + MDX + Astro i18n` 的双语个人博客 / 作品站基线，目标仓库绑定为 `hadmard.github.io`。

## 站点定位

这个站点不是传统单页简历，而是一个更像“个人信号站”的结构：

- 个人简历
- 项目经历
- 投资记录
- 个人思考

当前默认包含：

- 中文与英文双语切换
- `GitHub Pages` 部署工作流
- 基于 `GitHub Issues` 的评论功能（`utterances`）
- `MDX` 驱动的文章详情页

## 本地开发

```bash
npm install
npm run dev
```

## 构建与检查

```bash
npm run check
npm run build
```

## 你最先需要改的地方

1. `src/data/site.ts`
   这里集中维护首页四大模块的中英文内容。
2. `src/content/thoughts/`
   这里维护你的文章内容，新增 `.mdx` 文件即可扩展思考模块。
3. `astro.config.mjs`
   当前已默认绑定到 `https://hadmard.github.io`。

## 评论功能说明

当前评论功能使用 `utterances`，默认仓库已绑定为：

```text
hadmard/hadmard.github.io
```

如果你希望评论真正可用，还需要完成这一步：

- 给仓库安装 `utterances` GitHub App

完成后，文章页会自动按路径创建对应评论线程。

## 部署说明

仓库里已经包含 `.github/workflows/deploy.yml`。

默认推送到 `main` 分支后，会自动构建并发布到 GitHub Pages。
