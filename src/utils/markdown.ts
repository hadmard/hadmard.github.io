import { createMarkdownProcessor, type RehypePlugin } from '@astrojs/markdown-remark';
import type { Element, Root, Text } from 'hast';
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

const texSymbolMap = new Map([
	['alpha', 'α'],
	['beta', 'β'],
	['gamma', 'γ'],
	['delta', 'δ'],
	['epsilon', 'ε'],
	['varepsilon', 'ϵ'],
	['zeta', 'ζ'],
	['eta', 'η'],
	['theta', 'θ'],
	['vartheta', 'ϑ'],
	['iota', 'ι'],
	['kappa', 'κ'],
	['lambda', 'λ'],
	['mu', 'μ'],
	['nu', 'ν'],
	['xi', 'ξ'],
	['omicron', 'ο'],
	['pi', 'π'],
	['rho', 'ρ'],
	['sigma', 'σ'],
	['tau', 'τ'],
	['upsilon', 'υ'],
	['phi', 'φ'],
	['varphi', 'ϕ'],
	['chi', 'χ'],
	['psi', 'ψ'],
	['omega', 'ω'],
	['Gamma', 'Γ'],
	['Delta', 'Δ'],
	['Theta', 'Θ'],
	['Lambda', 'Λ'],
	['Xi', 'Ξ'],
	['Pi', 'Π'],
	['Sigma', 'Σ'],
	['Upsilon', 'Υ'],
	['Phi', 'Φ'],
	['Psi', 'Ψ'],
	['Omega', 'Ω'],
	['times', '×'],
	['cdot', '·'],
	['pm', '±'],
	['le', '≤'],
	['ge', '≥'],
	['neq', '≠'],
	['approx', '≈'],
	['infty', '∞'],
	['partial', '∂'],
	['nabla', '∇'],
	['degree', '°'],
]);

const texSymbolPattern = /\\([A-Za-z]+)\b/g;

const createTextNode = (value: string): Text => ({
	type: 'text',
	value,
});

const createMathSymbolNode = (value: string): Element => ({
	type: 'element',
	tagName: 'span',
	properties: {
		className: ['math-inline'],
	},
	children: [createTextNode(value)],
});

const splitTextWithMathSymbols = (value: string) => {
	const nodes: Array<Text | Element> = [];
	let lastIndex = 0;

	for (const match of value.matchAll(texSymbolPattern)) {
		const command = match[1];
		const symbol = texSymbolMap.get(command);
		const index = match.index ?? 0;
		if (!symbol) continue;

		if (index > lastIndex) {
			nodes.push(createTextNode(value.slice(lastIndex, index)));
		}
		nodes.push(createMathSymbolNode(symbol));
		lastIndex = index + match[0].length;
	}

	if (!nodes.length) return null;
	if (lastIndex < value.length) {
		nodes.push(createTextNode(value.slice(lastIndex)));
	}

	return nodes;
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

const rehypeRenderLightMath: RehypePlugin = () => (tree: Root) => {
	visit(tree, 'text', (node: Text, index, parent) => {
		if (typeof index !== 'number' || !parent || !Array.isArray(parent.children)) return;
		if (parent.type === 'element' && ['code', 'pre', 'script', 'style'].includes(parent.tagName)) return;

		const replacementNodes = splitTextWithMathSymbols(node.value);
		if (!replacementNodes) return;

		parent.children.splice(index, 1, ...replacementNodes);
	});
};

const markdownProcessor = createMarkdownProcessor({
	gfm: true,
	smartypants: true,
	remarkRehype: { allowDangerousHtml: false },
	rehypePlugins: [rehypeHardenLinks, rehypeRenderLightMath],
});

const normalizeCc98Url = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return '';
	if (trimmed.startsWith('/')) return `https://www.cc98.org${trimmed}`;
	if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
	return trimmed;
};

const escapeMarkdownLinkText = (value: string) => value
	.replace(/\\/g, '\\\\')
	.replace(/\[/g, '\\[')
	.replace(/\]/g, '\\]');

const toMarkdownLink = (rawUrl: string, rawLabel: string) => {
	const href = normalizeCc98Url(rawUrl);
	const label = rawLabel.trim() || href;
	if (!href || !isSafeUrl(href)) return label;
	return `[${escapeMarkdownLinkText(label)}](${href})`;
};

const convertQuoteBlocks = (content: string) => content.replace(
	/\[quote(?:=[^\]\n]{0,160})?\]([\s\S]*?)\[\/quote\]/gi,
	(_match, quoted: string) => {
		const quoteBody = quoted
			.trim()
			.split('\n')
			.map((line) => line.trimEnd())
			.join('\n');
		const markdownQuote = quoteBody
			.split('\n')
			.map((line) => line ? `> ${line}` : '>')
			.join('\n');

		return `\n\n${markdownQuote}\n\n`;
	},
);

export const normalizeCc98Markdown = (content: string) => convertQuoteBlocks(content.replace(/\r\n?/g, '\n'))
	.replace(/\[url=([^\]\n]{1,500})\]([\s\S]*?)\[\/url\]/gi, (_match, url: string, label: string) => toMarkdownLink(url, label))
	.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, (_match, url: string) => {
		const href = normalizeCc98Url(url);
		return href && isSafeUrl(href) ? `<${href}>` : url.trim();
	})
	.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, (_match, value: string) => `**${value.trim()}**`)
	.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, (_match, value: string) => `*${value.trim()}*`)
	.replace(/\[(?:s|del|strike)\]([\s\S]*?)\[\/(?:s|del|strike)\]/gi, (_match, value: string) => `~~${value.trim()}~~`)
	.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '$1')
	.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, (_match, code: string) => `\n\n\`\`\`\n${code.trim()}\n\`\`\`\n\n`)
	.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (_match, source: string) => {
		const url = source.trim();
		return url ? `\n\n![](${url})\n\n` : '\n';
	})
	.replace(/<br\s*\/?>/gi, '\n')
	.replace(/\[\*\]/g, '\n- ')
	.replace(/\[(\/)?(?:size|color|font|align|center|left|right|table|tr|td|list|ol|ul|li)(?:=[^\]\n]{0,120})?\]/gi, '')
	.replace(/\[(?:tb|ac|em|ldln|zk|han|tsj|st|w|yz|mj|xk|doge|cc\d+)[^\]\n]{0,20}\]/gi, '')
	.replace(/\p{Extended_Pictographic}/gu, '')
	.replace(/[\uFE0F\u200D]/g, '')
	.replace(/^(#{1,6})(?!#)(?=\S)/gm, '$1 ')
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
