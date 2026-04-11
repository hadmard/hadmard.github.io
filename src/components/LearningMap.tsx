import React, { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
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
import { Check, Lock, Play, Circle, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CustomNodeType = Node<LearningNode & Record<string, unknown>, 'customTask'>;

const BaseNode = ({ data, selected }: NodeProps<CustomNodeType>) => {
  const isCompleted = data.status === 'completed';
  const isInProgress = data.status === 'in-progress';
  const isAvailable = data.status === 'available';

  const [isHovered, setIsHovered] = useState(false);

  // 以像素风任务树为核心，采用方块色块与硬边阴影。
  const themeClasses = useMemo(() => {
    if (isCompleted) return 'border-[#1f5f35] bg-[#6bbf59] shadow-[4px_4px_0_#123920] text-[#102a1a] rounded-none';
    if (isInProgress) return 'border-[#8a5a1f] bg-[#e0b45c] shadow-[4px_4px_0_#5d3c14] text-[#40270e] rounded-none';
    if (isAvailable) return 'border-[#43515e] bg-[#9db0c3] hover:bg-[#b2c1cf] shadow-[4px_4px_0_#2f3944] text-[#17222d] rounded-none transition-all duration-200';
    return 'border-[#424242] bg-[#7a7a7a] text-[#1f1f1f] rounded-none opacity-85';
  }, [isCompleted, isInProgress, isAvailable]);

  const iconClasses = useMemo(() => {
    if (isCompleted) return 'text-[#123521]';
    if (isInProgress) return 'text-[#4a2f11]';
    if (isAvailable) return 'text-[#1f2a35]';
    return 'text-[#262626]';
  }, [isCompleted, isInProgress, isAvailable]);

  return (
    <div
      className="relative flex items-center justify-center p-2 cursor-pointer group transition-transform duration-200 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative flex items-center justify-center w-[78px] h-[78px] border-[3px] transition-all duration-200 ${themeClasses} ${selected ? 'outline outline-4 outline-[#fff59d] scale-105' : 'hover:scale-105'} z-10`}
      >
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-none !w-4 !h-4" style={{ top: -8 }} />

        <div className={`transition-all duration-300 ${iconClasses}`}>
          {isCompleted ? <Check size={34} strokeWidth={3} /> :
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
            className={`absolute z-50 left-[94px] top-0 min-w-[250px] border-[3px] !pointer-events-none bg-[#f3ead4] shadow-[6px_6px_0_#2a2418] origin-top-left p-3
              ${isCompleted ? 'border-[#2f6f45]' : isInProgress ? 'border-[#8a5a1f]' : isAvailable ? 'border-[#43515e]' : 'border-[#4a4a4a]'}`}
          >
            <div className="flex flex-col gap-2">
              <h3 className={`text-sm font-bold tracking-wide ${isCompleted ? 'text-[#1b4d2d]' : isInProgress ? 'text-[#5b3a14]' : isAvailable ? 'text-[#1f2a35]' : 'text-[#2a2a2a]'}`}>
                {data.title}
              </h3>
              <p className="text-xs text-[#4b3f2f] leading-relaxed line-clamp-3">
                {data.description}
              </p>
              {data.status === 'locked' && (
                <div className="mt-2 inline-block px-2 py-1 bg-[#c0392b] border border-[#7f261d] text-[10px] text-white tracking-wider w-max">
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
        const targetColor = node.status === 'completed' ? '#2f6f45' : node.status === 'in-progress' ? '#8a5a1f' : node.status === 'available' ? '#43515e' : '#5b5b5b';
        const strokeColor = isDepCompleted ? targetColor : '#656565';

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
    <div className="w-full h-[600px] sm:h-[800px] rounded-[24px] overflow-hidden relative border-[3px] border-[#2f2a22] shadow-[0_14px_34px_rgba(0,0,0,0.35)] font-mono bg-[#1b1712]">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(0deg, rgba(0,0,0,0.18), rgba(0,0,0,0.18)),
          repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 16px),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 16px)
        `,
      }} />

      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none border-[3px] border-[#4b3f2d] bg-[#f3ead4] px-4 py-3 shadow-[6px_6px_0_#2a2418]">
        <h2 className="text-xl font-bold tracking-wide text-[#2c2418]">
          MINECRAFT STYLE 进度树
        </h2>
        <p className="text-[#4b3f2f] text-xs mt-2 max-w-sm leading-6">
          固定布局，分区主线推进，底部项目行汇总。悬停看摘要，点击节点看详情。
        </p>
      </div>

      <div className="absolute bottom-6 right-6 z-10 border-[3px] border-[#4b3f2d] bg-[#f3ead4] px-4 py-3 shadow-[6px_6px_0_#2a2418]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-[#3f3428]">
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 bg-[#6bbf59] border border-[#1f5f35]" />已完成</span>
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 bg-[#e0b45c] border border-[#8a5a1f]" />进行中</span>
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 bg-[#9db0c3] border border-[#43515e]" />可开始</span>
          <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 bg-[#7a7a7a] border border-[#424242]" />锁定</span>
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
        nodesDraggable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        fitView
        fitViewOptions={{ padding: 0.3, minZoom: 0.5, maxZoom: 1.5 }}
        minZoom={0.95}
        maxZoom={1.05}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background variant={BackgroundVariant.Cross} gap={24} size={1.1} color="rgba(255,255,255,0.08)" />
      </ReactFlow>

      {/* 点击节点后展示完整说明，避免把课程描述塞进小节点导致阅读困难。 */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/45"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#f3ead4] border-[3px] border-[#3f3428] shadow-[10px_10px_0_#1f1a13] overflow-hidden flex flex-col"
            >
              <div
                className={`px-6 py-5 border-b-[3px] flex items-center justify-between
                  ${selectedNode.status === 'completed' ? 'bg-[#c8efbf] border-[#2f6f45]' :
                    selectedNode.status === 'in-progress' ? 'bg-[#f0d19a] border-[#8a5a1f]' :
                    selectedNode.status === 'available' ? 'bg-[#cedae6] border-[#43515e]' :
                    'bg-[#cfcfcf] border-[#555]'}
                `}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase border
                      ${selectedNode.status === 'completed' ? 'bg-[#6bbf59] border-[#1f5f35] text-[#102a1a]' :
                        selectedNode.status === 'in-progress' ? 'bg-[#e0b45c] border-[#8a5a1f] text-[#40270e]' :
                        selectedNode.status === 'available' ? 'bg-[#9db0c3] border-[#43515e] text-[#17222d]' :
                        'bg-[#7a7a7a] border-[#424242] text-[#1f1f1f]'}
                    `}>
                      {selectedNode.status === 'in-progress' ? '进行中' :
                       selectedNode.status === 'completed' ? '已完成' :
                       selectedNode.status === 'locked' ? '锁定中' : '可开始'}
                    </span>
                    <span className="text-[#4b3f2f] text-xs tracking-widest uppercase flex items-center gap-1">
                      <BookOpen size={14} /> {selectedNode.type === 'main' ? '核心主线' : '扩展支线'}
                    </span>
                  </div>
                  <h2 className={`mt-3 text-3xl font-extrabold tracking-tight
                    ${selectedNode.status === 'completed' ? 'text-[#1b4d2d]' :
                      selectedNode.status === 'in-progress' ? 'text-[#5b3a14]' :
                      selectedNode.status === 'available' ? 'text-[#1f2a35]' :
                      'text-[#2a2a2a]'}
                  `}>
                    {selectedNode.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 border border-[#4b3f2d] bg-[#efe4cd] hover:bg-[#e5d6ba] text-[#3f3428] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 pb-8 flex-1">
                <div className="max-w-none">
                  <p className="text-lg leading-relaxed text-[#3d3226]">
                    {selectedNode.description}
                  </p>

                  <div className="mt-8 pt-6 border-t-[3px] border-[#d4c2a3]">
                    <h3 className="text-xl font-bold text-[#2c2418] mb-4 flex items-center gap-2">
                      <span className="text-[#8a5a1f]">#</span> 任务日志与说明
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#efe4cd] p-4 border-[2px] border-[#c8b28d]">
                        <div className="text-xs text-[#5a4a35] mb-1">经验值 (XP)</div>
                        <div className="text-2xl text-[#2c2418] flex items-center gap-2">
                          {selectedNode.xp || 0} <span className="text-[#2f6f45] text-sm">✓</span>
                        </div>
                      </div>
                      <div className="bg-[#efe4cd] p-4 border-[2px] border-[#c8b28d]">
                        <div className="text-xs text-[#5a4a35] mb-1">前置要求</div>
                        <div className="text-lg text-[#2c2418]">
                          {selectedNode.dependsOn.length > 0 ? `${selectedNode.dependsOn.length} 项前置任务` : '无前置要求'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t-[3px] border-[#d4c2a3] flex justify-end gap-4">
                  {(selectedNode.status === 'available' || selectedNode.status === 'in-progress') && (
                    <button className="px-6 py-3 bg-[#8a5a1f] hover:bg-[#734a19] text-[#fef3de] font-bold border-[2px] border-[#4f3211] transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                      <Play size={18} fill="currentColor" /> {selectedNode.status === 'in-progress' ? '继续推进' : '开始任务'}
                    </button>
                  )}
                  {selectedNode.status === 'completed' && (
                    <button className="px-6 py-3 bg-[#2f6f45] hover:bg-[#245638] text-[#e9ffe8] font-bold border-[2px] border-[#173421] transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                      <Check size={18} strokeWidth={3} /> 温故知新
                    </button>
                  )}
                  {selectedNode.status === 'locked' && (
                    <button className="px-6 py-3 bg-[#9a9a9a] text-[#3f3f3f] font-bold border-[2px] border-[#5b5b5b] cursor-not-allowed flex items-center gap-2">
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
