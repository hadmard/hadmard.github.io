import React, { useEffect, useMemo, useState } from 'react';
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
import { Check, Lock, Play, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CustomNodeType = Node<LearningNode & Record<string, unknown>, 'customTask'>;

const statusConfig = {
  completed: {
    chip: 'bg-white/12 text-white border-white/28',
    ring: 'border-white/30',
    dot: 'bg-white',
    icon: <Check size={16} />,
    label: '已掌握',
  },
  'in-progress': {
    chip: 'bg-[#0071e3]/20 text-[#7cc0ff] border-[#2997ff]/45',
    ring: 'border-[#2997ff]/55',
    dot: 'bg-[#2997ff]',
    icon: <Play size={14} fill="currentColor" />,
    label: '进行中',
  },
  available: {
    chip: 'bg-[#d2d2d7]/14 text-[#e8e8ed] border-[#d2d2d7]/35',
    ring: 'border-[#d2d2d7]/38',
    dot: 'bg-[#d2d2d7]',
    icon: <Circle size={14} />,
    label: '待开始',
  },
  locked: {
    chip: 'bg-[#2a2a2d] text-[#a1a1a6] border-[#3a3a3c]',
    ring: 'border-[#3a3a3c]',
    dot: 'bg-[#636366]',
    icon: <Lock size={14} />,
    label: '锁定',
  },
} as const;

const BaseNode = ({ data, selected }: NodeProps<CustomNodeType>) => {
  const [isHovered, setIsHovered] = useState(false);
  const cfg = statusConfig[data.status];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-none !w-3 !h-3" style={{ left: -8 }} />

      <div
        className={[
          'w-[184px] sm:w-[214px] rounded-lg border bg-[#272729] px-3 py-2.5 sm:px-4 sm:py-3 text-[#f5f5f7] transition-colors duration-200',
          cfg.ring,
          selected ? 'ring-2 ring-[#0071e3]/75' : 'hover:border-[#2997ff]/45',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
            <h3 className="text-[12px] sm:text-[13px] font-semibold leading-5 text-[#f5f5f7]">{data.title}</h3>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${cfg.chip}`}>
            {cfg.icon}
            {cfg.label}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-transparent !border-none !w-3 !h-3" style={{ right: -8 }} />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="pointer-events-none absolute left-0 top-[100%] z-40 mt-2 w-[220px] sm:w-[270px] rounded-lg border border-[#3a3a3c] bg-[#1d1d1f] p-3 text-xs leading-6 text-[#d2d2d7] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]"
          >
            {data.description}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const nodeTypes = { customTask: BaseNode };

export default function LearningMap() {
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const update = () => setIsCompact(window.innerWidth < 640);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const initialNodes: Node[] = useMemo(() => {
    return learningMapData.map((node) => ({
      id: node.id,
      type: 'customTask',
      position: node.position || { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { ...node },
    }));
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    learningMapData.forEach((node) => {
      node.dependsOn.forEach((depId) => {
        const sourceStatus = learningMapData.find((item) => item.id === depId)?.status;
        const active = sourceStatus === 'completed' || sourceStatus === 'in-progress';
        const color = active ? '#0071e3' : '#636366';

        edges.push({
          id: `e-${depId}-${node.id}`,
          source: depId,
          target: node.id,
          type: 'smoothstep',
          animated: sourceStatus === 'in-progress',
          style: {
            stroke: color,
            strokeWidth: active ? 2.2 : 1.4,
            opacity: node.status === 'locked' ? 0.38 : 0.85,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color,
            width: 14,
            height: 14,
          },
        });
      });
    });

    return edges;
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border border-black/10 bg-[#000000] sm:h-[800px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 14%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 82% 24%, rgba(0,113,227,0.18), transparent 32%), linear-gradient(180deg, rgba(0,0,0,0.9), rgba(11,11,12,0.96))',
        }}
      />

      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-white/20 bg-black/45 px-3 py-2 text-white backdrop-blur-sm sm:left-5 sm:top-5 sm:px-4 sm:py-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#2997ff]">Progress Graph</p>
        <p className="mt-1 text-xs sm:text-sm text-white/76">左到右为深度推进，同列为并列能力</p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => setSelectedNode(node.data as unknown as LearningNode)}
        onPaneClick={() => setSelectedNode(null)}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        panOnDrag={isCompact}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={isCompact}
        zoomOnDoubleClick={false}
        fitView
        fitViewOptions={{
          padding: isCompact ? 0.12 : 0.18,
          minZoom: isCompact ? 0.26 : 0.35,
          maxZoom: isCompact ? 1 : 1.25,
        }}
        minZoom={isCompact ? 0.26 : 0.45}
        maxZoom={isCompact ? 1 : 1.05}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.1} color="rgba(210,210,215,0.16)" />
      </ReactFlow>

      <div className="absolute bottom-3 right-3 z-10 rounded-lg border border-white/20 bg-black/48 px-3 py-2 text-[11px] text-white/82 backdrop-blur-sm sm:bottom-5 sm:right-5 sm:px-4 sm:py-3 sm:text-xs">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-white" />已掌握</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#2997ff]" />进行中</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#d2d2d7]" />待开始</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#636366]" />锁定</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#3a3a3c] bg-[#1d1d1f] text-[#f5f5f7] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]"
            >
              <div className="flex items-start justify-between border-b border-white/12 bg-[#242426] px-6 py-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#2997ff]">Node Detail</p>
                  <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">{selectedNode.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-lg border border-white/14 bg-white/6 p-2 text-white/72 transition-colors hover:border-[#2997ff]/45 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
                <p className="leading-7 sm:leading-8 text-white/78">{selectedNode.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-white/12 bg-black/26 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-white/60">XP</div>
                    <div className="mt-2 text-2xl font-semibold text-[#f5f5f7]">{selectedNode.xp || 0}</div>
                  </div>
                  <div className="rounded-lg border border-white/12 bg-black/26 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-white/60">前置任务</div>
                    <div className="mt-2 text-2xl font-semibold text-[#f5f5f7]">{selectedNode.dependsOn.length}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
