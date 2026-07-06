// 文件说明：vivo 日程同步数据访问层。
// 功能说明：读取本地导出的静态 JSON，并提供页面渲染需要的聚合信息。

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { siteDatabase } from '../data/database';

export type ScheduleType = 'course' | 'tutoring' | 'personal' | 'service' | 'talk' | 'travel' | 'plan';

export interface ScheduleRecord {
	id: number;
	title: string;
	date: string;
	startTime: string;
	endTime: string;
	startIso: string;
	endIso: string;
	durationMinutes: number;
	allDay: boolean;
	calendarId: number;
	calendarName: string;
	calendarColor: number;
	location: string;
	source: {
		startTime: string;
		endTime: string;
		startIso: string;
		endIso: string;
	};
	isCourse: boolean;
	normalizedByRule: boolean;
	type: ScheduleType;
}

export interface ScheduleDay {
	date: string;
	weekday: number;
	events: ScheduleRecord[];
	solarTerms: Array<{
		date: string;
		name: string;
		source: string;
	}>;
}

export interface ScheduleDataset {
	generatedAt: string;
	source: {
		type: string;
		databasePath: string;
		snapshotPath: string;
	};
	range: {
		start: string;
		end: string;
	};
	courseRule: {
		morning: string;
		afternoon: string;
		durationMinutes: number;
		description: string;
	};
	records: ScheduleRecord[];
	days: ScheduleDay[];
	stats: {
		total: number;
		courses: number;
		normalized: number;
		allDay: number;
	};
}

export const emptyScheduleDataset: ScheduleDataset = {
	generatedAt: '',
	source: {
		type: 'vivo-calendar-sqlite',
		databasePath: siteDatabase.schedule.sourceDatabase,
		snapshotPath: '',
	},
	range: {
		start: '',
		end: '',
	},
	courseRule: {
		morning: '08:30-11:30',
		afternoon: '14:00-17:00',
		durationMinutes: 180,
		description: '',
	},
	records: [],
	days: [],
	stats: {
		total: 0,
		courses: 0,
		normalized: 0,
		allDay: 0,
	},
};

export const loadScheduleDataset = async (): Promise<ScheduleDataset> => {
	try {
		const filePath = resolve(process.cwd(), siteDatabase.schedule.outputFile);
		return JSON.parse(await readFile(filePath, 'utf-8')) as ScheduleDataset;
	} catch {
		return emptyScheduleDataset;
	}
};

export const getNextScheduleRecord = (records: ScheduleRecord[], now = new Date()) => {
	const currentMs = now.getTime();
	return records.find((record) => new Date(record.endIso).getTime() >= currentMs) ?? records[0] ?? null;
};
