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
	studyCalendar: {
		kicker: string;
		title: string;
		intro: string;
		emptyTitle: string;
		emptyDescription: string;
		sourceLabel: string;
		entryLabel: string;
	};
	healthRoutine: {
		kicker: string;
		title: string;
		intro: string;
		emptyTitle: string;
		emptyDescription: string;
		sourceLabel: string;
		entryLabel: string;
	};
	redemptionRoad: {
		kicker: string;
		title: string;
		intro: string;
		emptyTitle: string;
		emptyDescription: string;
		readMore: string;
		entryLabel: string;
		backLabel: string;
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
			name: '记录空间',
			caption: '随手记',
		},
		seo: {
			title: '记录空间 | Hadmard Archive',
			description: 'Hadmard 的个人记录：投资、思考、学习、作息和 CS 笔记。',
		},
		nav: [
			{ id: 'investments', label: '投资记录' },
			{ id: 'thinking', label: '个人思考' },
			{ id: 'study-calendar', label: '学习日历' },
			{ id: 'health-routine', label: '健康作息' },
			{ id: 'redemption-road', label: '救赎之路' },
		],
		hero: {
			badge: 'Blog',
			title: '写点记录。',
			description: '投资复盘、学习安排、作息打卡，还有偶尔冒出来的想法。都先放在这里。',
			primaryCta: '投资记录',
			secondaryCta: '个人思考',
			metrics: [
				{ label: '投资记录', value: '小散的破产之路', note: '同步自 CC98' },
				{ label: '个人思考', value: '四篇短记', note: '期末周 / 专业 / 休息 / 心气' },
				{ label: '学习日历', value: 'chmod +x life', note: '学习日记同步' },
				{ label: '健康作息', value: '健康作息打卡记录', note: '睡眠 / 喝水 / 运动' },
				{ label: '救赎之路', value: 'CS 复健笔记', note: 'Linux / HPC / Makefile' },
			],
		},
		investments: {
			kicker: '投资记录',
			title: '投资记录',
			intro: '',
			emptyTitle: '还没有记录',
			emptyDescription: '暂时空着。',
		},
		studyCalendar: {
			kicker: '学习日历',
			title: '学习日历',
			intro: '把复习节奏、待办和阶段记录放在同一条时间线上。',
			emptyTitle: '还没有学习记录',
			emptyDescription: '同步源暂时没有可展示内容。',
			sourceLabel: '原帖',
			entryLabel: '条记录',
		},
		healthRoutine: {
			kicker: '健康作息',
			title: '健康作息打卡记录',
			intro: '把睡眠、喝水、运动和身体状态放进一条轻量时间线。',
			emptyTitle: '还没有健康打卡',
			emptyDescription: '同步源暂时没有可展示内容。',
			sourceLabel: '原帖',
			entryLabel: '条记录',
		},
		redemptionRoad: {
			kicker: '救赎之路',
			title: '救赎之路',
			intro: '把重新补课的技术笔记整理成一条可以继续走下去的路。',
			emptyTitle: '还没有笔记',
			emptyDescription: '把 Markdown 放进同步源后，这里会自动生成阅读入口。',
			readMore: '阅读笔记',
			entryLabel: '篇笔记',
			backLabel: '返回救赎之路',
		},
		thinking: {
			kicker: '个人思考',
			title: '个人思考',
			intro: '一些阶段性的判断、反思和自我校准。',
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
			name: 'Hadmard Notes',
			caption: 'Notes for later',
		},
		seo: {
			title: 'Hadmard Notes | Personal Notes',
			description: 'Personal notes on investing, thinking, study plans, routines, and CS learning.',
		},
		nav: [
			{ id: 'investments', label: 'Investments' },
			{ id: 'thinking', label: 'Thinking' },
			{ id: 'study-calendar', label: 'Study Calendar' },
			{ id: 'health-routine', label: 'Health Routine' },
			{ id: 'redemption-road', label: 'Redemption' },
		],
		hero: {
			badge: 'Blog',
			title: 'Notes, kept.',
			description: 'Market notes, study plans, routines, and stray thoughts, all kept in one place.',
			primaryCta: 'Investments',
			secondaryCta: 'Thinking',
			metrics: [
				{ label: 'Investments', value: 'Market Notes', note: 'Synced from CC98' },
				{ label: 'Thinking', value: 'Four Notes', note: 'Exams / major / rest / confidence' },
				{ label: 'Study Calendar', value: 'chmod +x life', note: 'Study log sync' },
				{ label: 'Health Routine', value: 'Daily Check-ins', note: 'Sleep / water / movement' },
				{ label: 'Redemption', value: 'CS Recovery Notes', note: 'Linux / HPC / Makefile' },
			],
		},
		investments: {
			kicker: 'Investments',
			title: 'Investments',
			intro: '',
			emptyTitle: 'No records yet',
			emptyDescription: 'Quiet for now.',
		},
		studyCalendar: {
			kicker: 'Study Calendar',
			title: 'Study Calendar',
			intro: 'Review plans, todos, and progress notes on one timeline.',
			emptyTitle: 'No study records yet',
			emptyDescription: 'Nothing available from the synced source.',
			sourceLabel: 'source',
			entryLabel: 'entries',
		},
		healthRoutine: {
			kicker: 'Health Routine',
			title: 'Health Routine',
			intro: 'A calm timeline for sleep, water, movement, and recovery notes.',
			emptyTitle: 'No health check-ins yet',
			emptyDescription: 'Nothing available from the synced source.',
			sourceLabel: 'source',
			entryLabel: 'entries',
		},
		redemptionRoad: {
			kicker: 'Redemption Road',
			title: 'Redemption Road',
			intro: 'A quiet learning trail for rebuilding technical foundations note by note.',
			emptyTitle: 'No notes yet',
			emptyDescription: 'Markdown notes added to the source snapshot will appear here.',
			readMore: 'Read note',
			entryLabel: 'notes',
			backLabel: 'Back to Redemption Road',
		},
		thinking: {
			kicker: 'Thinking',
			title: 'Thinking',
			intro: 'Periodic notes, self-corrections, and reflections.',
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
