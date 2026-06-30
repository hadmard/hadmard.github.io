import { createMarkdownProcessor, type RehypePlugin } from '@astrojs/markdown-remark';
import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

const allowedUrlProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);

const firstString = (value: unknown) => {
	if (Array.isArray(value)) return String(value[0] ?? '');
	if (typeof value === 'string') return value;
	if (value == null || typeof value === 'boolean') return '';
	return String(value);
};

const isSafeUrl = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return false;
	if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
		return true;
	}

	try {
		return allowedUrlProtocols.has(new URL(trimmed).protocol);
	} catch {
		return false;
	}
};

const isExternalHttpUrl = (value: string) => {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
};

const rehypeHardenLinks: RehypePlugin = () => (tree: Root) => {
	visit(tree, 'element', (node: Element) => {
		const properties = node.properties ?? {};

		if (node.tagName === 'a') {
			const href = firstString(properties.href);
			if (!isSafeUrl(href)) {
				delete properties.href;
				return;
			}

			properties.href = href;
			if (isExternalHttpUrl(href)) {
				properties.target = '_blank';
				properties.rel = 'noopener noreferrer';
			}
		}

		if (node.tagName === 'img') {
			const src = firstString(properties.src);
			if (!isSafeUrl(src)) {
				delete properties.src;
				return;
			}

			properties.src = src;
			properties.loading = 'lazy';
			properties.decoding = 'async';
		}

		node.properties = properties;
	});
};

const markdownProcessor = createMarkdownProcessor({
	gfm: true,
	smartypants: true,
	remarkRehype: { allowDangerousHtml: false },
	rehypePlugins: [rehypeHardenLinks],
});

export const normalizeCc98Markdown = (content: string) => content
	.replace(/\[url=(https?:\/\/[^\]\s]+)\]([\s\S]*?)\[\/url\]/gi, '[$2]($1)')
	.replace(/\[url\](https?:\/\/[^\]\s]+)\[\/url\]/gi, '<$1>')
	.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (_match, source: string) => {
		const url = source.trim();
		return url ? `\n\n![](${url})\n\n` : '\n';
	})
	.replace(/<br\s*\/?>/gi, '\n')
	.replace(/\[(\/)?(?:b|i|u|s|quote|size|color|font|align|center|left|right|code|table|tr|td|list|ol|ul|li)(?:=[^\]\n]{0,120})?\]/gi, '')
	.replace(/\[(?:tb|ac|em|ldln|zk|han|tsj|st|w|yz|mj|xk|doge)[^\]\n]{0,20}\]/gi, '')
	.replace(/\p{Extended_Pictographic}/gu, '')
	.replace(/[\uFE0F\u200D]/g, '')
	.replace(/\r\n?/g, '\n')
	.split('\n')
	.map((line) => line.replace(/[ \t]+$/g, ''))
	.join('\n')
	.replace(/\n{3,}/g, '\n\n')
	.trim();

export const renderMarkdown = async (content: string) => {
	const processor = await markdownProcessor;
	const result = await processor.render(content);

	return result.code.trim();
};
