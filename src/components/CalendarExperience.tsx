// 文件说明：该文件实现根首页的交互式日历体验。
// 功能说明：从昨天开始生成 6x5 日期网格，支持按忙碌程度着色并查看单日详细日程。
//
// 结构概览：
//   第一部分：类型、静态示例数据与日期工具
//   第二部分：主组件状态与派生数据
//   第三部分：日历网格与详情面板渲染
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type BusyLevel = 'green' | 'yellow' | 'red';

interface ScheduleItem {
	time: string;
	title: string;
	type: string;
	weight: 1 | 2 | 3;
	detail: string;
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

const SAMPLE_SCHEDULES: Record<number, ScheduleItem[]> = {
	0: [
		{ time: '09:20', title: '晨间计划整理', type: 'Planning', weight: 1, detail: '快速确认今日任务、优先级与可延后事项。' },
		{ time: '14:00', title: '图像融合实验记录', type: 'Research', weight: 2, detail: '整理 UV 与 white 双源融合实验的参数与观察。' },
	],
	1: [
		{ time: '08:30', title: '算法论文阅读', type: 'Reading', weight: 2, detail: '阅读多源视觉融合相关论文，并摘出可复用模块。' },
		{ time: '10:30', title: '模型实验窗口', type: 'Build', weight: 3, detail: '跑一轮关键实验，记录输入、输出和失败样例。' },
		{ time: '19:30', title: '复盘与明日计划', type: 'Review', weight: 1, detail: '把有效结果整理进长期进度系统。' },
	],
	2: [
		{ time: '11:00', title: '课程与金融阅读', type: 'Study', weight: 1, detail: '补充金融学辅修与技术投资相关笔记。' },
	],
	4: [
		{ time: '09:00', title: '深度开发块', type: 'Focus', weight: 3, detail: '集中处理核心实现，不安排额外上下文切换。' },
		{ time: '13:30', title: '实验结果对比', type: 'Analysis', weight: 2, detail: '对比不同融合策略下的视觉表现和稳定性。' },
		{ time: '16:40', title: '项目材料整理', type: 'Portfolio', weight: 2, detail: '将可公开材料整理成后续项目展示结构。' },
		{ time: '21:00', title: '轻量恢复', type: 'Recovery', weight: 1, detail: '做低刺激复盘，避免继续压高负荷。' },
	],
	7: [
		{ time: '10:00', title: '周目标检查', type: 'Planning', weight: 2, detail: '确认本周主线是否仍围绕视觉算法推进。' },
		{ time: '15:00', title: '交流准备', type: 'Communication', weight: 2, detail: '准备一页式说明，便于和导师或同学沟通。' },
	],
	11: [
		{ time: '09:10', title: '高优先级实验', type: 'Research', weight: 3, detail: '完成最关键的一组实验验证，并保存过程日志。' },
		{ time: '11:30', title: '问题定位', type: 'Debug', weight: 3, detail: '定位图像输出异常、边缘伪影或参数漂移。' },
		{ time: '14:20', title: '材料更新', type: 'Writing', weight: 2, detail: '更新站点项目描述与阶段进展。' },
	],
};

function toDateId(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatMonth(date: Date) {
	return new Intl.DateTimeFormat('zh-CN', { month: 'long', year: 'numeric' }).format(date);
}

function formatFullDate(date: Date) {
	return new Intl.DateTimeFormat('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
}

function getBusyLevel(items: ScheduleItem[]): BusyLevel {
	const score = items.reduce((sum, item) => sum + item.weight, 0);
	if (score >= 7 || items.length >= 4) return 'red';
	if (score >= 3 || items.length >= 2) return 'yellow';
	return 'green';
}

function createCalendarDays(anchorDate: Date) {
	const start = new Date(anchorDate);
	start.setHours(0, 0, 0, 0);
	start.setDate(start.getDate() - 1);

	return Array.from({ length: 30 }, (_, dayIndex) => {
		const date = new Date(start);
		date.setDate(start.getDate() + dayIndex);
		const fallbackItems =
			SAMPLE_SCHEDULES[dayIndex] ??
			(dayIndex % 6 === 5
				? []
				: [
						{
							time: dayIndex % 3 === 0 ? '10:00' : '15:30',
							title: dayIndex % 3 === 0 ? '专注推进块' : '整理与复盘',
							type: dayIndex % 3 === 0 ? 'Focus' : 'Review',
							weight: dayIndex % 3 === 0 ? 2 : 1,
							detail: dayIndex % 3 === 0 ? '预留给当天最重要的一件事。' : '收束材料、记录结论并准备下一步。',
						},
					]);

		return {
			id: toDateId(date),
			date,
			dayIndex,
			busyLevel: getBusyLevel(fallbackItems),
			items: fallbackItems,
		};
	});
}

export default function CalendarExperience() {
	const [days, setDays] = useState<CalendarDay[]>([]);
	const [selectedId, setSelectedId] = useState<string>('');

	useEffect(() => {
		const generatedDays = createCalendarDays(new Date());
		setDays(generatedDays);
		setSelectedId(generatedDays[0]?.id ?? '');
	}, []);

	const selectedDay = useMemo(() => days.find((day) => day.id === selectedId) ?? days[0], [days, selectedId]);
	const totalItems = days.reduce((sum, day) => sum + day.items.length, 0);
	const redDays = days.filter((day) => day.busyLevel === 'red').length;
	const startDate = days[0]?.date;
	const endDate = days[days.length - 1]?.date;

	if (!selectedDay || !startDate || !endDate) {
		return (
			<div className="calendar-loading">
				<div className="calendar-loading-orbit" />
				<p>正在生成从昨天开始的日历...</p>
			</div>
		);
	}

	return (
		<div className="calendar-app">
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
				<section className="calendar-hero glass-panel">
					<div>
						<p className="calendar-kicker">
							<CalendarDays size={16} />
							从昨天开始 · 6 × 5
						</p>
						<h1>未来 30 天，被压进一块液态玻璃。</h1>
						<p className="calendar-hero-copy">
							点击任意一天查看详细日程。红、黄、绿只保留接口和视觉语义，后续可以交给 AI 根据事件数量与权重自动判定。
						</p>
					</div>
					<div className="hero-metrics">
						<div>
							<span>{formatMonth(startDate)}</span>
							<strong>
								{startDate.getDate()} - {endDate.getDate()}
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
				</section>

				<section className="calendar-layout">
					<div className="calendar-board glass-panel">
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
										onClick={() => setSelectedId(day.id)}
										whileHover={{ y: -7, scale: 1.015 }}
										whileTap={{ scale: 0.98 }}
										transition={{ type: 'spring', stiffness: 430, damping: 34, mass: 0.8 }}
										aria-label={`${formatFullDate(day.date)}，忙碌程度 ${BUSY_LABELS[day.busyLevel]}`}
									>
										<span className="day-card-glow" />
										<span className="day-index">D{String(day.dayIndex + 1).padStart(2, '0')}</span>
										<strong>{day.date.getDate()}</strong>
										<span className="day-month">{day.date.toLocaleDateString('en-US', { month: 'short' })}</span>
										<span className="day-load">{BUSY_LABELS[day.busyLevel]}</span>
										<span className="event-count">{day.items.length} items</span>
									</motion.button>
								);
							})}
						</div>
					</div>

					<aside className="detail-panel glass-panel" aria-live="polite">
						<AnimatePresence mode="wait">
							<motion.div
								key={selectedDay.id}
								initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
								animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
								exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
								transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
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
					</aside>
				</section>
			</main>
		</div>
	);
}
