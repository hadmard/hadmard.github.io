// 文件说明：该文件维护站点的双语结构化内容数据。
// 功能说明：集中提供首页各模块的文案、列表项与空态信息，方便后续持续替换为真实内容。
//
// 结构概览：
//   第一部分：声明类型
//   第二部分：输出中英文内容字典

export type Locale = 'zh-cn' | 'en';

export interface SiteSectionLink {
	id: string;
	label: string;
}

interface ContactItem {
	label: string;
	value: string;
	href?: string;
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
		eyebrow: string;
		title: string;
		description: string;
		primaryCta: string;
		secondaryCta: string;
		modes: string[];
		contacts: ContactItem[];
		metrics: Array<{
			label: string;
			value: string;
			note: string;
		}>;
		terminal: Array<{
			label: string;
			value: string;
			note: string;
		}>;
	};
	progress: {
		kicker: string;
		title: string;
		intro: string;
	};
	resume: {
		kicker: string;
		title: string;
		intro: string;
		capsules: string[];
		timeline: Array<{
			period: string;
			title: string;
			description: string;
		}>;
		projectsTitle: string;
		projectsIntro: string;
		projectsEmptyTitle: string;
		projectsEmptyDescription: string;
	};
	investments: {
		kicker: string;
		title: string;
		intro: string;
		principles: string[];
		records: Array<{
			asset: string;
			focus: string;
			thesis: string;
			rhythm: string;
		}>;
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
			caption: '个人博客 · 长期研究与项目迭代',
		},
		seo: {
			title: 'Yfcccc | 个人研究主页',
			description: 'Yfcccc 的个人主页：展示技术栈、投资分析、思考感悟与简历。',
		},
		nav: [
			{ id: 'progress', label: '个人技术栈' },
			{ id: 'investments', label: '投资记录分析' },
			{ id: 'thinking', label: '个人思考感悟' },
			{ id: 'resume', label: '个人简历（含项目）' },
		],
		hero: {
			badge: 'YFCCCC / ASTRO / GITHUB PAGES',
			eyebrow: '一个面向长期主义的个人研究与项目迭代界面',
			title: 'Yfcccc 的研究、交易与工程界面。',
			description:
				'把技术栈、投资复盘、个人思考和简历项目放在同一套清爽的 Apple 风界面里。不是装饰首页，而是可以继续长出来的个人操作台。',
			primaryCta: '进入个人技术栈',
			secondaryCta: '进入投资记录分析',
			modes: ['Vision Algorithms', 'Image Fusion', 'AI+X', 'Tech Venture', 'Finance Minor'],
			contacts: [
				{ label: 'Personal', value: 'arcsin4130@gmail.com', href: 'mailto:arcsin4130@gmail.com' },
				{ label: 'Academic', value: 'yfcccc@zju.edu.cn', href: 'mailto:yfcccc@zju.edu.cn' },
			],
			metrics: [
				{ label: '当前方向', value: '图像融合算法', note: 'UV 与 white 双源视觉信息融合' },
				{ label: '学术背景', value: '浙江大学', note: '农业工程专业' },
				{ label: '交叉训练', value: '创业投资 + 金融', note: '微专业科技创业投资 & AI+X，辅修金融学' },
			],
			terminal: [
				{ label: 'Current Work', value: 'UV & white 双源图像融合算法开发', note: '以视觉感知与算法落地为当前主线' },
				{ label: 'Education', value: 'Zhejiang University', note: '农业工程主专业，延伸到金融与科技创业投资' },
				{ label: 'Site Status', value: '四模块已收束', note: '技术路线、投资日志、思考与简历各自进入独立页面' },
			],
		},
		progress: {
			kicker: 'Tech Stack',
			title: '个人技术栈',
			intro: '结构按知识深度横向展开，同一列是并列能力，列与列之间是清晰的递进关系。',
		},
		resume: {
			kicker: '个人简历（含项目）',
			title: '一条以视觉算法为主轴，同时向金融与创业视角展开的成长路径。',
			intro:
				'当前信息还在逐步补全，所以这一版简历更强调“真实起点”而不是堆砌结果。先把研究方向、专业结构和交叉训练明确下来，后续再继续补项目、论文、比赛与成果。',
			capsules: ['视觉算法', '图像融合', '农业工程', '科技创业投资 & AI+X', '金融学'],
			timeline: [
				{
					period: 'Now',
					title: '视觉算法研究与图像融合开发',
					description: '当前主要投入 UV & white 双源图像融合算法开发，把研究关注点放在多源信息融合、视觉表达与实际场景可用性上。',
				},
				{
					period: 'ZJU',
					title: '浙江大学农业工程专业',
					description: '以农业工程作为主专业训练底座，建立工程问题理解、系统思维与实际应用场景意识。',
				},
				{
					period: 'Cross-disciplinary',
					title: '科技创业投资 & AI+X 微专业，辅修金融学',
					description: '在算法之外持续补足商业、资本与技术扩散的视角，让研究不只停留在模型层，而能理解技术进入现实世界的路径。',
				},
			],
			projectsTitle: '项目经历',
			projectsIntro: '将项目经历并入简历模块，作为研究、工程与复盘能力的直接佐证。',
			projectsEmptyTitle: '项目经历建设中',
			projectsEmptyDescription: '后续有了完整项目、论文、比赛、实验平台或 Demo，我会把这里升级成高密度 case file 展示区。',
		},
		investments: {
			kicker: '投资记录分析',
			title: '投资记录分析',
			intro: '把公开与本地同步的投资记录整理成结构化的分析视图，沉淀科技创业投资与金融学训练中的判断框架。',
			principles: [],
			records: [],
			emptyTitle: '投资记录暂未公开',
			emptyDescription: '后续可以选择只写方法论、研究方向，或写可公开的标的观察，不一定要暴露完整仓位。',
		},
		thinking: {
			kicker: '个人思考感悟',
			title: '个人思考感悟',
			intro: '这一页用于沉淀长期研究中的推理、判断与阶段性复盘，当前先保留最小占位结构。',
			readMore: '阅读全文',
			emptyTitle: '文章内容即将补充',
			emptyDescription: '这里将陆续更新思考笔记与长文，作为个人的认知存档与交流空间。',
			commentTitle: '评论区',
			commentNote: '评论功能已经接好，但会主要出现在后续的文章详情页里。',
		},
		post: {
			backLabel: '返回首页',
			otherLocaleLabel: '切换到英文版',
			relatedTitle: '继续阅读',
		},
		footer: {
			title: '这一版更像“真实起点”而不是“完整终稿”。',
			description: '站点已经从模板变成了你的个人坐标系。接下来只需要持续补充真实项目、研究输出、文章与公开记录，它就会自然长成。',
			note: '下一步优先建议：补项目经历、确定是否保留 GitHub Issues 评论、开始写第一批文章。',
		},
	},
	en: {
		brand: {
			name: 'Yfcccc',
			caption: 'Personal Blog · Long-Horizon Research and Iteration',
		},
		seo: {
			title: 'Yfcccc | Personal Research Homepage',
			description: 'A personal homepage for tech stack, investment analysis, reflections, and resume.',
		},
		nav: [
			{ id: 'progress', label: 'Tech Stack' },
			{ id: 'investments', label: 'Investment Analysis' },
			{ id: 'thinking', label: 'Reflections' },
			{ id: 'resume', label: 'Resume & Projects' },
		],
		hero: {
			badge: 'YFCCCC / ASTRO / GITHUB PAGES',
			eyebrow: 'A long-horizon interface for research, projects, and iteration',
			title: 'Yfcccc\'s research, trading, and engineering interface.',
			description:
				'Tech stack, investment reviews, reflections, and resume projects now live inside one polished Apple-inspired workspace.',
			primaryCta: 'Open Tech Stack',
			secondaryCta: 'Open Investment Analysis',
			modes: ['Vision Algorithms', 'Image Fusion', 'AI+X', 'Tech Venture', 'Finance Minor'],
			contacts: [
				{ label: 'Personal', value: 'arcsin4130@gmail.com', href: 'mailto:arcsin4130@gmail.com' },
				{ label: 'Academic', value: 'yfcccc@zju.edu.cn', href: 'mailto:yfcccc@zju.edu.cn' },
			],
			metrics: [
				{ label: 'Current Focus', value: 'Image Fusion Algorithms', note: 'UV and white dual-source visual fusion' },
				{ label: 'Academic Base', value: 'Zhejiang University', note: 'Major in Agricultural Engineering' },
				{ label: 'Interdisciplinary Layer', value: 'Venture + Finance', note: 'Micro-major in Tech Venture Investing & AI+X, minor in Finance' },
			],
			terminal: [
				{ label: 'Current Work', value: 'UV and white dual-source image fusion', note: 'Visual perception and algorithmic usability are the current center of gravity' },
				{ label: 'Education', value: 'Zhejiang University', note: 'Engineering training extended with finance and venture perspectives' },
				{ label: 'Site Status', value: 'Four modules aligned', note: 'Technical route, investment log, reflections, and resume now have focused pages' },
			],
		},
		progress: {
			kicker: 'Tech Stack',
			title: 'Tech Stack',
			intro: 'Structured horizontally by depth, parallel skills in the same column, and clear progression between columns.',
		},
		resume: {
			kicker: 'Resume & Projects',
			title: 'A path centered on visual algorithms, expanding into finance and venture perspectives.',
			intro:
				'The profile is still being filled in, so this version emphasizes an honest starting point instead of inflated outcomes. The current goal is to make the direction, academic structure, and interdisciplinary training visible first.',
			capsules: ['Visual Algorithms', 'Image Fusion', 'Agricultural Engineering', 'Tech Venture Investing & AI+X', 'Finance'],
			timeline: [
				{
					period: 'Now',
					title: 'Visual algorithm research and image fusion development',
					description: 'Currently focused on UV and white dual-source image fusion algorithm development, with attention on multi-source fusion, visual representation, and practical usability.',
				},
				{
					period: 'ZJU',
					title: 'Agricultural Engineering at Zhejiang University',
					description: 'Building an engineering-oriented base for problem framing, systems thinking, and application awareness.',
				},
				{
					period: 'Cross-disciplinary',
					title: 'Tech Venture Investing & AI+X, with a minor in Finance',
					description: 'Extending beyond algorithms to understand how technology interacts with business, capital, and real-world adoption.',
				},
			],
			projectsTitle: 'Projects',
			projectsIntro: 'Projects are folded into the resume as direct evidence of research, engineering, and reflection ability.',
			projectsEmptyTitle: 'Project section in progress',
			projectsEmptyDescription: 'Once you have completed projects, papers, competitions, demos, or experimental platforms, this area can evolve into a dense case-file presentation layer.',
		},
		investments: {
			kicker: 'Investment Analysis',
			title: 'Investment Analysis',
			intro: 'Public and locally synced investment records are organized into a structured analysis view, preserving judgment patterns from venture and finance training.',
			principles: [],
			records: [],
			emptyTitle: 'Investment records not public yet',
			emptyDescription: 'Later, this can hold principles, research directions, or selected public-safe observations instead of full position disclosure.',
		},
		thinking: {
			kicker: 'Reflections',
			title: 'Reflections',
			intro: 'This page captures reasoning, judgments, and periodic reviews from long-term research.',
			readMore: 'Read full essay',
			emptyTitle: 'Essays coming soon',
			emptyDescription: 'This space will gradually update with thinking notes and essays as a personal cognitive archive and exchange medium.',
			commentTitle: 'Comments',
			commentNote: 'The comment system is already wired in, but it will matter most once the article layer is populated.',
		},
		post: {
			backLabel: 'Back to home',
			otherLocaleLabel: 'Switch to Chinese',
			relatedTitle: 'More to explore',
		},
		footer: {
			title: 'This version is an honest starting point, not a finished monument.',
			description: 'The site already feels like your coordinate system. The next step is simply to keep adding real projects, research output, essays, and public notes.',
			note: 'Best next moves: add project material, decide whether to keep GitHub Issues comments, and begin the first essays.',
		},
	},
};
