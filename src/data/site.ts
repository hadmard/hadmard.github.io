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
				{ label: '投资记录', value: '小散的破产之路', note: '14 条手记' },
				{ label: '随笔', value: '想法', note: '' },
			],
		},
		investments: {
			kicker: '投资记录',
			title: '投资记录',
			intro: '',
			emptyTitle: '还没有记录',
			emptyDescription: '暂时空着。',
		},
		thinking: {
			kicker: '随笔',
			title: '随笔',
			intro: '',
			readMore: '阅读',
			emptyTitle: '还没写',
			emptyDescription: '先空着。',
			commentTitle: '评论',
			commentNote: '文章页再显示评论。',
		},
		post: {
			backLabel: '返回随笔',
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
				{ label: 'Investments', value: 'Market Notes', note: '14 entries' },
				{ label: 'Notes', value: 'Thoughts', note: '' },
			],
		},
		investments: {
			kicker: 'Investments',
			title: 'Investments',
			intro: '',
			emptyTitle: 'No records yet',
			emptyDescription: 'Quiet for now.',
		},
		thinking: {
			kicker: 'Notes',
			title: 'Notes',
			intro: '',
			readMore: 'Read',
			emptyTitle: 'Nothing here yet',
			emptyDescription: 'Leaving this quiet for now.',
			commentTitle: 'Comments',
			commentNote: 'Comments belong on article pages.',
		},
		post: {
			backLabel: 'Back to Notes',
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
