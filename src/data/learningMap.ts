// 文件说明：该文件维护学习进程图谱（成就树/科技树）的节点数据。
// 功能说明：定义课程的拓扑依赖、节点状态（锁定、可用、进行中、已完成）以及 UI 展示所需的各项属性。

export type NodeStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface LearningNode {
	id: string;             // 唯一 ID
	title: string;          // 节点标题
	description: string;    // 节点描述
	status: NodeStatus;     // 当前状态
	xp: number;             // 经验值 / 奖励
	type?: 'main' | 'side'; // 主线还是支线，默认 main
	dependsOn: string[];    // 依赖的前置节点 ID 列表
	position?: { x: number; y: number }; // 用于图谱引擎的绝对定位（可选，供 fallback 使用）
}

export const learningMapData: LearningNode[] = [
	{
		id: 'foundation-math',
		title: '数学基础：线性代数与矩阵',
		description: '从特征值到奇异值分解，视觉算法运算的核心底座。',
		status: 'completed',
		type: 'main',
		xp: 150,
		dependsOn: [],
		position: { x: 400, y: 50 },
	},
	{
		id: 'foundation-cv',
		title: '计算机视觉导论',
		description: '图像处理基本概念、颜色空间、滤波与边缘检测。',
		status: 'completed',
		type: 'main',
		xp: 120,
		dependsOn: ['foundation-math'],
		position: { x: 400, y: 200 },
	},
	{
		id: 'fusion-theory',
		title: '图像融合理论',
		description: '源图像特征提取、融合规则定义与重建策略。',
		status: 'completed',
		type: 'main',
		xp: 200,
		dependsOn: ['foundation-cv'],
		position: { x: 400, y: 350 },
	},
	{
		id: 'uv-white-fusion',
		title: 'UV & White 双源图像融合',
		description: '核心研究方向。探索紫外光与白光的互补特性提取及有效融合模型。',
		status: 'in-progress',
		type: 'main',
		xp: 500,
		dependsOn: ['fusion-theory'],
		position: { x: 400, y: 530 },
	},
	{
		id: 'finance-101',
		title: '微观经济与金融基础',
		description: '理解资产定价、市场运行机制与资金流动。',
		status: 'completed',
		type: 'side',
		xp: 100,
		dependsOn: [],
		position: { x: 700, y: 200 },
	},
	{
		id: 'tech-venture',
		title: '科技创业投资与 AI+X',
		description: '分析技术从实验室步入商业化过程中的核心壁垒与杠杆效应。',
		status: 'available',
		type: 'side',
		xp: 180,
		dependsOn: ['finance-101'],
		position: { x: 700, y: 350 },
	},
	{
		id: 'algo-deployment',
		title: '视觉算法工程化落地',
		description: '模型轻量化、边缘端部署，以及将研究成果转化为可调用的产品服务。',
		status: 'locked',
		type: 'main',
		xp: 300,
		dependsOn: ['uv-white-fusion', 'tech-venture'],
		position: { x: 550, y: 700 },
	}
];
