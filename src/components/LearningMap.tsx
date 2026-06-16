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
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ring: 'border-emerald-200',
    dot: 'bg-emerald-500',
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.66)), linear-gradient(135deg, rgba(52,199,89,0.13), transparent 72%)',
    icon: <Check size={16} />,
    label: '已掌握',
  },
  'in-progress': {
    chip: 'bg-[#0071e3]/10 text-[#0066cc] border-[#0071e3]/24',
    ring: 'border-[#0071e3]/30',
    dot: 'bg-[#0071e3]',
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.66)), linear-gradient(135deg, rgba(0,113,227,0.14), rgba(162,132,255,0.08) 72%)',
    icon: <Play size={14} fill="currentColor" />,
    label: '进行中',
  },
  available: {
    chip: 'bg-orange-50 text-orange-700 border-orange-200',
    ring: 'border-orange-200',
    dot: 'bg-orange-400',
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.66)), linear-gradient(135deg, rgba(255,159,10,0.13), transparent 72%)',
    icon: <Circle size={14} />,
    label: '待开始',
  },
  locked: {
    chip: 'bg-slate-50 text-[#86868b] border-black/8',
    ring: 'border-black/8',
    dot: 'bg-[#d2d2d7]',
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.78), rgba(245,245,247,0.72)), linear-gradient(135deg, rgba(162,132,255,0.07), transparent 72%)',
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
          'w-[188px] sm:w-[218px] rounded-2xl border bg-white/74 px-3 py-2.5 text-[#1d1d1f] shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition duration-300 sm:px-4 sm:py-3',
          cfg.ring,
          selected ? 'ring-2 ring-[#0071e3]/55' : 'hover:-translate-y-0.5 hover:border-[#0071e3]/24 hover:bg-white/92',
        ].join(' ')}
        style={{ background: cfg.surface }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
            <h3 className="text-[12px] sm:text-[13px] font-semibold leading-5 text-[#1d1d1f]">{data.title}</h3>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide ${cfg.chip}`}>
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
            className="pointer-events-none absolute left-0 top-[100%] z-40 mt-2 w-[220px] rounded-2xl border border-black/10 bg-white/88 p-3 text-xs leading-6 text-[#424245] shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:w-[270px]"
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
        const color = sourceStatus === 'completed'
          ? '#34c759'
          : sourceStatus === 'in-progress'
            ? '#0071e3'
            : sourceStatus === 'available'
              ? '#ff9f0a'
              : '#b8bdc7';

        edges.push({
          id: `e-${depId}-${node.id}`,
          source: depId,
          target: node.id,
          type: 'smoothstep',
          animated: sourceStatus === 'in-progress',
          style: {
            stroke: color,
            strokeWidth: active ? 2.4 : 1.5,
            opacity: node.status === 'locked' ? 0.42 : 0.78,
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
    <div className="relative h-[620px] w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/68 shadow-[0_28px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:h-[760px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(130deg, rgba(0,113,227,0.12), transparent 34%), linear-gradient(232deg, rgba(255,107,138,0.10), transparent 38%), linear-gradient(42deg, rgba(52,199,89,0.10), transparent 44%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,245,247,0.82))',
        }}
      />

      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-2xl border border-white/80 bg-white/72 px-3 py-2 text-[#1d1d1f] shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:left-5 sm:top-5 sm:px-4 sm:py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0066cc]">Skill Route</p>
        <p className="mt-1 text-xs text-[#1d1d1f]/64 sm:text-sm">从基础能力滑向研究与工程汇合点</p>
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
        minZoom={isCompact ? 0.26 : 0.36}
        maxZoom={isCompact ? 1 : 1.05}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={26} size={1.1} color="rgba(0,0,0,0.085)" />
      </ReactFlow>

      <div className="absolute bottom-3 right-3 z-10 rounded-2xl border border-white/80 bg-white/74 px-3 py-2 text-[11px] text-[#1d1d1f]/72 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:bottom-5 sm:right-5 sm:px-4 sm:py-3 sm:text-xs">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-emerald-500" />已掌握</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#0071e3]" />进行中</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-orange-400" />待开始</span>
          <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#d2d2d7]" />锁定</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/52 p-4 backdrop-blur-md sm:p-6"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 text-[#1d1d1f] shadow-[0_28px_80px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between border-b border-black/8 bg-[#f5f5f7]/78 px-6 py-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0071e3]">Node Detail</p>
                  <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">{selectedNode.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded-full border border-black/10 bg-white/70 p-2 text-[#1d1d1f]/72 transition-colors hover:border-[#0071e3]/30 hover:text-[#0071e3]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
                <p className="leading-7 text-[#1d1d1f]/68 sm:leading-8">{selectedNode.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-black/8 bg-[#f5f5f7]/72 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-[#86868b]">XP</div>
                    <div className="mt-2 text-2xl font-semibold text-[#1d1d1f]">{selectedNode.xp || 0}</div>
                  </div>
                  <div className="rounded-2xl border border-black/8 bg-[#f5f5f7]/72 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-[#86868b]">前置任务</div>
                    <div className="mt-2 text-2xl font-semibold text-[#1d1d1f]">{selectedNode.dependsOn.length}</div>
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
