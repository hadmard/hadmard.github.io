#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DEFAULT_DB = '/Users/yifei/Library/Application Support/pcsuite/database/CalendarSync.db';
const DEFAULT_OUT = 'custom/vivo-calendar-sync/output/schedule-records.json';
const DEFAULT_START = '2026-07-05';
const DEFAULT_END = '2026-07-26';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
	const arg = process.argv[index];
	if (arg.startsWith('--')) {
		args.set(arg.slice(2), process.argv[index + 1]);
		index += 1;
	}
}

const sourceDb = args.get('db') ?? DEFAULT_DB;
const outFile = resolve(process.cwd(), args.get('out') ?? DEFAULT_OUT);
const startDate = args.get('start') ?? DEFAULT_START;
const endDate = args.get('end') ?? DEFAULT_END;
const snapshot = resolve(process.cwd(), 'custom/vivo-calendar-sync/tmp/CalendarSync.snapshot.db');

const coursePatterns = [
	/超算概述/,
	/集群软硬件/,
	/HPC中的计算机系统/,
	/向量化并行计算/,
	/CUDA编程/,
	/OpenMP\/MPI/,
	/性能分析技术/,
	/高性能计算高级/,
	/华为CANN/,
	/华为HCCL/,
	/高性能网络基础/,
	/机器学习基础/,
	/机器学习高级/,
];

const titleCorrections = new Map([
	['高性能计算高级话剧', '高性能计算高级话题'],
	['机器学习高级话剧', '机器学习高级话题'],
]);

const solarTerms = [
	{ date: '2026-07-07', name: '小暑', source: 'vivo-ui-overlay' },
	{ date: '2026-07-23', name: '大暑', source: 'vivo-ui-overlay' },
];

const pad = (value) => String(value).padStart(2, '0');

const localParts = (ms) => {
	const date = new Date(ms);
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		weekday: date.getDay(),
	};
};

const localDate = (ms) => {
	const parts = localParts(ms);
	return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
};

const localTime = (ms) => {
	const parts = localParts(ms);
	return `${pad(parts.hour)}:${pad(parts.minute)}`;
};

const localIso = (ms) => `${localDate(ms)}T${localTime(ms)}:00+08:00`;

const msFromLocal = (date, time) => new Date(`${date}T${time}:00+08:00`).getTime();

const minutesBetween = (startMs, endMs) => Math.max(0, Math.round((endMs - startMs) / 60000));

const isCourse = (title) => coursePatterns.some((pattern) => pattern.test(title));

const getType = (event) => {
	if (event.allDay) return 'travel';
	if (event.isCourse) return 'course';
	if (/家教/.test(event.title)) return 'tutoring';
	if (/吃饭|接/.test(event.title)) return 'personal';
	if (/夏令营/.test(event.title)) return 'service';
	if (/Codex/.test(event.title)) return 'talk';
	return 'plan';
};

const queryRows = (dbPath) => {
	const sql = `
SELECT
  e._id AS id,
  e.title,
  e.calendar_id AS calendarId,
  c.displayName AS calendarName,
  c.color AS calendarColor,
  i.begin AS beginMs,
  i.end AS endMs,
  e.allDay,
  e.location
FROM Instances i
JOIN Events e ON e._id = i.event_id
LEFT JOIN Calendar c ON c._id = e.calendar_id
WHERE i.begin BETWEEN strftime('%s', '${startDate} 00:00:00') * 1000
                  AND strftime('%s', '${endDate} 00:00:00') * 1000
  AND (e.deleted IS NULL OR e.deleted = 0)
ORDER BY i.begin, e._id;
`;

	const output = execFileSync('sqlite3', ['-json', dbPath, sql], { encoding: 'utf-8' });
	return JSON.parse(output);
};

mkdirSync(dirname(snapshot), { recursive: true });
copyFileSync(sourceDb, snapshot);

const rawRows = queryRows(snapshot);
const records = rawRows.map((row) => {
	const displayTitle = titleCorrections.get(row.title) ?? row.title;
	const sourceStartMs = Number(row.beginMs);
	const sourceEndMs = Number(row.endMs);
	const date = localDate(sourceStartMs);
	const course = isCourse(displayTitle);
	let startMs = sourceStartMs;
	let endMs = sourceEndMs;
	let normalizedByRule = false;

	if (course) {
		const sourceHour = localParts(sourceStartMs).hour;
		const startTime = sourceHour < 12 ? '08:30' : '14:00';
		startMs = msFromLocal(date, startTime);
		endMs = startMs + 3 * 60 * 60 * 1000;
		normalizedByRule = startMs !== sourceStartMs || endMs !== sourceEndMs;
	}

	const base = {
		id: Number(row.id),
		title: displayTitle,
		date,
		startTime: localTime(startMs),
		endTime: localTime(endMs),
		startIso: localIso(startMs),
		endIso: localIso(endMs),
		durationMinutes: minutesBetween(startMs, endMs),
		allDay: Boolean(row.allDay),
		calendarId: Number(row.calendarId),
		calendarName: row.calendarName ?? 'Unknown',
		calendarColor: Number(row.calendarColor ?? 0),
		location: row.location || '',
		source: {
			startTime: localTime(sourceStartMs),
			endTime: localTime(sourceEndMs),
			startIso: localIso(sourceStartMs),
			endIso: localIso(sourceEndMs),
		},
		isCourse: course,
		normalizedByRule,
	};

	return {
		...base,
		type: getType(base),
	};
});

const dayMap = new Map();
for (const record of records) {
	if (!dayMap.has(record.date)) {
		const ms = msFromLocal(record.date, '00:00');
		dayMap.set(record.date, {
			date: record.date,
			weekday: localParts(ms).weekday,
			events: [],
			solarTerms: solarTerms.filter((term) => term.date === record.date),
		});
	}
	dayMap.get(record.date).events.push(record);
}

for (const term of solarTerms) {
	if (!dayMap.has(term.date)) {
		const ms = msFromLocal(term.date, '00:00');
		dayMap.set(term.date, {
			date: term.date,
			weekday: localParts(ms).weekday,
			events: [],
			solarTerms: [term],
		});
	}
}

const days = [...dayMap.values()].sort((a, b) => a.date.localeCompare(b.date));

const payload = {
	generatedAt: new Date().toISOString(),
	source: {
		type: 'vivo-calendar-sqlite',
		databasePath: sourceDb,
		snapshotPath: 'custom/vivo-calendar-sync/tmp/CalendarSync.snapshot.db',
	},
	range: {
		start: startDate,
		end: endDate,
	},
	courseRule: {
		morning: '08:30-11:30',
		afternoon: '14:00-17:00',
		durationMinutes: 180,
		description: '课程按用户确认规则归一化：上午 08:30 开始，下午 14:00 开始，课时均为 3 小时。',
	},
	records,
	days,
	stats: {
		total: records.length,
		courses: records.filter((record) => record.isCourse).length,
		normalized: records.filter((record) => record.normalizedByRule).length,
		allDay: records.filter((record) => record.allDay).length,
	},
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');

console.log(`Wrote ${records.length} schedule records to ${outFile}`);
