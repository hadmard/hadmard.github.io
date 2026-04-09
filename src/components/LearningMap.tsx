import React, { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
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
  const isLocked = data.status === 'locked';
  const isAvailable = data.status === 'available';

  const [isHovered, setIsHovered] = useState(false);

  // Minecraft Achievement style themes:
  const themeClasses = useMemo(() => {
    if (isCompleted) return 'backdrop-blur-xl border-white/20 bg-white/10 shadow-[0_8px_32px_rgba(255,255,255,0.15)] ring-white/50 text-white rounded-2xl';
    if (isInProgress) return 'backdrop-blur-xl border-white/30 bg-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.25)] ring-white/70 text-white rounded-2xl';
    if (isAvailable) return 'backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-white/80 rounded-2xl transition-all duration-300';
    return 'backdrop-blur-sm border border-white/5 bg-black/40 opacity-50 grayscale text-white/50 rounded-2xl';
  }, [isCompleted, isInProgress, isAvailable]);

  const iconClasses = useMemo(() => {
    if (isCompleted) return 'text-white';
    if (isInProgress) return 'text-white/90 animate-pulse';
    if (isAvailable) return 'text-white/60';
    return 'text-white/30';
  }, [isCompleted, isInProgress, isAvailable]);

  return (
    <div
      className="relative flex items-center justify-center p-2 cursor-pointer group transition-transform duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`relative flex items-center justify-center w-[72px] h-[72px] rounded-xl border-[3px] transition-all duration-300 ${themeClasses} ${selected ? 'ring-4 scale-105' : 'hover:scale-105'} z-10`}
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

      {/* Hover Tooltip (Minecraft Advancement style popup) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
            className={`absolute z-50 left-[90px] top-0 min-w-[240px] p-4 rounded-lg border-2 !pointer-events-none
              ${isCompleted ? 'border-[#E2C044] bg-[#2C2B26]/95' : 
                isInProgress ? 'border-[#55CCD4] bg-[#1E2E31]/95' : 
                'border-[#8A8A8A] bg-[#2A2A2A]/95'} 
              backdrop-blur-md shadow-2xl origin-top-left`}
          >
            <div className="flex flex-col gap-2">
              <h3 className={`text-base font-bold font-sans ${isCompleted ? 'text-[#E2C044]' : isInProgress ? 'text-[#55CCD4]' : 'text-gray-200'}`}>
                {data.title}
              </h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-3">
                {data.description}
              </p>
              {data.status === 'locked' && (
                <div className="mt-2 inline-block px-2 py-1 bg-red-900/40 border border-red-800 rounded text-[10px] text-red-500 font-mono tracking-wider w-max">
                  未解锁 - 需完成前置
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
        const isDepCompleted = learningMapData.find(n => n.id === depId)?.status === 'completed';
        const targetColor = node.status === 'completed' ? '#E2C044' : node.status === 'in-progress' ? '#55CCD4' : '#8A8A8A';
        const strokeColor = isDepCompleted ? targetColor : '#3A3A3A';
        
        edges.push({
          id: `e-${depId}-${node.id}`,
          source: depId,
          target: node.id,
          // Minecraft wiring style - step line
          type: 'step',
          animated: isDepCompleted && node.status !== 'completed',
          style: { 
            stroke: strokeColor,
            strokeWidth: isDepCompleted ? 3 : 2,
            opacity: node.status === 'locked' ? 0.3 : 1
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
    <div className="w-full h-[600px] sm:h-[800px] rounded-[24px] overflow-hidden relative bg-[#121212] border border-[#2a2a2a] shadow-[0_0_50px_rgba(0,0,0,0.5)] font-sans">
      
      {/* HUD Info */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none select-none">
        <h2 className="text-3xl font-bold text-gray-100 drop-shadow-md tracking-tight">
          进度与成就
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-sm drop-shadow-md">
          滑动拖拽来探索全景地图，光标悬停查看任务预览，点击方块开启详细档案。
        </p>
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
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background gap={48} size={2} color="rgba(255,255,255,0.03)" />
        <Controls showInteractive={false} className="!bg-[#222] border !border-[#444] shadow-xl [&>button]:!border-b-[#333] [&>button]:!text-gray-300 [&>button:hover]:!bg-[#333] fill-gray-400" />
      </ReactFlow>

      {/* Detail Modal Overlay with framer-motion */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#1a1c1e] border border-[#333] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div 
                className={`px-8 py-6 border-b-2 flex items-center justify-between
                  ${selectedNode.status === 'completed' ? 'bg-[#E2C044]/10 border-[#E2C044]/30' : 
                    selectedNode.status === 'in-progress' ? 'bg-[#55CCD4]/10 border-[#55CCD4]/30' : 
                    'bg-[#2A2A2A] border-[#444]'}
                `}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-bold font-mono rounded tracking-widest uppercase
                      ${selectedNode.status === 'completed' ? 'bg-[#E2C044] text-black' : 
                        selectedNode.status === 'in-progress' ? 'bg-[#55CCD4] text-black' : 
                        selectedNode.status === 'available' ? 'bg-[#555] text-white' : 
                        'bg-red-900/50 text-red-200 border border-red-800'}
                    `}>
                      {selectedNode.status === 'in-progress' ? '进行中' : 
                       selectedNode.status === 'completed' ? '已完成' : 
                       selectedNode.status === 'locked' ? '锁定中' : '可供探索'}
                    </span>
                    <span className="text-gray-400 text-sm font-mono tracking-widest uppercase flex items-center gap-1">
                      <BookOpen size={14} /> {selectedNode.type === 'main' ? '核心主线' : '扩展支线'}
                    </span>
                  </div>
                  <h2 className={`mt-3 text-3xl font-extrabold tracking-tight
                    ${selectedNode.status === 'completed' ? 'text-[#E2C044]' : 
                      selectedNode.status === 'in-progress' ? 'text-[#55CCD4]' : 
                      'text-gray-100'}
                  `}>
                    {selectedNode.title}
                  </h2>
                </div>
                
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-8 pb-10 flex-1 bg-gradient-to-b from-[#1a1c1e] to-[#121212]">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-gray-300">
                    {selectedNode.description}
                  </p>
                  
                  {/* Detailed Content Box */}
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-[#55CCD4]">#</span> 任务日志与详情
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#222] p-4 rounded-xl border border-white/5">
                        <div className="text-sm text-gray-500 mb-1">经验值 (XP)</div>
                        <div className="text-2xl font-mono text-white flex items-center gap-2">
                          {selectedNode.xp || 0} <span className="text-[#E2C044] text-sm">✨</span>
                        </div>
                      </div>
                      <div className="bg-[#222] p-4 rounded-xl border border-white/5">
                        <div className="text-sm text-gray-500 mb-1">前置要求</div>
                        <div className="text-lg text-gray-200">
                          {selectedNode.dependsOn.length > 0 ? `${selectedNode.dependsOn.length} 项前置任务` : '无前置要求'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-10 pt-6 border-t border-white/10 flex justify-end gap-4">
                  {(selectedNode.status === 'available' || selectedNode.status === 'in-progress') && (
                    <button className="px-6 py-3 bg-[#55CCD4] hover:bg-[#45b8c0] text-black font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_15px_rgba(85,204,212,0.4)]">
                      <Play size={18} fill="currentColor" /> {selectedNode.status === 'in-progress' ? '继续执行' : '开始任务'}
                    </button>
                  )}
                  {selectedNode.status === 'completed' && (
                    <button className="px-6 py-3 bg-[#E2C044] hover:bg-[#d0b03e] text-black font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_15px_rgba(226,192,68,0.4)]">
                      <Check size={18} strokeWidth={3} /> 温故知新
                    </button>
                  )}
                  {selectedNode.status === 'locked' && (
                    <button className="px-6 py-3 bg-[#333] text-gray-500 font-bold rounded-xl cursor-not-allowed flex items-center gap-2">
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