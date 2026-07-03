// 文件说明：同步桌面 CS 学习笔记到站点内容目录。
// 功能说明：复制 Markdown 笔记并把 Typora 本地图片改写为站点静态资源路径。
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const userHome = homedir();
const sourceRoot = resolve(process.argv[2] ?? process.env.REDEMPTION_SOURCE_DIR ?? join(repoRoot, '..', 'My Cs Learning'));
const contentOutput = resolve(repoRoot, 'src/content/redemption-road');
const assetOutput = resolve(repoRoot, 'public/redemption-assets');
const typoraImageRoot = `${join(userHome, 'Library/Application Support/typora-user-images')}/`;
const markdownExtensions = new Set(['.md', '.markdown', '.mdx']);
const ignoredDirectories = new Set([
	'.git',
	'.obsidian',
	'node_modules',
	'CS',
	'docs',
	'makefile-practice',
	'superpowers',
]);
const copiedAssets = new Map();

const toPosixPath = (value) => value.split('\\').join('/');

const isMarkdownFile = (filePath) => markdownExtensions.has(extname(filePath).toLowerCase());

const isStudyNote = (relativePath, content) => {
	const normalizedPath = toPosixPath(relativePath);
	const fileName = basename(normalizedPath).toLowerCase();
	const pathParts = normalizedPath.toLowerCase().split('/');
	const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';

	if (pathParts.includes('makefile-practice')) return false;
	if (fileName === 'exp0.md' || fileName === 'exp1.md') return false;
	if (/codex/i.test(fileName)) return false;
	if (/实验报告|实验记录/.test(title)) return false;

	return true;
};

const escapeMarkdownAlt = (value) => value
	.replace(/\\/g, '\\\\')
	.replace(/\[/g, '\\[')
	.replace(/\]/g, '\\]');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeLocalPaths = (content) => content.replace(new RegExp(escapeRegExp(userHome), 'g'), '~');

const siteAssetPathFor = (rawSource) => {
	if (!rawSource.startsWith(typoraImageRoot)) return rawSource;

	const fileName = basename(rawSource);
	copiedAssets.set(rawSource, fileName);
	return `/redemption-assets/${encodeURIComponent(fileName)}`;
};

const rewriteImagePaths = (content) => {
	const withMarkdownImages = content.replace(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, (match, source) => {
		const altMatch = match.match(/\balt=["']([^"']*)["']/i);
		const alt = altMatch?.[1] ?? '';
		return `\n\n![${escapeMarkdownAlt(alt)}](${siteAssetPathFor(source)})\n\n`;
	});

	return withMarkdownImages.replace(
		/\/Users\/yifei\/Library\/Application Support\/typora-user-images\/[^\s"')>]+/g,
		(match) => siteAssetPathFor(match),
	);
};

const normalizeMarkdownArtifacts = (content) => content
	.replace(/^(\s*)-\s+```(-O0\s+.+)$/gm, '$1- `$2`')
	.replace(/^(\s*)```(?:ifeq|define)\b.*$/gm, '$1```makefile')
	.replace(/```([^`\n]+)```/g, '`$1`')
	.replace(/^[ \u200B\uFEFF]+\t/gm, '\t')
	.replace(/[ \t\u200B\uFEFF]+$/gm, '');

const collectMarkdownFiles = async (directory) => {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

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

const contentHash = (value) => createHash('sha256').update(value).digest('hex');

if (!existsSync(sourceRoot)) {
	throw new Error(`Redemption source folder does not exist: ${sourceRoot}`);
}

await rm(contentOutput, { recursive: true, force: true });
await rm(assetOutput, { recursive: true, force: true });
await mkdir(contentOutput, { recursive: true });
await mkdir(assetOutput, { recursive: true });

const sourceFiles = (await collectMarkdownFiles(sourceRoot)).sort((a, b) => {
	const relativeA = toPosixPath(relative(sourceRoot, a));
	const relativeB = toPosixPath(relative(sourceRoot, b));
	const depthA = relativeA.split('/').length;
	const depthB = relativeB.split('/').length;

	return depthA - depthB || relativeA.localeCompare(relativeB, 'zh-CN', { numeric: true });
});
const seenContent = new Set();
let syncedCount = 0;
let copiedAssetCount = 0;
let skippedCount = 0;

for (const sourceFile of sourceFiles) {
	const relativePath = toPosixPath(relative(sourceRoot, sourceFile));
	const outputPath = join(contentOutput, relativePath);
	const rawContent = await readFile(sourceFile, 'utf-8');
	if (!isStudyNote(relativePath, rawContent)) {
		skippedCount += 1;
		continue;
	}

	const normalizedContent = normalizeMarkdownArtifacts(sanitizeLocalPaths(rewriteImagePaths(rawContent))).replace(/\r\n?/g, '\n').trimEnd();
	const fingerprint = contentHash(normalizedContent.replace(/\s+$/gm, '').trim());
	if (seenContent.has(fingerprint)) continue;
	seenContent.add(fingerprint);

	await mkdir(dirname(outputPath), { recursive: true });
	await writeFile(outputPath, `${normalizedContent}\n`, 'utf-8');
	syncedCount += 1;
}

for (const [sourceAsset, fileName] of copiedAssets) {
	if (!existsSync(sourceAsset)) continue;
	const assetStat = await stat(sourceAsset);
	if (!assetStat.isFile()) continue;
	await copyFile(sourceAsset, join(assetOutput, fileName));
	copiedAssetCount += 1;
}

console.log(`Synced ${syncedCount} markdown files from ${sourceRoot}`);
console.log(`Skipped ${skippedCount} non-note markdown files`);
console.log(`Copied ${copiedAssetCount} referenced image assets`);
