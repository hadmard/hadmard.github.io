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

const quotePrefixForDepth = (depth: number) => `${'> '.repeat(depth)}`;

const prefixQuotedText = (content: string, depth: number) => {
	if (depth <= 0 || !content) return content;
	const prefix = quotePrefixForDepth(depth);
	return content
		.split('\n')
		.map((line) => `${prefix}${line}`)
		.join('\n');
};

const preserveCc98QuoteBlocks = (content: string) => {
	let output = '';
	let lastIndex = 0;
	let depth = 0;

	for (const match of content.matchAll(quoteTokenPattern)) {
		const index = match.index ?? 0;
		const token = match[0];
		const isClosing = /^\[\/quote/i.test(token);

		if (isClosing) {
			output += prefixQuotedText(content.slice(lastIndex, index), depth);
			depth = Math.max(0, depth - 1);
			output += '\n\n';
			lastIndex = index + token.length;
			continue;
		}

		output += prefixQuotedText(content.slice(lastIndex, index), depth);
		if (!output.endsWith('\n\n')) output += '\n\n';
		depth += 1;
		lastIndex = index + token.length;
	}

	return output + prefixQuotedText(content.slice(lastIndex), depth);
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

const getClassList = (node: Element) => {
	const value = node.properties?.className ?? node.properties?.class;
	if (Array.isArray(value)) return value.map(String);
	if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
	return [];
};

const appendClassName = (node: Element, className: string) => {
	const classList = getClassList(node);
	if (classList.includes(className)) return;
	node.properties = {
		...node.properties,
		class: [...classList, className].join(' '),
	};
};

const textNode = (value: string): Text => ({
	type: 'text',
	value,
});

const tokenNode = (className: string, value: string): Element => ({
	type: 'element',
	tagName: 'span',
	properties: {
		className: ['code-token', className],
	},
	children: [textNode(value)],
});

const getTextContent = (node: Element | Text): string => {
	if (node.type === 'text') return node.value;
	return node.children.map((child) => {
		if (child.type === 'text' || child.type === 'element') return getTextContent(child);
		return '';
	}).join('');
};

const isElement = (value: unknown): value is Element => (
	Boolean(value)
	&& value !== null
	&& typeof value === 'object'
	&& 'type' in value
	&& (value as { type?: unknown }).type === 'element'
);

const codeTokenPattern = /#.*$|\$\([^)]+\)|\$[@<^?*]|\b(?:ifeq|ifneq|ifdef|ifndef|else|endif|include|define|endef|for|do|done|if|then|fi)\b|\.PHONY\b|-include\b|(?:^|\s)[@-]?(?:cc|gcc|clang|g\+\+|c\+\+|rm|echo|mkdir|cp|mv|ar|ld|make|python3?|node|pnpm|npm|git|grep|sed|awk|cat|ls|cd)\b|(?:^|\s)(?:-{1,2}[A-Za-z][\w-]*(?:=[^\s]+)?|-I[^\s]+)|\b[\w./%+@-]+\.(?:c|cc|cpp|h|hpp|o|a|so|d|mk|makefile|out)\b/g;
const shellLikePattern = /(?:^|\s)(?:cc|gcc|clang|make|git|pnpm|npm|node|python3?|rm|mkdir|cp|mv)\b|(?:^|\s)-[A-Za-z][\w-]*|\b[\w./%+@-]+\.(?:c|h|o|a|so|d|mk|out)\b|\$\([^)]+\)|\$[@<^?*]/m;
const makefileLikePattern = /^\s*[^:=#\s][^:=#]*\s*:/m;

const classForCodeToken = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return '';
	if (trimmed.startsWith('#')) return 'code-token-comment';
	if (trimmed.startsWith('$')) return 'code-token-variable';
	if (trimmed === '.PHONY' || trimmed === '-include' || /^(ifeq|ifneq|ifdef|ifndef|else|endif|include|define|endef|for|do|done|if|then|fi)$/.test(trimmed)) {
		return 'code-token-keyword';
	}
	if (/^[@-]?(cc|gcc|clang|g\+\+|c\+\+|rm|echo|mkdir|cp|mv|ar|ld|make|python3?|node|pnpm|npm|git|grep|sed|awk|cat|ls|cd)$/.test(trimmed)) {
		return 'code-token-command';
	}
	if (/^(-{1,2}[A-Za-z][\w-]*(?:=[^\s]+)?|-I[^\s]+)$/.test(trimmed)) return 'code-token-flag';
	if (/\.(?:c|cc|cpp|h|hpp|o|a|so|d|mk|makefile|out)$/.test(trimmed)) return 'code-token-file';
	return '';
};

const splitLeadingWhitespace = (value: string) => {
	const match = value.match(/^(\s+)(\S[\s\S]*)$/);
	if (!match) return ['', value] as const;
	return [match[1], match[2]] as const;
};

const tokenizeCodeText = (value: string): Array<Element | Text> => {
	const nodes: Array<Element | Text> = [];
	let cursor = 0;

	for (const match of value.matchAll(codeTokenPattern)) {
		const rawToken = match[0];
		const index = match.index ?? 0;
		const className = classForCodeToken(rawToken);
		if (!className || index < cursor) continue;

		if (index > cursor) nodes.push(textNode(value.slice(cursor, index)));

		const [leadingWhitespace, token] = splitLeadingWhitespace(rawToken);
		if (leadingWhitespace) nodes.push(textNode(leadingWhitespace));
		nodes.push(tokenNode(className, token));
		cursor = index + rawToken.length;

		if (className === 'code-token-comment') break;
	}

	if (cursor < value.length) nodes.push(textNode(value.slice(cursor)));
	return nodes.length ? nodes : [textNode(value)];
};

const tokenizeMakefileLine = (value: string): Array<Element | Text> => {
	if (/^\s*#/.test(value)) {
		const [leadingWhitespace, comment] = splitLeadingWhitespace(value);
		return [
			leadingWhitespace ? textNode(leadingWhitespace) : null,
			tokenNode('code-token-comment', comment),
		].filter(Boolean) as Array<Element | Text>;
	}

	const targetMatch = value.match(/^(\s*)([^:=#\s][^:=#]*?)(\s*:)/);
	if (targetMatch) {
		const prefix = targetMatch[1];
		const target = targetMatch[2];
		const separator = targetMatch[3];
		return [
			prefix ? textNode(prefix) : null,
			tokenNode('code-token-target', target),
			textNode(separator),
			...tokenizeCodeText(value.slice(targetMatch[0].length)),
		].filter(Boolean) as Array<Element | Text>;
	}

	const assignmentMatch = value.match(/^(\s*)([A-Za-z_][\w.-]*)(\s*(?::=|\+=|\?=|=))/);
	if (assignmentMatch) {
		const prefix = assignmentMatch[1];
		const variable = assignmentMatch[2];
		const operator = assignmentMatch[3];
		return [
			prefix ? textNode(prefix) : null,
			tokenNode('code-token-variable', variable),
			textNode(operator),
			...tokenizeCodeText(value.slice(assignmentMatch[0].length)),
		].filter(Boolean) as Array<Element | Text>;
	}

	return tokenizeCodeText(value);
};

const enhanceCodeBlockLines = (pre: Element, language: string) => {
	const code = pre.children.find((child): child is Element => isElement(child) && child.tagName === 'code');
	if (!code) return;

	const codeText = getTextContent(code);
	const normalizedLanguage = language.toLowerCase();
	const isMakefile = normalizedLanguage === 'makefile' || (normalizedLanguage === 'plaintext' && makefileLikePattern.test(codeText));
	const isShellLike = ['bash', 'shell', 'sh', 'zsh'].includes(normalizedLanguage) || (normalizedLanguage === 'plaintext' && shellLikePattern.test(codeText));

	if (!isMakefile && !isShellLike) return;

	appendClassName(pre, 'syntax-rich');
	appendClassName(pre, isMakefile ? 'syntax-rich-makefile' : 'syntax-rich-shell');

	code.children.forEach((child) => {
		if (!isElement(child) || child.tagName !== 'span' || !getClassList(child).includes('line')) return;

		const lineText = getTextContent(child);
		if (isMakefile && makefileLikePattern.test(lineText)) appendClassName(child, 'code-line-target');
		if (isMakefile && /^\s+[@-]?\S/.test(lineText)) appendClassName(child, 'code-line-recipe');
		child.children = isMakefile ? tokenizeMakefileLine(lineText) : tokenizeCodeText(lineText);
	});
};

const rehypeEnhanceCodeBlocks: RehypePlugin = () => (tree: Root) => {
	visit(tree, 'element', (node: Element) => {
		if (node.tagName !== 'pre') return;
		const language = firstString(node.properties?.['data-language'] ?? node.properties?.dataLanguage);
		enhanceCodeBlockLines(node, language);
	});
};

const markdownProcessor = createMarkdownProcessor({
	gfm: true,
	smartypants: true,
	shikiConfig: {
		theme: 'github-light',
	},
	remarkRehype: { allowDangerousHtml: false },
	rehypePlugins: [rehypeHardenLinks, rehypeRenderLightMath, rehypeEnhanceCodeBlocks],
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

const cc98EmoteMap: Record<string, string> = {
	ac01: '😂',
	ac02: '🙂',
	ac03: '😅',
	ac04: '😮',
	ac05: '😢',
	ac06: '😡',
	ac07: '😳',
	ac08: '😎',
	ac09: '🤔',
	ac10: '😴',
	ac13: '😌',
	ac20: '😮‍💨',
	ac32: '😭',
	ac34: '😵',
	ac1003: '🤔',
	ac2054: '🫡',
	cc9801: '🙂',
	cc9802: '😅',
	cc9803: '😂',
	cc9804: '🥲',
	cc9805: '🤝',
	cc9806: '💧',
	cc9810: '😴',
	cc9823: '📈',
	cc9832: '💪',
	tb02: '🙂',
	tb03: '😂',
	tb13: '👍',
};

const renderCc98Emote = (value: string) => {
	const key = value.match(/^\[([a-z]+(?:\d+)?|cc\d+)/i)?.[1]?.toLowerCase();
	if (!key) return value;
	return cc98EmoteMap[key] ?? `:${key}:`;
};

export const normalizeCc98Markdown = (content: string) => preserveCc98QuoteBlocks(content.replace(/\r\n?/g, '\n'))
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
	.replace(/\[(?:tb|ac|em|ldln|zk|han|tsj|st|w|yz|mj|xk|doge|cc\d+)[^\]\n]{0,20}\]/gi, renderCc98Emote)
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
