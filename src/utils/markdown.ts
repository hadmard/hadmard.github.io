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
const quoteTokenPattern = /\[\/?quote(?:=[^\]\n]{0,160})?\]/gi;

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

const translateTexSymbols = (value: string) => value.replace(texSymbolPattern, (match, command: string) => texSymbolMap.get(command) ?? match);

const pushPlainTextWithMathSymbols = (nodes: Array<Text | Element>, value: string) => {
	if (!value) return;
	const symbolNodes = splitTextWithMathSymbols(value);
	if (symbolNodes) {
		nodes.push(...symbolNodes);
		return;
	}
	nodes.push(createTextNode(value));
};

const findClosingDollar = (value: string, startIndex: number) => {
	for (let index = startIndex; index < value.length; index += 1) {
		if (value[index] === '\n') return -1;
		if (value[index] !== '$') continue;
		if (value[index - 1] === '\\') continue;
		if (value[index + 1] === '$') continue;
		return index;
	}

	return -1;
};

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

const splitTextWithInlineMath = (value: string) => {
	const nodes: Array<Text | Element> = [];
	let lastIndex = 0;
	let index = 0;

	while (index < value.length) {
		if (value[index] !== '$' || value[index - 1] === '\\' || value[index + 1] === '$') {
			index += 1;
			continue;
		}

		const closingIndex = findClosingDollar(value, index + 1);
		if (closingIndex === -1) {
			index += 1;
			continue;
		}

		const expression = value.slice(index + 1, closingIndex).trim();
		if (!expression || expression.length > 160) {
			index = closingIndex + 1;
			continue;
		}

		pushPlainTextWithMathSymbols(nodes, value.slice(lastIndex, index));
		nodes.push(createMathSymbolNode(translateTexSymbols(expression)));
		lastIndex = closingIndex + 1;
		index = closingIndex + 1;
	}

	if (!nodes.length) return splitTextWithMathSymbols(value);
	pushPlainTextWithMathSymbols(nodes, value.slice(lastIndex));
	return nodes;
};

export const stripCc98QuoteBlocks = (content: string) => {
	let output = '';
	let lastIndex = 0;
	let depth = 0;

	for (const match of content.matchAll(quoteTokenPattern)) {
		const index = match.index ?? 0;
		const token = match[0];
		const isClosing = /^\[\/quote/i.test(token);

		if (isClosing) {
			if (depth > 0) {
				depth -= 1;
				if (depth === 0) lastIndex = index + token.length;
				continue;
			}

			output += content.slice(lastIndex, index);
			lastIndex = index + token.length;
			continue;
		}

		if (depth === 0) {
			output += content.slice(lastIndex, index);
		}
		depth += 1;
	}

	if (depth === 0) {
		output += content.slice(lastIndex);
	}

	return output;
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

		const replacementNodes = splitTextWithInlineMath(node.value);
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

export const normalizeCc98Markdown = (content: string) => stripCc98QuoteBlocks(content.replace(/\r\n?/g, '\n'))
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
