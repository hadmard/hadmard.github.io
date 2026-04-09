export type NodeStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface LearningNode {
  id: string;             // 唯一 ID
  title: string;          // 节点标题
  description: string;    // 节点描述
  status: NodeStatus;     // 当前状态
  xp: number;             // 经验值 / 奖励
  type?: 'main' | 'side'; // 主线还是支线
  dependsOn: string[];    // 依赖的前置节点 ID 列表
  position?: { x: number; y: number }; // 绘制坐标
}

export const learningMapData: LearningNode[] = [
  // ==========================================
  // 【金融的我】分支 (左侧)
  // ==========================================
  {
    id: 'fin-economics',
    title: '宏观与微观经济学',
    description: '理解市场运行的基本规律与资产定价的底层逻辑，构建金融世界观。',
    status: 'completed',
    type: 'side',
    xp: 150,
    dependsOn: [],
    position: { x: 200, y: 100 },
  },
  {
    id: 'fin-investment-101',
    title: '个人投资实盘探索',
    description: '知行合一：量化基本面、建立券商实盘交易框架，追踪个股及大盘（涵盖 CC98 爬取的投资探讨与实盘记录）。',
    status: 'in-progress',
    type: 'side',
    xp: 300,
    dependsOn: ['fin-economics'],
    position: { x: 200, y: 250 },
  },
  {
    id: 'fin-roi-milestone',
    title: '首个超额年化收益 (Alpha)',
    description: '穿越牛熊，运用建立的投资系统达成 15%+ 的年度超额回报里程碑。',
    status: 'locked',
    type: 'side',
    xp: 1000,
    dependsOn: ['fin-investment-101'],
    position: { x: 200, y: 400 },
  },

  // ==========================================
  // 【科研的我】分支 - 数学基础
  // ==========================================
  {
    id: 'math-calculus',
    title: '微积分与实分析',
    description: '连续性、极限与积分，数学大厦的地基。',
    status: 'completed',
    type: 'main',
    xp: 100,
    dependsOn: [],
    position: { x: 500, y: 100 },
  },
  {
    id: 'math-linalg',
    title: '高等线性代数',
    description: '矩阵空间、特征值、奇异值分解 (SVD)，机器学习最重要的血脉。',
    status: 'completed',
    type: 'main',
    xp: 200,
    dependsOn: ['math-calculus'],
    position: { x: 500, y: 250 },
  },
  {
    id: 'math-optimization',
    title: '凸优化理论',
    description: '拉格朗日乘子、梯度下降等优化算法，掌控神经网络的收敛命运。',
    status: 'available',
    type: 'main',
    xp: 350,
    dependsOn: ['math-linalg'],
    position: { x: 500, y: 400 },
  },

  // ==========================================
  // 【科研的我】分支 - 计算机基础(CS)
  // ==========================================
  {
    id: 'cs-python',
    title: '架构与解释 (Python CS61A)',
    description: 'UC Berkeley CS61A：以 Python 为主，理解计算机程序的构造与解释，函数化抽象。',
    status: 'completed',
    type: 'main',
    xp: 150,
    dependsOn: [],
    position: { x: 750, y: 100 },
  },
  {
    id: 'cs-c',
    title: '底层记忆与逻辑 (C语言 CS50)',
    description: 'Harvard CS50：从底层指针与内存分配，理解 C 语言的精妙与系统调用。',
    status: 'completed',
    type: 'main',
    xp: 200,
    dependsOn: ['cs-python'],
    position: { x: 750, y: 220 },
  },
  {
    id: 'cs-cpp',
    title: '系统级抽象 (现代 C++)',
    description: '深入 RAII，泛型编程与 STL。打造兼具性能与架构的工程利器。',
    status: 'in-progress',
    type: 'main',
    xp: 250,
    dependsOn: ['cs-c'],
    position: { x: 750, y: 340 },
  },
  {
    id: 'cs-ds',
    title: '数据结构与算法体系',
    description: '算法复杂度分析、二叉树、图论、堆映射，算法艺术的根基。',
    status: 'in-progress',
    type: 'main',
    xp: 300,
    dependsOn: ['cs-cpp'],
    position: { x: 750, y: 460 },
  },
  {
    id: 'cs-os',
    title: '操作系统 (南大 JYY)',
    description: '并发、虚拟化与持久化：从代码史诗解读内核世界的宇宙观。',
    status: 'available',
    type: 'main',
    xp: 500,
    dependsOn: ['cs-ds', 'cs-c'],
    position: { x: 750, y: 580 },
  },

  // ==========================================
  // 【科研的我】分支 - 深度学习与视觉
  // ==========================================
  {
    id: 'dl-basics',
    title: '深度网络理论基础',
    description: '感知机、反向传播与早期全连接神经网络架构。',
    status: 'completed',
    type: 'main',
    xp: 200,
    dependsOn: ['math-linalg', 'cs-python'],
    position: { x: 1000, y: 340 },
  },
  {
    id: 'dl-cv',
    title: '计算机视觉 (CV)',
    description: '深入卷积神经网络 (CNN)、ResNet，理解机器感知图像的范式变迁。',
    status: 'in-progress',
    type: 'main',
    xp: 350,
    dependsOn: ['dl-basics'],
    position: { x: 1000, y: 460 },
  },
  {
    id: 'dl-transformer',
    title: 'Transformer 大模型范式',
    description: '解构注意力机制 (Attention)，拥抱通用多模态 AI (AGI) 。',
    status: 'available',
    type: 'main',
    xp: 400,
    dependsOn: ['dl-basics'],
    position: { x: 1000, y: 580 },
  },

  // ==========================================
  // 【科研的我】分支 - 机器人学与控制理论
  // ==========================================
  {
    id: 'rob-trad',
    title: '经典自动控制理论',
    description: '反馈机制、PID 控制与信频域分析，让硬件系统稳定服从意志。',
    status: 'completed',
    type: 'main',
    xp: 200,
    dependsOn: ['math-calculus'],
    position: { x: 1250, y: 250 },
  },
  {
    id: 'rob-modern',
    title: '现代控制论',
    description: '状态空间、能控/能观性、LQR 最优控制，多维动态系统的数学魔法。',
    status: 'available',
    type: 'main',
    xp: 300,
    dependsOn: ['rob-trad', 'math-linalg'],
    position: { x: 1250, y: 400 },
  },

  // ==========================================
  // 综合落地 - 项目经验
  // ==========================================
  {
    id: 'proj-uv-white',
    title: 'Proj: 紫外与白光视界融合 (2024~2025)',
    description: '双源图像特征提取与高保真重建。融合 CV 算法与 C++ 工程落地。',
    status: 'in-progress',
    type: 'main',
    xp: 800,
    dependsOn: ['dl-cv', 'math-optimization', 'cs-cpp'],
    position: { x: 875, y: 750 },
  },
  {
    id: 'proj-robotics-ai',
    title: 'Proj: 具身决策智能体 (2026~)',
    description: '结合现代控制、微系统与大模型推理(Transformer)，突破端到端软硬件融合。',
    status: 'locked',
    type: 'main',
    xp: 1500,
    dependsOn: ['rob-modern', 'dl-transformer', 'cs-os'],
    position: { x: 1125, y: 750 },
  }
];

