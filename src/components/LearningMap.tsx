import React, { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import type { Node, Edge, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { LearningNode } from '../data/learningMap';
import { learningMapData } from '../data/learningMap';
import { Check, Lock, Play, Circle, X, BookOpen, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CustomNodeType = Node<LearningNode & Record<string, unknown>, 'customTask'>;

const BaseNode = ({ data, selected }: NodeProps<CustomNodeType>) => {
  const isCompleted = data.status === 'completed';
  const isInProgress = data.status === 'in-progress';
  const isAvailable = data.status === 'available';

  const [isHovered, setIsHovered] = useState(false);

  // 颜色参考 Google 四色体系，并在明度上压低，保证浅色底下可读。
  const themeClasses = useMemo(() => {
    if (isCompleted) return 'border-emerald-300 bg-emerald-50 shadow-[0_10px_24px_rgba(5,150,105,0.18)] text-emerald-700 rounded-[22px]';
    if (isInProgress) return 'border-blue-300 bg-blue-50 shadow-[0_10px_26px_rgba(37,99,235,0.2)] text-blue-700 rounded-[22px]';
    if (isAvailable) return 'border-amber-300 bg-amber-50 hover:bg-amber-100 hover:border-amber-400 shadow-[0_8px_20px_rgba(217,119,6,0.16)] text-amber-700 rounded-[22px] transition-all duration-300';
    return 'border-slate-200 bg-slate-100 opacity-80 text-slate-400 rounded-[22px]';
  }, [isCompleted, isInProgress, isAvailable]);

  const iconClasses = useMemo(() => {
    if (isCompleted) return 'text-emerald-700';
    if (isInProgress) return 'text-blue-700';
    if (isAvailable) return 'text-amber-700';
    return 'text-slate-400';
  }, [isCompleted, isInProgress, isAvailable]);

  return (
    <div
      className="relative flex items-center justify-center p-2 cursor-pointer group transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isInProgress && (
        <div className="absolute inset-0 z-0 rounded-[24px] bg-blue-400/20 blur-md animate-pulse" />
      )}

      <div
        className={`relative flex items-center justify-center w-[76px] h-[76px] border-[3px] transition-all duration-300 ${themeClasses} ${selected ? 'ring-4 ring-blue-300 scale-105' : 'hover:scale-105'} z-10`}
      >
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-none !w-4 !h-4" style={{ top: -8 }} />

        <div className={`transition-all duration-300 ${iconClasses}`}>
          {isCompleted ? <Crown size={32} strokeWidth={2} /> :
           isInProgress ? <Play size={32} fill="currentColor" /> :
           isAvailable ? <Circle size={32} strokeWidth={3} /> :
           <Lock size={32} />}
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none !w-4 !h-4" style={{ bottom: -8 }} />
      </div>

      {/* 悬浮提示只展示摘要，详细依赖和说明交给点击弹窗。 */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
            className={`absolute z-50 left-[90px] top-0 min-w-[240px] p-4 rounded-lg border !pointer-events-none
              ${isCompleted ? 'border-emerald-200 bg-white' :
                isInProgress ? 'border-blue-300 bg-blue-50' :
                isAvailable ? 'border-amber-200 bg-white' :
                'border-slate-200 bg-white'}
              shadow-xl origin-top-left`}
          >
            <div className="flex flex-col gap-2">
              <h3 className={`text-base font-bold font-sans ${isCompleted ? 'text-emerald-700' : isInProgress ? 'text-blue-700' : isAvailable ? 'text-amber-700' : 'text-slate-700'}`}>
                {data.title}
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-3">
                {data.description}
              </p>
              {data.status === 'locked' && (
                <div className="mt-2 inline-block px-2 py-1 bg-rose-50 border border-rose-200 rounded text-[10px] text-rose-600 font-mono tracking-wider w-max">
                  未解锁 - 需要完成前置
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const nodeTypes = { customTask: BaseNode };

export default function LearningMap() {
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);

  const initialNodes: Node[] = useMemo(() => {
    return learningMapData.map((node) => ({
      id: node.id,
      type: 'customTask',
      position: node.position || { x: 0, y: 0 },
      data: { ...node },
    }));
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    learningMapData.forEach((node) => {
      node.dependsOn.forEach((depId) => {
        const isDepCompleted = learningMapData.find((item) => item.id === depId)?.status === 'completed';
        const targetColor = node.status === 'completed' ? '#059669' : node.status === 'in-progress' ? '#2563eb' : node.status === 'available' ? '#d97706' : '#94a3b8';
        const strokeColor = isDepCompleted ? targetColor : '#cbd5e1';

        edges.push({
          id: `e-${depId}-${node.id}`,
          source: depId,
          target: node.id,
          // 使用折线展示课程前置关系，节点坐标手写时可读性更高。
          type: 'step',
          animated: isDepCompleted && node.status !== 'completed',
          style: {
            stroke: strokeColor,
            strokeWidth: isDepCompleted ? 3 : 2,
            opacity: node.status === 'locked' ? 0.3 : 1,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: strokeColor,
          },
        });
      });
    });
    return edges;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[600px] sm:h-[800px] rounded-[24px] overflow-hidden relative bg-[#f8fafc] border border-slate-200 shadow-[0_14px_34px_rgba(15,23,42,0.1)] font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-300/22 blur-3xl" />
        <div className="absolute top-12 -right-16 h-64 w-64 rounded-full bg-emerald-300/18 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      {/* 地图说明固定在左上角，避免用户首次进入时不知道可以拖拽和点击。 */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none select-none rounded-2xl border border-white/80 bg-white/85 px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          基础进度地图
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-sm">
          从数学、编程、算法与系统基础开始，逐步解锁深度学习和机器人学。拖拽探索全景地图，悬停查看摘要，点击节点打开详细档案。
        </p>
      </div>

      <div className="absolute bottom-6 left-6 z-10 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />已完成</span>
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-blue-500" />进行中</span>
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-amber-500" />可开始</span>
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-slate-400" />锁定</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(e, node) => setSelectedNode(node.data as unknown as LearningNode)}
        onPaneClick={() => setSelectedNode(null)}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3, minZoom: 0.5, maxZoom: 1.5 }}
        minZoom={0.3}
        maxZoom={2.0}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={32} size={1.3} color="rgba(100,116,139,0.24)" />
        <Controls showInteractive={false} className="!bg-white/90 border !border-slate-200 shadow-lg [&>button]:!border-b-slate-200 [&>button]:!text-slate-500 [&>button:hover]:!bg-slate-100 fill-slate-500" />
      </ReactFlow>

      {/* 点击节点后展示完整说明，避免把课程描述塞进小节点导致阅读困难。 */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-[0_24px_50px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col"
            >
              <div
                className={`px-8 py-6 border-b-2 flex items-center justify-between
                  ${selectedNode.status === 'completed' ? 'bg-emerald-50 border-emerald-200' :
                    selectedNode.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                    selectedNode.status === 'available' ? 'bg-amber-50 border-amber-200' :
                    'bg-slate-50 border-slate-200'}
                `}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-bold font-mono rounded tracking-widest uppercase
                      ${selectedNode.status === 'completed' ? 'bg-emerald-600 text-white' :
                        selectedNode.status === 'in-progress' ? 'bg-blue-600 text-white' :
                        selectedNode.status === 'available' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-rose-100 text-rose-700 border border-rose-200'}
                    `}>
                      {selectedNode.status === 'in-progress' ? '进行中' :
                       selectedNode.status === 'completed' ? '已完成' :
                       selectedNode.status === 'locked' ? '锁定中' : '可开始'}
                    </span>
                    <span className="text-slate-500 text-sm font-mono tracking-widest uppercase flex items-center gap-1">
                      <BookOpen size={14} /> {selectedNode.type === 'main' ? '核心主线' : '扩展支线'}
                    </span>
                  </div>
                  <h2 className={`mt-3 text-3xl font-extrabold tracking-tight
                    ${selectedNode.status === 'completed' ? 'text-emerald-700' :
                      selectedNode.status === 'in-progress' ? 'text-blue-700' :
                      selectedNode.status === 'available' ? 'text-amber-700' :
                      'text-slate-900'}
                  `}>
                    {selectedNode.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 pb-10 flex-1">
                <div className="max-w-none">
                  <p className="text-lg leading-relaxed text-slate-700">
                    {selectedNode.description}
                  </p>

                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">#</span> 任务日志与说明
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">经验值 (XP)</div>
                        <div className="text-2xl font-mono text-slate-800 flex items-center gap-2">
                          {selectedNode.xp || 0} <span className="text-blue-600 text-sm">✓</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">前置要求</div>
                        <div className="text-lg text-slate-700">
                          {selectedNode.dependsOn.length > 0 ? `${selectedNode.dependsOn.length} 项前置任务` : '无前置要求'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end gap-4">
                  {(selectedNode.status === 'available' || selectedNode.status === 'in-progress') && (
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                      <Play size={18} fill="currentColor" /> {selectedNode.status === 'in-progress' ? '继续推进' : '开始任务'}
                    </button>
                  )}
                  {selectedNode.status === 'completed' && (
                    <button className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                      <Check size={18} strokeWidth={3} /> 温故知新
                    </button>
                  )}
                  {selectedNode.status === 'locked' && (
                    <button className="px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed flex items-center gap-2 border border-slate-200">
                      <Lock size={18} /> 前置未完成
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
