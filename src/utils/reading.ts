export type ReadingOutlineItem = {
	id: string;
	label: string;
	level: number;
};

const stripInlineMarkdown = (value: string) => value
	.replace(/!\[[^\]]*]\([^)]+\)/g, '')
	.replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
	.replace(/`([^`]+)`/g, '$1')
	.replace(/[*_~]/g, '')
	.replace(/<[^>]+>/g, '')
	.trim();

const slugBase = (value: string) => {
	const slug = stripInlineMarkdown(value)
		.normalize('NFKC')
		.toLowerCase()
		.replace(/[^\p{Letter}\p{Number}\s_-]+/gu, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');

	return slug || 'section';
};

export const slugifyHeading = (value: string, seen = new Map<string, number>()) => {
	const base = slugBase(value);
	const count = seen.get(base) ?? 0;
	seen.set(base, count + 1);
	return count ? `${base}-${count}` : base;
};

export const extractMarkdownOutline = (content: string): ReadingOutlineItem[] => {
	const items: ReadingOutlineItem[] = [];
	const seen = new Map<string, number>();
	let inFence = false;

	for (const line of content.replace(/\r\n?/g, '\n').split('\n')) {
		if (/^\s*```/.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;

		const match = line.match(/^(#{1,6})\s+(.+)$/);
		if (!match) continue;

		const label = stripInlineMarkdown(match[2].replace(/\s+#+\s*$/, ''));
		if (!label) continue;

		items.push({
			id: slugifyHeading(label, seen),
			label,
			level: Math.min(6, match[1].length),
		});
	}

	return items;
};

export const extractParagraphOutline = (content: string, limit = 8): ReadingOutlineItem[] => content
	.replace(/\r\n?/g, '\n')
	.split(/\n{2,}/)
	.map((paragraph) => stripInlineMarkdown(paragraph).replace(/\s+/g, ' '))
	.filter(Boolean)
	.slice(0, limit)
	.map((paragraph, index) => ({
		id: `paragraph-${index + 1}`,
		label: paragraph.length > 24 ? `${paragraph.slice(0, 24)}...` : paragraph,
		level: 2,
	}));

export const createFloorOutline = (records: Array<{ floor: number; time?: string }>, locale: 'zh-cn' | 'en'): ReadingOutlineItem[] => {
	const localeTag = locale === 'zh-cn' ? 'zh-CN' : 'en-US';
	return records.map((record) => {
		const timeLabel = record.time
			? new Date(record.time).toLocaleDateString(localeTag, { month: '2-digit', day: '2-digit' })
			: '';
		const floorLabel = locale === 'zh-cn' ? `${record.floor} 楼` : `Floor ${record.floor}`;

		return {
			id: `floor-${record.floor}`,
			label: timeLabel ? `${floorLabel} · ${timeLabel}` : floorLabel,
			level: 2,
		};
	});
};
