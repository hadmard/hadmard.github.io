// 文件说明：该文件维护站点的双语结构化内容数据。
// 功能说明：集中提供博客导航与少量页面文案，避免页面层反复硬编码。

export type Locale = 'zh-cn' | 'en';

export interface SiteSectionLink {
	id: string;
	label: string;
}

interface SiteCopy {
	brand: {
		name: string;
		caption: string;
	};
	seo: {
		title: string;
		description: string;
	};
	nav: SiteSectionLink[];
	hero: {
		badge: string;
		title: string;
		description: string;
		primaryCta: string;
		secondaryCta: string;
		metrics: Array<{
			label: string;
			value: string;
			note: string;
		}>;
	};
	investments: {
		kicker: string;
		title: string;
		intro: string;
		emptyTitle: string;
		emptyDescription: string;
	};
	thinking: {
		kicker: string;
		title: string;
		intro: string;
		readMore: string;
		emptyTitle: string;
		emptyDescription: string;
		commentTitle: string;
		commentNote: string;
	};
	post: {
		backLabel: string;
		otherLocaleLabel: string;
		relatedTitle: string;
	};
	footer: {
		title: string;
		description: string;
		note: string;
	};
}

export const siteCopy: Record<Locale, SiteCopy> = {
	'zh-cn': {
		brand: {
			name: 'Yfcccc',
			caption: '个人博客',
		},
		seo: {
			title: 'Yfcccc | 个人博客',
			description: 'Yfcccc 的个人博客：投资记录与随笔。',
		},
		nav: [
			{ id: 'investments', label: '投资记录' },
			{ id: 'thinking', label: '随笔' },
		],
		hero: {
			badge: 'Blog',
			title: 'Yfcccc',
			description: '写点记录，留给以后看。',
			primaryCta: '投资记录',
			secondaryCta: '随笔',
			metrics: [
				{ label: '投资记录', value: '原文整理', note: '只去掉图片和表情。' },
				{ label: '随笔', value: '慢慢写', note: '不急。' },
			],
		},
		investments: {
			kicker: '投资记录',
			title: '投资记录',
			intro: '同步自原帖，只清理图片、表情和格式标签。',
			emptyTitle: '还没有记录',
			emptyDescription: '本地没有读到可展示的投资记录。',
		},
		thinking: {
			kicker: '随笔',
			title: '随笔',
			intro: '想清楚一点，再写下来。',
			readMore: '阅读',
			emptyTitle: '还没写',
			emptyDescription: '先空着。',
			commentTitle: '评论',
			commentNote: '文章页再显示评论。',
		},
		post: {
			backLabel: '返回首页',
			otherLocaleLabel: '切换到英文版',
			relatedTitle: '继续阅读',
		},
		footer: {
			title: '慢慢写。',
			description: '少一点装饰，多一点真实记录。',
			note: '下一步：补第一篇随笔。',
		},
	},
	en: {
		brand: {
			name: 'Yfcccc',
			caption: 'Personal Blog',
		},
		seo: {
			title: 'Yfcccc | Personal Blog',
			description: 'A personal blog for investment notes and essays.',
		},
		nav: [
			{ id: 'investments', label: 'Investments' },
			{ id: 'thinking', label: 'Notes' },
		],
		hero: {
			badge: 'Blog',
			title: 'Yfcccc',
			description: 'Notes for later.',
			primaryCta: 'Investments',
			secondaryCta: 'Notes',
			metrics: [
				{ label: 'Investments', value: 'Raw notes', note: 'Images and emoji removed.' },
				{ label: 'Notes', value: 'Slow writing', note: 'No rush.' },
			],
		},
		investments: {
			kicker: 'Investments',
			title: 'Investments',
			intro: 'Synced from the source topic. Images, emoji, and formatting tags are removed.',
			emptyTitle: 'No records yet',
			emptyDescription: 'No local investment records were found.',
		},
		thinking: {
			kicker: 'Notes',
			title: 'Notes',
			intro: 'Think first, write later.',
			readMore: 'Read',
			emptyTitle: 'Nothing here yet',
			emptyDescription: 'Leaving this quiet for now.',
			commentTitle: 'Comments',
			commentNote: 'Comments belong on article pages.',
		},
		post: {
			backLabel: 'Back home',
			otherLocaleLabel: 'Switch to Chinese',
			relatedTitle: 'More',
		},
		footer: {
			title: 'Write slowly.',
			description: 'Less decoration, more real notes.',
			note: 'Next: publish the first essay.',
		},
	},
};
