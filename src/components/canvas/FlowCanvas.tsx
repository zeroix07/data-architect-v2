import { useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'motion/react';
import { DollarSign, Activity, Plus, Maximize2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowCanvasProps {
  nodes: Node[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onInit: any;
  onDrop: any;
  onDragOver: any;
  onNodeClick: any;
  onNodeDragStart: any;
  onNodeDrag: any;
  onNodeDragStop: any;
  nodeTypes: any;
  edgeTypes?: any;
  updateEdgeLabel?: (edgeId: string, label: string) => void;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  isSimulationMode: boolean;
  setIsSimulationMode: (v: boolean) => void;
  isFailoverActive: boolean;
  setIsFailoverActive: (v: boolean) => void;
  connectionType: 'default' | 'replication';
  setConnectionType: (v: 'default' | 'replication') => void;
  estimatedCost: number;
  reactFlowInstance: any;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
  onClearCanvas: () => void;
}

export default function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  onDrop,
  onDragOver,
  onNodeClick,
  onNodeDragStart,
  onNodeDrag,
  onNodeDragStop,
  nodeTypes,
  edgeTypes,
  updateEdgeLabel,
  canvasRef,
  isSimulationMode,
  setIsSimulationMode,
  isFailoverActive,
  setIsFailoverActive,
  connectionType,
  setConnectionType,
  estimatedCost,
  reactFlowInstance,
  reactFlowWrapper,
  onClearCanvas,
}: FlowCanvasProps) {
  return (
    <div className="flex-1 relative bg-[#080b10]" ref={canvasRef || reactFlowWrapper}>
      {/* Glassmorphism Header Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full z-20 flex items-center justify-between px-4 shadow-2xl">
        <div className="flex items-center gap-4 overflow-x-auto">
          {/* FinOps */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center text-brand">
              <DollarSign size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-white/40 uppercase font-black tracking-widest leading-none">FinOps</span>
              <span className="text-xs font-mono font-bold text-[#10b981]">
                $<motion.span key={estimatedCost} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
                  {estimatedCost.toFixed(2)}
                </motion.span>/mo
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 shrink-0" />

          {/* Simulation */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-[8px] text-white/40 uppercase font-black tracking-widest select-none whitespace-nowrap" htmlFor="sim-mode">Sim</label>
            <button id="sim-mode" onClick={() => setIsSimulationMode(!isSimulationMode)}
              className={cn('w-9 h-4.5 rounded-full p-0.5 transition-all duration-300 relative', isSimulationMode ? 'bg-emerald-500' : 'bg-white/10')}>
              <motion.div animate={{ x: isSimulationMode ? 18 : 0 }} className="w-3.5 h-3.5 bg-white rounded-full shadow-lg" />
            </button>
          </div>

          <div className="h-6 w-px bg-white/10 shrink-0" />

          {/* Connection Type */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[8px] text-white/40 uppercase font-black tracking-widest select-none">Conn</span>
            <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5">
              <button onClick={() => setConnectionType('default')}
                className={cn('px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest rounded-full transition-all', connectionType === 'default' ? 'bg-brand text-white' : 'text-white/40 hover:text-white')}>
                Std
              </button>
              <button onClick={() => setConnectionType('replication')}
                className={cn('px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest rounded-full transition-all', connectionType === 'replication' ? 'bg-orange-500 text-black' : 'text-white/40 hover:text-white')}>
                Repl
              </button>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 shrink-0" />

          {/* Failover */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-[8px] text-white/40 uppercase font-black tracking-widest select-none whitespace-nowrap" htmlFor="failover-mode">DR</label>
            <button id="failover-mode" onClick={() => setIsFailoverActive(!isFailoverActive)}
              className={cn('w-9 h-4.5 rounded-full p-0.5 transition-all duration-300 relative', isFailoverActive ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse' : 'bg-white/10')}>
              <motion.div animate={{ x: isFailoverActive ? 18 : 0 }} className="w-3.5 h-3.5 bg-white rounded-full shadow-lg" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-[10px] text-white/40 font-mono">{nodes.length} nodes</div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-20 left-6 z-10 flex flex-col gap-2">
        <button onClick={() => reactFlowInstance?.zoomIn()} title="Zoom In" className="w-10 h-10 bg-surface-brighter border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all shadow-xl">
          <Plus size={18} />
        </button>
        <button onClick={() => reactFlowInstance?.zoomOut()} title="Zoom Out" className="w-10 h-10 bg-surface-brighter border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all shadow-xl">
          <div className="w-4 h-0.5 bg-current rounded-full" />
        </button>
        <button onClick={() => reactFlowInstance?.fitView()} title="Fit View" className="w-10 h-10 bg-surface-brighter border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all shadow-xl">
          <Maximize2 size={16} />
        </button>
        <div className="h-px w-full bg-white/5 my-1" />
        <button onClick={onClearCanvas} title="Clear Canvas" className="w-10 h-10 bg-surface-brighter border border-white/10 rounded-lg flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-400/5 transition-all shadow-xl">
          <Trash2 size={16} />
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background color="#fff" gap={24} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'boundaryNode') return '#6366f1';
            const type = node.data?.type;
            if (type === 'cloud') return '#3b82f6';
            if (type === 'on-premise') return '#eab308';
            return '#06b6d4';
          }}
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{ background: '#0f1219', border: '1px solid rgba(255,255,255,0.1)' }}
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-10">
          <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-brand" />
            Cloud
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">
            <div className="w-4 h-0.5 border-t-2 border-slate-500" />
            On-Prem
          </div>
        </div>
      </ReactFlow>
    </div>
  );
}
