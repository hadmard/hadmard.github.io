// 文件说明：该文件声明 Astro 内容集合。
// 功能说明：为“个人思考”文章定义统一的元数据结构，并从本地 MDX 目录加载内容。
//
// 结构概览：
//   第一部分：导入内容集合依赖
//   第二部分：定义 thoughts 集合
//   第三部分：导出集合配置

import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// ========== 第一部分：定义 thoughts 集合 ==========
const thoughts = defineCollection({
	loader: glob({ base: './src/content/thoughts', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
		publishedAt: z.coerce.date(),
		lang: z.enum(['zh-cn', 'en']),
		translationKey: z.string(),
		readingTime: z.string(),
		tags: z.array(z.string()).default([]),
		featured: z.boolean().default(false),
	}),
});

// ========== 第二部分：导出集合配置 ==========
export const collections = { thoughts };
