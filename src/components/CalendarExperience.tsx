// 文件说明：该文件实现根首页的交互式日历体验。
// 功能说明：从昨天开始生成 6x5 日期网格，支持按忙碌程度着色并查看单日详细日程。
//
// 结构概览：
//   第一部分：类型、静态示例数据与日期工具
//   第二部分：主组件状态与派生数据
//   第三部分：日历网格与详情面板渲染
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Sparkles } from 'lucide-react';
import type { PointerEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

type BusyLevel = 'green' | 'yellow' | 'red';

interface ScheduleItem {
	time: string;
	title: string;
	type: string;
	weight: 1 | 2 | 3;
	detail: string;
}

interface CourseItem {
	weekday: number;
	time: string;
	title: string;
	location: string;
	weight: 1 | 2 | 3;
}

interface TaskBlock {
	id: string;
	title: string;
	detail: string;
	type: string;
	weight: 1 | 2 | 3;
	due?: string;
	repeat?: 'daily' | 'weekly-twice';
	until?: string;
	blocks?: number;
	preferredDays?: number[];
}

interface CalendarDay {
	id: string;
	date: Date;
	dayIndex: number;
	busyLevel: BusyLevel;
	items: ScheduleItem[];
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BUSY_LABELS: Record<BusyLevel, string> = {
	green: '轻量',
	yellow: '中等',
	red: '高强度',
};

const BUSY_COPY: Record<BusyLevel, string> = {
	green: '留有余量，适合处理复盘、阅读和低压推进。',
	yellow: '有明确任务，需要合理分配专注块和恢复时间。',
	red: '日程密集，建议提前锁定核心事项并减少切换。',
};

const COURSE_SCHEDULE: CourseItem[] = [
	{ weekday: 1, time: '13:25-16:15', title: '精细农业', location: '紫金港西1-518', weight: 3 },
	{ weekday: 1, time: '18:50-20:30', title: '职业生涯与发展规划', location: '紫金港北2-225', weight: 2 },
	{ weekday: 2, time: '08:00-09:40', title: '农业生物系统传输过程', location: '紫金港西1-309', weight: 2 },
	{ weekday: 2, time: '10:00-11:40', title: '材料力学（乙）', location: '紫金港西2-517', weight: 2 },
	{ weekday: 2, time: '13:25-16:15', title: '托福阅读', location: '紫金港东6-332', weight: 2 },
	{ weekday: 3, time: '10:00-11:40', title: '农业物理学', location: '紫金港西2-519', weight: 2 },
	{ weekday: 3, time: '13:25-15:05', title: '精细农业实验', location: '紫金港农生组团D-612', weight: 2 },
	{ weekday: 3, time: '18:50-21:20', title: '金融学（投资）', location: '紫金港北3-219', weight: 2 },
	{ weekday: 4, time: '08:00-09:40', title: '材料力学（乙）', location: '紫金港西2-517', weight: 2 },
	{ weekday: 4, time: '10:00-11:40', title: '农业生物系统传输过程', location: '紫金港农生组团D-228', weight: 2 },
	{ weekday: 4, time: '13:25-16:15', title: '机械制图及计算机辅助设计', location: '紫金港农生组团D-414', weight: 3 },
	{ weekday: 4, time: '16:15-18:00', title: '材料力学实验', location: '紫金港西4-143', weight: 2 },
	{ weekday: 5, time: '08:00-09:40', title: '农业物科学', location: '紫金港农生组团D-241', weight: 2 },
	{ weekday: 5, time: '10:00-11:40', title: '篮球（初级）', location: '紫金港风雨操场', weight: 2 },
];

const TASK_BLOCK_TIMES: Record<number, string[]> = {
	0: ['09:30', '10:25', '14:00', '14:55', '19:30', '20:25', '21:20'],
	1: ['08:30', '09:25', '10:20', '17:00', '20:40', '21:35'],
	2: ['06:55', '12:15', '16:45', '19:30', '20:25', '21:20'],
	3: ['08:30', '12:15', '15:30', '16:25', '21:35'],
	4: ['06:55', '12:15', '18:10', '19:30', '20:25', '21:20'],
	5: ['12:15', '13:25', '14:20', '16:00', '19:30', '20:25'],
	6: ['09:30', '10:25', '14:00', '14:55', '19:30', '20:25', '21:20'],
};

const TODO_BLOCKS: TaskBlock[] = [
	{ id: 'cv', title: 'CV 项目完成', type: '项目', weight: 2, due: '7.15', until: '7.15', repeat: 'daily', detail: '每天 1 个 45min 时间块，持续推进 CV 项目。' },
	{ id: 'cad', title: 'CAD 七个作业', type: '作业', weight: 2, due: '6.6', until: '6.6', repeat: 'daily', detail: 'ddl 6.6，每天 1 个 45min 时间块。' },
	{ id: 'solidworks', title: 'SolidWorks 七个作业', type: '作业', weight: 2, due: '6.13', until: '6.13', repeat: 'daily', detail: 'ddl 6.13，每天 1 个 45min 时间块。' },
	{ id: 'ai-math', title: 'AI 数学基础', type: '学习', weight: 2, due: '6.6', until: '6.6', repeat: 'daily', detail: 'ddl 6.6，8 个单元，按 1 个 45min 时间块/天推进。' },
	{ id: 'toefl-words', title: '背托福单词', type: '英语', weight: 1, repeat: 'daily', detail: '每天 1 个 45min 时间块，保持连续记忆。' },
	{ id: 'tutor-prep', title: '下周家教备课', type: '备课', weight: 2, due: '6.6', until: '6.6', repeat: 'weekly-twice', preferredDays: [2, 4], detail: 'ddl 6.6，本周安排 2 个 45min 时间块。' },
	{ id: 'material-homework', title: '材料力学两次作业', type: '作业', weight: 2, due: '6.2', blocks: 2, detail: 'ddl 6.2，拆成 2 个 45min 时间块。' },
	{ id: 'thermo-homework', title: '热力学两次作业', type: '作业', weight: 2, due: '6.2', blocks: 2, detail: 'ddl 6.2，拆成 2 个 45min 时间块。' },
	{ id: 'srtp', title: 'SRTP 提交与实验', type: '实验', weight: 3, due: '6.6', blocks: 3, detail: '提交材料，qnd 跑一趟，顺便完成实验相关推进。' },
	{ id: 'precision-online', title: '精细农业网课', type: '网课', weight: 1, due: '6.6', blocks: 1, detail: 'ddl 6.6，安排 1 个 45min 时间块。' },
	{ id: 'boring-online', title: '无聊学网课', type: '网课', weight: 1, due: '6.6', blocks: 1, detail: 'ddl 6.6，安排 1 个 45min 时间块。' },
	{ id: 'fluid-report', title: '流体力学实验报告 2', type: '报告', weight: 2, due: '6.9', blocks: 1, detail: 'ddl 6.9，安排 1 个 45min 时间块。' },
	{ id: 'math-certificate', title: '拿数学竞赛证书', type: '事务', weight: 1, due: '6.9', blocks: 1, detail: 'ddl 6.9，安排 1 个 45min 时间块处理证书事项。' },
];

function toDateId(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatMonth(date: Date) {
	return new Intl.DateTimeFormat('zh-CN', { month: 'long', year: 'numeric' }).format(date);
}

function formatFullDate(date: Date) {
	return new Intl.DateTimeFormat('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
}

function formatCompactDate(date: Date) {
	return `${date.getMonth() + 1}.${date.getDate()}`;
}

function formatTaskTime(start: string) {
	const [hour, minute] = start.split(':').map(Number);
	const end = new Date(2026, 0, 1, hour, minute + 45);
	return `${start}-${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
}

function dateFromMonthDay(anchorYear: number, monthDay?: string) {
	if (!monthDay) return undefined;
	const [month, day] = monthDay.split('.').map(Number);
	return new Date(anchorYear, month - 1, day, 23, 59, 59, 999);
}

function isSameOrBefore(date: Date, target?: Date) {
	if (!target) return true;
	return date.getTime() <= target.getTime();
}

function getBusyLevel(items: ScheduleItem[]): BusyLevel {
	const score = items.reduce((sum, item) => sum + item.weight, 0);
	if (score >= 12 || items.length >= 7) return 'red';
	if (score >= 6 || items.length >= 4) return 'yellow';
	return 'green';
}

function createCalendarDays(anchorDate: Date) {
	const start = new Date(anchorDate);
	start.setHours(0, 0, 0, 0);
	start.setDate(start.getDate() - 1);

	const dayBlockIndex = new Map<number, number>();
	const days = Array.from({ length: 30 }, (_, dayIndex) => {
		const date = new Date(start);
		date.setDate(start.getDate() + dayIndex);
		const courseItems = COURSE_SCHEDULE.filter((course) => course.weekday === date.getDay()).map((course) => ({
			time: course.time,
			title: course.title,
			type: '课程',
			weight: course.weight,
			detail: course.location,
		}));

		return {
			id: toDateId(date),
			date,
			dayIndex,
			busyLevel: 'green' as BusyLevel,
			items: courseItems,
		};
	});

	const addTaskBlock = (dayIndex: number, task: TaskBlock, copyIndex?: number) => {
		const day = days[dayIndex];
		if (!day) return;
		const weekday = day.date.getDay();
		const usedIndex = dayBlockIndex.get(dayIndex) ?? 0;
		const slots = TASK_BLOCK_TIMES[weekday] ?? TASK_BLOCK_TIMES[0];
		const fallbackHour = 22 + Math.floor(Math.max(usedIndex - slots.length, 0) / 2);
		const fallbackMinute = Math.max(usedIndex - slots.length, 0) % 2 === 0 ? '05' : '55';
		const startTime = slots[usedIndex] ?? `${String(Math.min(fallbackHour, 23)).padStart(2, '0')}:${fallbackMinute}`;
		dayBlockIndex.set(dayIndex, usedIndex + 1);
		day.items.push({
			time: formatTaskTime(startTime),
			title: copyIndex ? `${task.title} ${copyIndex}` : task.title,
			type: task.type,
			weight: task.weight,
			detail: task.due ? `${task.detail} 截止：${task.due}` : task.detail,
		});
	};

	for (const task of TODO_BLOCKS.filter((item) => item.repeat)) {
		const until = dateFromMonthDay(start.getFullYear(), task.until);
		for (const day of days) {
			if (!isSameOrBefore(day.date, until)) continue;
			if (task.repeat === 'weekly-twice' && !task.preferredDays?.includes(day.date.getDay())) continue;
			addTaskBlock(day.dayIndex, task);
		}
	}

	for (const task of TODO_BLOCKS.filter((item) => !item.repeat)) {
		const due = dateFromMonthDay(start.getFullYear(), task.due);
		const candidateDays = days.filter((day) => isSameOrBefore(day.date, due));
		const blockCount = task.blocks ?? 1;
		for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
			const targetDay =
				candidateDays.reduce<CalendarDay | undefined>((bestDay, day) => {
					if (!bestDay) return day;
					const dayLoad = day.items.length + (dayBlockIndex.get(day.dayIndex) ?? 0);
					const bestLoad = bestDay.items.length + (dayBlockIndex.get(bestDay.dayIndex) ?? 0);
					if (dayLoad !== bestLoad) return dayLoad < bestLoad ? day : bestDay;
					return day.dayIndex < bestDay.dayIndex ? day : bestDay;
				}, undefined) ?? days[blockIndex];
			addTaskBlock(targetDay.dayIndex, task, blockCount > 1 ? blockIndex + 1 : undefined);
		}
	}

	for (const day of days) {
		day.items.sort((a, b) => a.time.localeCompare(b.time, 'zh-CN', { numeric: true }));
		day.busyLevel = getBusyLevel(day.items);
	}

	return days;
}

export default function CalendarExperience() {
	const [days, setDays] = useState<CalendarDay[]>([]);
	const [selectedId, setSelectedId] = useState<string>('');
	const [detailDirection, setDetailDirection] = useState(1);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const generatedDays = createCalendarDays(new Date());
		setDays(generatedDays);
		setSelectedId(generatedDays[0]?.id ?? '');
		window.requestAnimationFrame(() => setReady(true));
	}, []);

	const selectedDay = useMemo(() => days.find((day) => day.id === selectedId) ?? days[0], [days, selectedId]);
	const totalItems = days.reduce((sum, day) => sum + day.items.length, 0);
	const redDays = days.filter((day) => day.busyLevel === 'red').length;
	const startDate = days[0]?.date;
	const endDate = days[days.length - 1]?.date;

	const selectDay = (day: CalendarDay) => {
		setDetailDirection(day.dayIndex >= (selectedDay?.dayIndex ?? 0) ? 1 : -1);
		setSelectedId(day.id);
	};

	const moveDaySpotlight = (event: PointerEvent<HTMLButtonElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
		event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
	};

	if (!selectedDay || !startDate || !endDate) {
		return (
			<div className="calendar-loading">
				<div className="calendar-loading-orbit" />
				<p>正在生成从昨天开始的日历...</p>
			</div>
		);
	}

	return (
		<div className={`calendar-app${ready ? ' is-ready' : ''}`}>
			<div className="calendar-ambient" aria-hidden="true">
				<span className="ambient-dot dot-1" />
				<span className="ambient-dot dot-2" />
				<span className="ambient-dot dot-3" />
				<span className="ambient-line line-1" />
				<span className="ambient-line line-2" />
			</div>

			<header className="calendar-topbar">
				<a className="old-site-link" href="/old/" aria-label="打开旧版站点">
					旧版
					<ArrowUpRight size={15} />
				</a>
				<div className="calendar-brand">
					<span>Yfcccc Calendar</span>
					<strong>Fluid Schedule OS</strong>
				</div>
			</header>

			<main className="calendar-stage">
				<motion.section
					className="calendar-command glass-panel"
					initial={{ opacity: 0, y: 18, scale: 0.985 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
				>
					<div className="calendar-command-main">
						<p className="calendar-kicker">
							<CalendarDays size={16} />
							从昨天开始 · 6 × 5 · 45min blocks
						</p>
						<h1>日程中枢</h1>
					</div>
					<div className="command-metrics">
						<div>
							<span>日期范围</span>
							<strong>
								{formatCompactDate(startDate)} - {formatCompactDate(endDate)}
							</strong>
						</div>
						<div>
							<span>日程条目</span>
							<strong>{totalItems}</strong>
						</div>
						<div>
							<span>高强度日</span>
							<strong>{redDays}</strong>
						</div>
					</div>
				</motion.section>

				<section className="calendar-layout">
					<motion.div
						className="calendar-board glass-panel"
						initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
						animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
					>
						<div className="calendar-board-head">
							<div>
								<p className="calendar-kicker">Calendar Matrix</p>
								<h2>{formatMonth(startDate)}</h2>
							</div>
							<div className="calendar-window-controls" aria-hidden="true">
								<span className="control-red" />
								<span className="control-yellow" />
								<span className="control-green" />
							</div>
						</div>

						<div className="weekday-row">
							{WEEKDAY_LABELS.map((label) => (
								<span key={label}>{label}</span>
							))}
						</div>

						<div className="day-grid" role="grid" aria-label="从昨天开始的 30 天日历">
							{days.map((day) => {
								const isSelected = day.id === selectedDay.id;
								return (
									<motion.button
										type="button"
										key={day.id}
										layout
										className={`day-card busy-${day.busyLevel}${isSelected ? ' is-selected' : ''}`}
										onClick={() => selectDay(day)}
										onPointerMove={moveDaySpotlight}
										initial={{ opacity: 0, y: 18, scale: 0.96 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										whileHover={{ y: -5, scale: 1.012 }}
										whileTap={{ scale: 0.96 }}
										transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: day.dayIndex * 0.01 }}
										aria-label={`${formatFullDate(day.date)}，忙碌程度 ${BUSY_LABELS[day.busyLevel]}`}
									>
										<span className="day-status-dot" />
										<span className="day-index">D{String(day.dayIndex + 1).padStart(2, '0')}</span>
										<strong>{day.date.getDate()}</strong>
										<span className="day-month">{day.date.toLocaleDateString('en-US', { month: 'short' })}</span>
										<span className="day-load">{BUSY_LABELS[day.busyLevel]}</span>
										<span className="event-count">{day.items.length} items</span>
									</motion.button>
								);
							})}
						</div>
					</motion.div>

					<motion.aside
						className="detail-panel glass-panel"
						aria-live="polite"
						initial={{ opacity: 0, x: 22, filter: 'blur(12px)' }}
						animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
						transition={{ delay: 0.14, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={selectedDay.id}
								custom={detailDirection}
								initial={(direction: number) => ({ opacity: 0, x: direction * 26, filter: 'blur(8px)' })}
								animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
								exit={(direction: number) => ({ opacity: 0, x: direction * -20, filter: 'blur(6px)' })}
								transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
							>
								<div className="detail-head">
									<p className="calendar-kicker">
										<Sparkles size={15} />
										Day Detail
									</p>
									<h2>{formatFullDate(selectedDay.date)}</h2>
									<div className={`busy-pill busy-${selectedDay.busyLevel}`}>{BUSY_LABELS[selectedDay.busyLevel]}</div>
								</div>

								<p className="detail-summary">{BUSY_COPY[selectedDay.busyLevel]}</p>

								<div className="detail-switcher" aria-label="切换日期">
									<button
										type="button"
										onClick={() => {
											const previous = days[Math.max(selectedDay.dayIndex - 1, 0)];
											setDetailDirection(-1);
											setSelectedId(previous.id);
										}}
										disabled={selectedDay.dayIndex === 0}
									>
										<ChevronLeft size={18} />
									</button>
									<span>
										{selectedDay.dayIndex + 1} / {days.length}
									</span>
									<button
										type="button"
										onClick={() => {
											const next = days[Math.min(selectedDay.dayIndex + 1, days.length - 1)];
											setDetailDirection(1);
											setSelectedId(next.id);
										}}
										disabled={selectedDay.dayIndex === days.length - 1}
									>
										<ChevronRight size={18} />
									</button>
								</div>

								<div className="timeline-list">
									{selectedDay.items.length > 0 ? (
										selectedDay.items.map((item) => (
											<article className="timeline-item" key={`${selectedDay.id}-${item.time}-${item.title}`}>
												<div className="timeline-time">
													<Clock3 size={14} />
													{item.time}
												</div>
												<div>
													<div className="timeline-title">
														<h3>{item.title}</h3>
														<span>{item.type}</span>
													</div>
													<p>{item.detail}</p>
												</div>
											</article>
										))
									) : (
										<div className="empty-day">
											<strong>空白缓冲日</strong>
											<p>这一天暂时没有安排，可以作为恢复、阅读或临时任务缓冲。</p>
										</div>
									)}
								</div>
							</motion.div>
						</AnimatePresence>
					</motion.aside>
				</section>
			</main>
		</div>
	);
}
