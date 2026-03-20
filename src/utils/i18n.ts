// 文件说明：该文件封装站点的语言与路径工具函数。
// 功能说明：统一处理默认语言、语言路径拼接、思考文章 slug 解析等逻辑，避免页面层重复写规则。
//
// 结构概览：
//   第一部分：基础语言常量
//   第二部分：路径工具
//   第三部分：内容工具

import type { CollectionEntry } from 'astro:content';

import { siteCopy, type Locale } from '../data/site';

// ========== 第一部分：基础语言常量 ==========
export const defaultLocale: Locale = 'zh-cn';
export const secondaryLocale: Locale = 'en';

// ========== 第二部分：路径工具 ==========
export function normalizePath(path: string) {
	if (!path || path === '/') return '/';
	return `${path.replace(/\/+$/, '').replace(/^([^/])/, '/$1')}/`;
}

export function localePath(locale: Locale, path = '/') {
	const normalized = normalizePath(path);
	return locale === defaultLocale ? normalized : `/en${normalized === '/' ? '/' : normalized}`;
}

// ========== 第三部分：内容工具 ==========
export function getCopy(locale: Locale) {
	return siteCopy[locale];
}

export function getThoughtSlug(entry: CollectionEntry<'thoughts'>) {
	return entry.id.split('/').slice(1).join('/');
}
