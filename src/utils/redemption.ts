// 文件说明：读取“救赎之路”本地 Markdown 笔记。
// 功能说明：为模块首页和笔记详情页提供标题、摘要、分组、slug 等结构化数据。
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';

const sourceDir = resolve(process.cwd(), 'src/content/redemption-road');
const markdownExtensions = new Set(['.md', '.markdown', '.mdx']);
const ignoredDirectories = new Set(['.git', '.obsidian', 'node_modules']);

export type RedemptionNote = {
	slug: string;
	title: string;
	section: string;
	sourcePath: string;
	fileName: string;
	body: string;
	excerpt: string;
	wordCount: number;
	readingMinutes: number;
};

export type RedemptionGroup = {
	label: string;
	notes: RedemptionNote[];
};

const toPosixPath = (value: string) => value.split('\\').join('/');

const isMarkdownFile = (filePath: string) => markdownExtensions.has(extname(filePath).toLowerCase());

const stripFrontmatter = (content: string) => {
	const normalized = content.replace(/\r\n?/g, '\n');
	const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!match) return { frontmatter: '', body: normalized };

	return {
		frontmatter: match[1],
		body: normalized.slice(match[0].length),
	};
};

const titleFromFrontmatter = (frontmatter: string) => {
	const match = frontmatter.match(/^title:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m);
	return cleanTitle(match?.[1] ?? match?.[2] ?? match?.[3] ?? '');
};

const cleanTitle = (value: string) => value.replace(/^#+\s*/, '').trim();

const titleFromBody = (body: string) => {
	const match = body.match(/^#{1,6}\s+(.+)$/m);
	return cleanTitle(match?.[1] ?? '');
};

const titleFromFileName = (filePath: string) => {
	const fileName = basename(filePath, extname(filePath));
	const parent = basename(dirname(filePath));
	return fileName.toLowerCase() === 'readme' ? parent : fileName;
};

const removeFirstTitle = (body: string) => body.replace(/^\s*#{1,6}\s+.+(?:\n+|$)/, '').trim();

const summarize = (body: string) => {
	const text = body
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
		.replace(/^\s{0,3}#{1,6}\s+/gm, '')
		.replace(/^\s*[-*+]\s+/gm, '')
		.replace(/\[[^\]]+]\([^)]+\)/g, (match) => match.match(/\[([^\]]+)]/)?.[1] ?? '')
		.replace(/[>`*_~#|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	if (!text) return '';
	const chars = Array.from(text);
	return chars.length > 116 ? `${chars.slice(0, 116).join('')}...` : text;
};

const countWords = (body: string) => {
	const cjk = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
	const latin = body.match(/[A-Za-z0-9_]+/g)?.length ?? 0;
	return cjk + latin;
};

const sectionFor = (relativePath: string) => {
	if (relativePath.includes('/makefile-practice/')) return 'Makefile Practice';
	if (relativePath.startsWith('hpc/')) return 'HPC 101';
	if (relativePath.startsWith('long-missing-semester/')) return 'Missing Semester';
	return 'Notes';
};

const slugFor = (relativePath: string) => {
	const withoutExtension = relativePath.replace(/\.[^.]+$/, '');
	return withoutExtension.replace(/(^|\/)README$/i, '').replace(/\/$/g, '') || withoutExtension;
};

const collectMarkdownFiles = async (directory: string): Promise<string[]> => {
	const entries = await readdir(directory, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		if (entry.name.startsWith('.') || ignoredDirectories.has(entry.name)) continue;

		const entryPath = join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...await collectMarkdownFiles(entryPath));
			continue;
		}

		if (entry.isFile() && isMarkdownFile(entry.name)) {
			files.push(entryPath);
		}
	}

	return files;
};

let notesCache: Promise<RedemptionNote[]> | null = null;

export const getRedemptionNotes = async () => {
	if (notesCache) return notesCache;

	notesCache = (async () => {
		if (!existsSync(sourceDir)) return [];

		const files = await collectMarkdownFiles(sourceDir);
		const notes = await Promise.all(files.map(async (filePath) => {
			const relativePath = toPosixPath(relative(sourceDir, filePath));
			const raw = await readFile(filePath, 'utf-8');
			const { frontmatter, body: rawBody } = stripFrontmatter(raw);
			const normalizedBody = rawBody.replace(/^(#{1,6})(?=\S)/gm, '$1 ').trim();
			const body = removeFirstTitle(normalizedBody);
			const title = titleFromFrontmatter(frontmatter) || titleFromBody(normalizedBody) || titleFromFileName(filePath);
			const wordCount = countWords(body);

			return {
				slug: slugFor(relativePath),
				title,
				section: sectionFor(relativePath),
				sourcePath: relativePath,
				fileName: basename(filePath),
				body,
				excerpt: summarize(body),
				wordCount,
				readingMinutes: Math.max(1, Math.ceil(wordCount / 420)),
			};
		}));

		return notes.sort((a, b) => (
			a.section.localeCompare(b.section, 'zh-CN', { numeric: true })
			|| a.sourcePath.localeCompare(b.sourcePath, 'zh-CN', { numeric: true })
		));
	})();

	return notesCache;
};

export const getRedemptionGroups = (notes: RedemptionNote[]): RedemptionGroup[] => {
	const groups = new Map<string, RedemptionNote[]>();
	for (const note of notes) {
		groups.set(note.section, [...(groups.get(note.section) ?? []), note]);
	}

	return [...groups.entries()].map(([label, groupNotes]) => ({
		label,
		notes: groupNotes,
	}));
};

export const getRedemptionNote = async (slug: string) => {
	const normalizedSlug = decodeURIComponent(slug).replace(/\/$/g, '');
	const notes = await getRedemptionNotes();
	return notes.find((note) => note.slug === normalizedSlug);
};

export const noteHref = (note: RedemptionNote, locale: 'zh-cn' | 'en') => {
	const encodedSlug = note.slug.split('/').map(encodeURIComponent).join('/');
	return locale === 'zh-cn' ? `/redemption-road/${encodedSlug}/` : `/en/redemption-road/${encodedSlug}/`;
};
