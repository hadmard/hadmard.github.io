// 文件说明：站点的构建期数据注册表。
// 功能说明：把页面会用到的数据源、同步配置与静态文案集中到一个入口。

import { siteCopy } from './site';

export type Cc98TopicKey = 'investments' | 'studyCalendar' | 'healthRoutine';

export interface Cc98TopicConfig {
	key: Cc98TopicKey;
	topicId: string;
	outputSlug: string;
	sourceUrl: string;
	ownerName: string;
	fallbackToAllAuthors: boolean;
	placeholderTexts: string[];
}

export const siteDatabase = {
	copy: siteCopy,
	schedule: {
		outputFile: 'custom/vivo-calendar-sync/output/schedule-records.json',
		sourceDatabase: '/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db',
	},
	cc98: {
		outputRoot: 'custom/cc98-investment-crawler/output',
		topics: {
			investments: {
				key: 'investments',
				topicId: '6450962',
				outputSlug: 'topic-6450962',
				sourceUrl: 'https://www.cc98.org/topic/6450962',
				ownerName: 'hadmard',
				fallbackToAllAuthors: true,
				placeholderTexts: ['记录投资日常', 'test'],
			},
			studyCalendar: {
				key: 'studyCalendar',
				topicId: '6548170',
				outputSlug: 'topic-6548170',
				sourceUrl: 'https://www.cc98.org/topic/6548170',
				ownerName: 'hadmard',
				fallbackToAllAuthors: false,
				placeholderTexts: [],
			},
			healthRoutine: {
				key: 'healthRoutine',
				topicId: '6562405',
				outputSlug: 'topic-6562405',
				sourceUrl: 'https://www.cc98.org/topic/6562405',
				ownerName: 'hadmard',
				fallbackToAllAuthors: false,
				placeholderTexts: [],
			},
		} satisfies Record<Cc98TopicKey, Cc98TopicConfig>,
	},
} as const;

export const getCc98TopicConfig = (key: Cc98TopicKey) => siteDatabase.cc98.topics[key];
