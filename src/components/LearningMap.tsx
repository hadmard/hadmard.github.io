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
import { Check, Lock, Play, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CustomNodeType = Node<LearningNode & Record<string, unknown>, 'customTask'>;

const statusConfig = {
  completed: {
    chip: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    ring: 'border-emerald-400/45',
    dot: 'bg-emerald-400',
    icon: <Check size={16} />,
    label: '已完成',
  },
  'in-progress': {
    chip: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    ring: 'border-sky-400/45',
    dot: 'bg-sky-400',
    icon: <Play size={14} fill="currentColor" />,
    label: '进行中',
  },
  available: {
    chip: 'bg-slate-500/20 text-slate-200 border-slate-300/35',
    ring: 'border-slate-300/40',
    dot: 'bg-slate-300',
    icon: <Circle size={14} />,
    label: '可开始',
  },
  locked: {
    chip: 'bg-zinc-700/35 text-zinc-300 border-zinc-500/40',
    ring: 'border-zinc-600/45',
    dot: 'bg-zinc-500',
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
          'w-[210px] rounded-2xl border bg-[#0f1726]/92 px-4 py-3 text-slate-100 shadow-[0_12px_24px_rgba(2,6,23,0.35)] transition-colors duration-200',
          cfg.ring,
          selected ? 'ring-2 ring-sky-300/55' : 'hover:border-sky-300/45',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
            <h3 className="text-sm font-semibold leading-5 text-slate-100">{data.title}</h3>
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
            className="pointer-events-none absolute left-0 top-[100%] z-40 mt-2 w-[260px] rounded-xl border border-slate-500/40 bg-[#0b1220]/95 p-3 text-xs leading-6 text-slate-300 shadow-xl"
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
        const color = active ? '#60a5fa' : '#475569';

        edges.push({
          id: `e-${depId}-${node.id}`,
          source: depId,
          target: node.id,
          type: 'smoothstep',
          animated: sourceStatus === 'in-progress',
          style: {
            stroke: color,
            strokeWidth: active ? 2.2 : 1.4,
            opacity: node.status === 'locked' ? 0.45 : 0.9,
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
    <div className="relative h-[640px] w-full overflow-hidden rounded-[22px] border border-slate-700/55 bg-[#050a14] sm:h-[800px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 14%, rgba(56,189,248,0.14), transparent 35%), radial-gradient(circle at 82% 24%, rgba(59,130,246,0.14), transparent 32%), linear-gradient(180deg, rgba(11,18,32,0.88), rgba(7,12,22,0.96))',
        }}
      />

      <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-xl border border-slate-500/45 bg-[#0b1220]/82 px-4 py-3 text-slate-100 backdrop-blur-sm">
        <p className="text-[11px] uppercase tracking-[0.18em] text-sky-300">Progress Graph</p>
        <p className="mt-1 text-sm text-slate-300">左到右为深度推进 · 同列为并列能力</p>
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
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        fitView
        fitViewOptions={{ padding: 0.18, minZoom: 0.35, maxZoom: 1.25 }}
        minZoom={0.8}
        maxZoom={1.05}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="rgba(148,163,184,0.18)" />
      </ReactFlow>

      <div className="absolute bottom-5 right-5 z-10 rounded-xl border border-slate-500/45 bg-[#0b1220]/85 px-4 py-3 text-xs text-slate-300 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-emerald-400" />已完成</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-sky-400" />进行中</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-slate-300" />可开始</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-zinc-500" />锁定</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-6"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-500/50 bg-[#0b1220] text-slate-100 shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-600/60 bg-[#10192c] px-6 py-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-sky-300">Node Detail</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">{selectedNode.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-lg border border-slate-500/50 bg-slate-800/70 p-2 text-slate-300 transition-colors hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 px-6 py-6">
                <p className="leading-8 text-slate-300">{selectedNode.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-600/65 bg-slate-900/55 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-400">XP</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-100">{selectedNode.xp || 0}</div>
                  </div>
                  <div className="rounded-xl border border-slate-600/65 bg-slate-900/55 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-400">前置任务</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-100">{selectedNode.dependsOn.length}</div>
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
