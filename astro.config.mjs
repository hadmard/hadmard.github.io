// 文件说明：该文件负责定义 Astro 站点的全局构建配置。
// 功能说明：处理 GitHub Pages 的站点地址、国际化、内容集成与 Tailwind 4 接入。
//
// 结构概览：
//   第一部分：计算 GitHub Pages 相关路径
//   第二部分：声明 Astro 构建配置
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// ========== 第一部分：计算 GitHub Pages 路径 ==========
// 这里优先绑定到用户指定的 hadmard.github.io；如果工作流注入了仓库名，则继续按用户页/项目页规则兼容。
const [owner = 'hadmard', repository = 'hadmard.github.io'] = (
	process.env.GITHUB_REPOSITORY ?? 'hadmard/hadmard.github.io'
).split('/');
const normalizedRepository = repository.toLowerCase();
const normalizedOwner = owner.toLowerCase();
const isUserSite = normalizedRepository === `${normalizedOwner}.github.io`;
const site = process.env.SITE_URL ?? 'https://hadmard.github.io';
const base = isUserSite ? '/' : `/${repository}`;

// ========== 第二部分：声明 Astro 构建配置 ==========
export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	i18n: {
		locales: ['zh-cn', 'en'],
		defaultLocale: 'zh-cn',
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [mdx(), sitemap()],
});
