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
  // 数学基础：先补分析、线代、概率，再进入优化。
  // ==========================================
  {
    id: 'math-calculus',
    title: '微积分基础',
    description: '从极限、导数、积分和多元微积分开始，建立后续概率、优化和机器学习所需的连续数学直觉。',
    status: 'in-progress',
    type: 'main',
    xp: 200,
    dependsOn: [],
    position: { x: 200, y: 100 },
  },
  {
    id: 'math-linear-algebra-3b1b',
    title: '线性代数 (3Blue1Brown)',
    description: '用 3Blue1Brown 的几何视角理解向量空间、线性变换、特征值和矩阵分解，为深度学习中的张量运算打底。',
    status: 'in-progress',
    type: 'main',
    xp: 220,
    dependsOn: [],
    position: { x: 200, y: 250 },
  },
  {
    id: 'math-probability-statistics',
    title: '概率论与数理统计',
    description: '补齐随机变量、分布、期望、方差、估计与假设检验，支撑机器学习中的泛化、采样和不确定性分析。',
    status: 'locked',
    type: 'main',
    xp: 300,
    dependsOn: ['math-calculus', 'math-linear-algebra-3b1b'],
    position: { x: 200, y: 400 },
  },
  {
    id: 'math-convex-optimization-ee364a',
    title: '凸优化 (Stanford EE364A)',
    description: '学习凸集、凸函数、对偶、KKT 条件和一阶方法，把深度学习训练与机器人优化问题放到统一框架下理解。',
    status: 'locked',
    type: 'main',
    xp: 420,
    dependsOn: ['math-calculus', 'math-linear-algebra-3b1b'],
    position: { x: 200, y: 550 },
  },

  // ==========================================
  // 编程基础：Python 做抽象，C/C++ 做工程和底层。
  // ==========================================
  {
    id: 'cs-python-cs61a',
    title: 'Python 程序抽象 (CS61A)',
    description: '以 CS61A 为主线，用 Python 训练函数式抽象、递归、解释器和程序构造能力，而不是只停留在语法层面。',
    status: 'in-progress',
    type: 'main',
    xp: 260,
    dependsOn: [],
    position: { x: 560, y: 100 },
  },
  {
    id: 'cs-c-foundation',
    title: 'C 语言基础',
    description: '补齐指针、内存模型、结构体、编译链接和基础调试能力，为 CSAPP 与 C++ 的对象生命周期理解做准备。',
    status: 'available',
    type: 'main',
    xp: 240,
    dependsOn: [],
    position: { x: 560, y: 250 },
  },
  {
    id: 'cs-cpp-cs106l',
    title: '现代 C++ (CS106L)',
    description: '学习 STL、RAII、移动语义、模板和现代 C++ 风格，把 C 的底层意识升级为可维护的工程抽象。',
    status: 'locked',
    type: 'main',
    xp: 320,
    dependsOn: ['cs-c-foundation'],
    position: { x: 560, y: 400 },
  },

  // ==========================================
  // 算法与系统基础：先数据结构，再理解计算机系统。
  // ==========================================
  {
    id: 'algo-data-structures-cs61b',
    title: '数据结构基础 (CS61B)',
    description: '系统学习链表、树、哈希表、堆、图和复杂度分析，把算法题从经验练习变成结构化能力。',
    status: 'locked',
    type: 'main',
    xp: 380,
    dependsOn: ['cs-python-cs61a', 'cs-cpp-cs106l'],
    position: { x: 920, y: 250 },
  },
  {
    id: 'systems-csapp',
    title: '计算机系统 (CSAPP)',
    description: '从数据表示、汇编、内存层次、链接、异常控制流和并发理解程序到底如何在机器上运行。',
    status: 'locked',
    type: 'main',
    xp: 520,
    dependsOn: ['cs-c-foundation'],
    position: { x: 920, y: 430 },
  },

  // ==========================================
  // 深度学习：在数学和编程基础之后再进入模型方向。
  // ==========================================
  {
    id: 'dl-cv-cs231n',
    title: '计算机视觉 (CS231n)',
    description: '从反向传播、CNN、ResNet 到视觉识别任务，建立图像理解和深度网络训练的第一条主线。',
    status: 'locked',
    type: 'side',
    xp: 520,
    dependsOn: ['math-linear-algebra-3b1b', 'math-probability-statistics', 'cs-python-cs61a'],
    position: { x: 1260, y: 200 },
  },
  {
    id: 'dl-nlp-cs224n',
    title: '深度学习与 NLP (CS224N)',
    description: '学习词向量、序列模型、Attention、Transformer 和现代 NLP，把深度学习从视觉扩展到语言建模。',
    status: 'locked',
    type: 'side',
    xp: 540,
    dependsOn: ['dl-cv-cs231n', 'math-probability-statistics', 'cs-python-cs61a'],
    position: { x: 1260, y: 380 },
  },
  {
    id: 'dl-reinforcement-learning',
    title: '强化学习',
    description: '在概率、优化和深度学习基础上学习 MDP、动态规划、策略梯度和价值函数，为机器人决策打基础。',
    status: 'locked',
    type: 'side',
    xp: 620,
    dependsOn: ['math-probability-statistics', 'math-convex-optimization-ee364a', 'dl-nlp-cs224n'],
    position: { x: 1260, y: 560 },
  },

  // ==========================================
  // 机器人学：最终把数学、系统、C++ 和学习算法汇合。
  // ==========================================
  {
    id: 'robotics-foundation',
    title: '机器人学',
    description: '汇合线性代数、优化、C++、计算机系统和强化学习，进入运动学、动力学、控制、SLAM 与具身智能。',
    status: 'locked',
    type: 'side',
    xp: 900,
    dependsOn: ['cs-cpp-cs106l', 'systems-csapp', 'math-convex-optimization-ee364a', 'dl-reinforcement-learning'],
    position: { x: 1600, y: 430 },
  }
];
