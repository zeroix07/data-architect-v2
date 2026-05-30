import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, ArrowRight } from 'lucide-react';
import type { Node, Edge } from 'reactflow';

interface ToRPanelProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

export default function ToRPanel({ nodes, edges, onClose }: ToRPanelProps) {
  return (
    <>
      <motion.div
        key="tor-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        key="tor-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-[500px] z-[160] bg-surface-brighter border-l border-white/10 shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Specification</h3>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Generated ToR Document</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-white/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          <section className="space-y-4">
            <h4 className="text-brand font-bold text-xs uppercase tracking-[0.2em]">1. Overview</h4>
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                This document outlines the technical architecture for the "Global Analytics Platform" mesh. It synchronizes multiple cloud vendors with on-premise cache layers to provide sub-100ms query latency.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-brand font-bold text-xs uppercase tracking-[0.2em]">2. Infrastructure Components</h4>
            <div className="overflow-hidden border border-white/5 rounded-xl">
              <table className="w-full text-[10px]">
                <thead className="bg-white/5 text-white/40 uppercase font-black tracking-widest">
                  <tr>
                    <th className="px-4 py-2 text-left">Entity</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/10">
                  {nodes.map((node) => (
                    <tr key={node.id}>
                      <td className="px-4 py-2 font-mono text-brand">{node.data.label}</td>
                      <td className="px-4 py-2 opacity-60 uppercase">{node.data.type}</td>
                      <td className="px-4 py-2 text-emerald-500 font-bold">Encrypted</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-brand font-bold text-xs uppercase tracking-[0.2em]">3. Data Flow Logic</h4>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
              {edges.length > 0 ? (
                <div className="space-y-3">
                  {edges.map((edge, i) => {
                    const src = nodes.find((n) => n.id === edge.source);
                    const trg = nodes.find((n) => n.id === edge.target);
                    return (
                      <div key={edge.id} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-brand/20 flex items-center justify-center text-[8px] font-bold text-brand">{i + 1}</div>
                        <span className="text-[11px] text-white/60">{src?.data.label}</span>
                        <ArrowRight size={10} className="text-white/20" />
                        <span className="text-[11px] text-white/60 font-bold">{trg?.data.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[10px] text-white/20 italic">No node connections detected in current architecture.</p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-brand font-bold text-xs uppercase tracking-[0.2em]">4. Deployment Strategy</h4>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <p className="text-[11px] text-emerald-400/80 leading-relaxed font-mono">
                $ terraform plan -out=main.tfplan<br />
                $ terraform apply "main.tfplan"<br />
                ...<br />
                Deployment Successful: 0 Errors, {nodes.length} Resources Created.
              </p>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-white/5 flex gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-brand/20 transition-all"
          >
            Download PDF Case
          </button>
          <button className="flex-1 py-1 px-4 bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:text-white transition-all">
            Share Link
          </button>
        </div>
      </motion.div>
    </>
  );
}
