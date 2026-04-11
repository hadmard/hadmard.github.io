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
	};
	projects: {
		kicker: string;
		title: string;
		intro: string;
		emptyTitle: string;
		emptyDescription: string;
		items: Array<{
			name: string;
			role: string;
			summary: string;
			stack: string[];
			impact: string;
		}>;
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
			description: 'Yfcccc 的个人主页：展示学习进度、项目目标、个人思考与长期迭代。',
		},
		nav: [
			{ id: 'progress', label: '进度' },
			{ id: 'projects', label: '项目' },
			{ id: 'thinking', label: '思考' },
			{ id: 'resume', label: '简历' },
		],
		hero: {
			badge: 'YFCCCC / ASTRO / GITHUB PAGES',
			eyebrow: '一个面向长期主义的个人研究与项目迭代界面',
			title: '欢迎来到 Yfcccc 的个人博客。',
			description:
				'这里是展示层首页：用于说明网站定位与方向。具体内容请通过右上角栏目进入对应子页面查看。',
			primaryCta: '进入进度页',
			secondaryCta: '进入项目页',
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
				{ label: 'Site Status', value: '真实信息正在持续补全', note: '项目、投资与文章模块会按阶段继续填充' },
			],
		},
		resume: {
			kicker: '个人简历',
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
		},
		projects: {
			kicker: '项目经历',
			title: '项目模块先保持诚实，等代表作成熟后再集中展示。',
			intro: '你目前提到的核心在于 UV & white 双源图像融合算法开发，但还没有想公开成完整 case 的项目。我先把这里设计成具有审美的空态，而不是用虚构案例填满。',
			emptyTitle: '项目经历建设中',
			emptyDescription: '后续你有了完整项目、论文、比赛、实验平台或 Demo，我会把这里升级成高密度 case file 展示区。',
			items: [],
		},
		investments: {
			kicker: '投资记录',
			title: '投资模块先留白，等你愿意公开时再建立自己的方法论界面。',
			intro: '你已经有科技创业投资与金融学的训练背景，但当前不打算公开投资记录。我先保留这个模块的位置感，避免站点结构以后重做。',
			principles: [],
			records: [],
			emptyTitle: '投资记录暂未公开',
			emptyDescription: '后续可以选择只写方法论、研究方向，或写可公开的标的观察，不一定要暴露完整仓位。',
		},
		thinking: {
			kicker: '个人思考',
			title: '思考模块保留为空白页边，等待真正值得发表的第一批文章。',
			intro: '你暂时还没有提供文章主题或已有标题，所以我先把这个区域处理成“即将上线”的编辑部状态，而不是继续放示例文章冒充你的表达。',
			readMore: '阅读全文',
			emptyTitle: '文章内容即将补充',
			emptyDescription: '等你给出主题方向后，我可以继续帮你把首批文章标题、摘要甚至正文都搭出来，并保持中英文同步结构。',
			commentTitle: '评论区',
			commentNote: '评论功能已经接好，但会主要出现在后续的文章详情页里。当前如果没有文章，评论模块就暂时不会成为主角。',
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
			description: 'A personal homepage for learning progress, project targets, thinking notes, and long-term iteration.',
		},
		nav: [
			{ id: 'progress', label: 'Progress' },
			{ id: 'projects', label: 'Projects' },
			{ id: 'thinking', label: 'Thinking' },
			{ id: 'resume', label: 'Resume' },
		],
		hero: {
			badge: 'YFCCCC / ASTRO / GITHUB PAGES',
			eyebrow: 'A long-horizon interface for research, projects, and iteration',
			title: 'Welcome to Yfcccc\'s personal blog.',
			description:
				'This homepage is a showcase layer that explains what the site is for. Use the top-right navigation to open focused subpages for details.',
			primaryCta: 'Open Progress',
			secondaryCta: 'Open Projects',
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
				{ label: 'Site Status', value: 'Real material is being added', note: 'Projects, investments, and essays will be published in stages' },
			],
		},
		resume: {
			kicker: 'Resume',
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
		},
		projects: {
			kicker: 'Projects',
			title: 'The project layer stays honest for now, waiting for stronger public case studies.',
			intro: 'You mentioned UV and white dual-source image fusion algorithm development as the main active thread, but there are no finished projects you want to present yet. I am preserving the space without filling it with fake case studies.',
			emptyTitle: 'Project section in progress',
			emptyDescription: 'Once you have completed projects, papers, competitions, demos, or experimental platforms, this area can evolve into a dense case-file presentation layer.',
			items: [],
		},
		investments: {
			kicker: 'Investments',
			title: 'The investment layer is intentionally left blank until you want it public.',
			intro: 'You already have exposure to tech venture investing and finance, but you do not want to publish investment records yet. Keeping the section in place now makes future expansion much easier.',
			principles: [],
			records: [],
			emptyTitle: 'Investment records not public yet',
			emptyDescription: 'Later, this can hold principles, research directions, or selected public-safe observations instead of full position disclosure.',
		},
		thinking: {
			kicker: 'Thinking',
			title: 'The writing layer stays open, waiting for the first essays that truly sound like you.',
			intro: 'Since you have not shared topics or titles yet, I turned this area into an editorial placeholder instead of keeping sample essays that would misrepresent your voice.',
			readMore: 'Read full essay',
			emptyTitle: 'Essays coming soon',
			emptyDescription: 'Once you give me themes, I can help you shape the first batch of titles, summaries, and even full drafts in both Chinese and English.',
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
