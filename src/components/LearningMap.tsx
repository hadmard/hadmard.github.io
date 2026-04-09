import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
import { Check, Lock, Play, Circle } from 'lucide-react';

type CustomNodeType = Node<LearningNode & Record<string, unknown>, 'customTask'>;

const BaseNode = ({ data }: NodeProps<CustomNodeType>) => {
  const isCompleted = data.status === 'completed';
  const isInProgress = data.status === 'in-progress';
  const isLocked = data.status === 'locked';
  const isAvailable = data.status === 'available';

  // 根据状态设定不同的样式
  let statusClasses = '';
  if (isCompleted) {
    statusClasses = 'border-slate-200 bg-white/80 shadow-[0_4px_20px_rgba(15,23,42,0.06)]';
  } else if (isInProgress) {
    statusClasses = 'border-sky-300 bg-sky-50 shadow-[0_8px_30px_rgba(14,165,233,0.15)] ring-2 ring-sky-400/50';
  } else if (isAvailable) {
    statusClasses = 'border-slate-300/50 bg-white opacity-90';
  } else if (isLocked) {
    statusClasses = 'border-slate-200 bg-slate-100 opacity-60 grayscale';
  }

  return (
    <div className={`relative flex flex-col p-4 w-64 rounded-2xl border backdrop-blur-md transition-all duration-300 ${statusClasses}`}>
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-3 !h-3 !border-2 !border-white" />
      
      <div className="flex items-center gap-3 mb-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isCompleted ? 'bg-slate-800 text-white' : isInProgress ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
          {isCompleted && <Check size={16} strokeWidth={3} />}
          {isInProgress && <Play size={16} fill="currentColor" className="ml-0.5" />}
          {isAvailable && <Circle size={16} />}
          {isLocked && <Lock size={16} />}
        </div>
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-wider ${isInProgress ? 'text-sky-600' : 'text-slate-500'}`}>
            {data.status === 'in-progress' ? '进行中' : data.status === 'completed' ? '已完成' : data.status === 'locked' ? '未解锁' : '可开始'}
          </p>
          <h3 className="text-sm font-semibold text-slate-800 mt-0.5 leading-tight">{data.title}</h3>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
        {data.description}
      </p>

      <Handle type="source" position={Position.Bottom} className="!bg-sky-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
};


const nodeTypes = {
  customTask: BaseNode,
};

export default function LearningMap() {
  const [selectedNode, setSelectedNode] = React.useState<LearningNode | null>(null);

  // 从原始数据中派生 XYFlow 的 Node 和 Edge
  const initialNodes: Node[] = useMemo(() => {
    return learningMapData.map((node) => ({
      id: node.id,
      type: 'customTask',
      position: node.position || { x: Math.random() * 500, y: Math.random() * 500 },
      data: { ...node },
    }));
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    learningMapData.forEach((node) => {
      node.dependsOn.forEach((depId) => {
        const isDepCompleted = learningMapData.find(n => n.id === depId)?.status === 'completed';
        edges.push({
          id: `e-${depId}-${node.id}`,
          source: depId,
          target: node.id,
          animated: isDepCompleted && node.status !== 'completed',
          style: { 
            stroke: isDepCompleted ? '#0ea5e9' : '#cbd5e1',
            strokeWidth: isDepCompleted ? 2 : 1,
            opacity: node.status === 'locked' ? 0.3 : 1
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isDepCompleted ? '#0ea5e9' : '#cbd5e1',
          },
        });
      });
    });
    return edges;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[600px] sm:h-[700px] rounded-[30px] border border-slate-200/60 bg-white/70 backdrop-blur-xl overflow-hidden relative shadow-[0_15px_40px_rgba(15,23,42,0.06)]">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <span className="inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium tracking-wider bg-sky-50 text-sky-600 border border-sky-100 shadow-sm">
          核心探索地图
        </span>
        <h2 className="text-2xl font-semibold text-slate-900 mt-3 drop-shadow-sm">
          课程进度图谱
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">
          拖拽并缩放以查看前置与连结关系，完成前置条件即可解锁核心支线。
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
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        className="bg-transparent"
      >
        <Background gap={40} size={1} color="rgba(15,23,42,0.04)" />
        <Controls showInteractive={false} className="!bg-white border !border-slate-200 shadow-md [&>button]:!border-b-slate-100 [&>button]:!text-slate-600 [&>button:hover]:!bg-slate-50 fill-slate-500" />
        <MiniMap 
          className="!bg-white/90 !border-slate-200 shadow-lg rounded-xl overflow-hidden" 
          maskColor="rgba(248, 250, 252, 0.7)" 
          nodeColor={(n: Node) => {
            const status = (n.data as unknown as LearningNode)?.status;
            if (status === 'completed') return '#94a3b8';
            if (status === 'in-progress') return '#38bdf8';
            return '#e2e8f0';
          }}
        />
      </ReactFlow>

      {/* 详情抽屉 (Sidebar Drawer) */}
      <div 
        className={`absolute top-0 right-0 w-80 h-full bg-white border-l border-slate-200 shadow-[-10px_0_30px_rgba(15,23,42,0.08)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedNode && (
          <div className="p-6 h-full flex flex-col">
            <button 
              className="self-end text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 p-1.5 rounded-md border border-slate-200" 
              onClick={() => setSelectedNode(null)}
            >
              关闭
            </button>
            <div className="mt-4 flex-1">
              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium tracking-wider mb-4 ${selectedNode.status === 'in-progress' ? 'bg-sky-50 text-sky-600 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                {selectedNode.status === 'in-progress' ? 'STATUS: ACTIVE' : `STATUS: ${selectedNode.status.toUpperCase()}`}
              </span>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{selectedNode.title}</h3>
              <p className="text-sm text-slate-600 leading-7">{selectedNode.description}</p>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs uppercase text-slate-400 font-semibold mb-2 tracking-widest">Metadata</p>
                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                  <div>
                    <p className="text-slate-400 mb-1 leading-none">类型</p>
                    <p className="text-slate-700 font-medium">{selectedNode.type === 'main' ? '主线任务' : '支线拓展'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1 leading-none">XP 奖励</p>
                    <p className="text-slate-700 font-medium">+{selectedNode.xp}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-100">
              <button 
                className={`w-full py-3 rounded-xl font-medium transition-colors ${selectedNode.status === 'available' ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-[0_5px_15px_rgba(14,165,233,0.3)]' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                disabled={selectedNode.status !== 'available'}
              >
                {selectedNode.status === 'available' ? '开始此阶段' : selectedNode.status === 'in-progress' ? '前往任务面板' : selectedNode.status === 'locked' ? '条件未满足' : '阶段已完成'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
