// 文件说明：CC98 同步数据访问层。
// 功能说明：统一读取构建期快照、保留有效楼层、清洗 Markdown 并渲染为 HTML。

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { getCc98TopicConfig, siteDatabase, type Cc98TopicConfig, type Cc98TopicKey } from '../data/database';
import { normalizeCc98Markdown, renderMarkdown } from './markdown';

export type Cc98Post = {
	id?: number;
	userName: string | null;
	content: string;
	time: string;
	floor: number;
	isDeleted: boolean;
	isLZ: boolean;
};

type PostPage = {
	items?: Cc98Post[];
};

export type Cc98Summary = {
	sourceUrl?: string;
	topic?: {
		title?: string;
		authorName?: string;
		hitCount?: number;
	};
	crawledAt?: string;
};

export type Cc98VisibleRecord = Cc98Post & {
	cleanContent: string;
	renderedContent: string;
};

export interface Cc98Dataset {
	config: Cc98TopicConfig;
	summary: Cc98Summary | null;
	records: Cc98Post[];
	visibleRecords: Cc98VisibleRecord[];
}

const readJson = async <T>(filePath: string) => JSON.parse(await readFile(filePath, 'utf-8')) as T;

export const getCc98OutputDir = (key: Cc98TopicKey) => {
	const config = getCc98TopicConfig(key);
	return resolve(process.cwd(), siteDatabase.cc98.outputRoot, config.outputSlug);
};

export const loadCc98Dataset = async (key: Cc98TopicKey): Promise<Cc98Dataset> => {
	const config = getCc98TopicConfig(key);
	const outputDir = getCc98OutputDir(key);

	try {
		const [summary, pages] = await Promise.all([
			readJson<Cc98Summary>(resolve(outputDir, 'records/investment-summary.json')),
			readJson<PostPage[]>(resolve(outputDir, 'raw/posts.json')),
		]);

		const cleanPosts = pages
			.flatMap((page) => page.items ?? [])
			.filter((post) => !post.isDeleted && post.content?.trim())
			.sort((a, b) => a.floor - b.floor);

		const records = cleanPosts;

		const placeholderTexts = new Set(config.placeholderTexts);
		const visibleRecordData = records
			.map((record) => ({
				...record,
				cleanContent: normalizeCc98Markdown(record.content),
			}))
			.filter((record) => record.cleanContent && !placeholderTexts.has(record.cleanContent));

		const visibleRecords = await Promise.all(visibleRecordData.map(async (record) => ({
			...record,
			renderedContent: await renderMarkdown(record.cleanContent),
		})));

		return {
			config,
			summary,
			records,
			visibleRecords,
		};
	} catch {
		return {
			config,
			summary: null,
			records: [],
			visibleRecords: [],
		};
	}
};
