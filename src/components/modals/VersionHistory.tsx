import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, RotateCcw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Node, Edge } from 'reactflow';

export interface Snapshot {
  id: string;
  name: string;
  timestamp: string;
  nodes: Node[];
  edges: Edge[];
}

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: Snapshot[];
  currentNodes: Node[];
  currentEdges: Edge[];
  onSaveSnapshot: (name: string) => void;
  onRestoreSnapshot: (snapshot: Snapshot) => void;
  onDeleteSnapshot: (id: string) => void;
}

export default function VersionHistory({
  isOpen,
  onClose,
  snapshots,
  currentNodes,
  currentEdges,
  onSaveSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
}: VersionHistoryProps) {
  const [snapshotName, setSnapshotName] = useState('');

  const handleSave = () => {
    const name = snapshotName.trim() || `Snapshot ${snapshots.length + 1}`;
    onSaveSnapshot(name);
    setSnapshotName('');
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[380px] z-[160] bg-surface-brighter border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
                  <Clock size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Version History</h3>
                  <p className="text-[10px] text-white/40">{snapshots.length} snapshots saved</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Save new snapshot */}
            <div className="p-4 border-b border-white/5">
              <div className="flex gap-2">
                <input
                  value={snapshotName}
                  onChange={(e) => setSnapshotName(e.target.value)}
                  placeholder="Snapshot name..."
                  className="flex-1 bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <button
                  onClick={handleSave}
                  className="px-3 py-2 bg-brand text-white text-[10px] font-bold uppercase rounded hover:bg-brand/80 transition-all flex items-center gap-1"
                >
                  <Save size={12} />
                  Save
                </button>
              </div>
            </div>

            {/* Snapshot list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              {snapshots.length === 0 ? (
                <div className="text-center py-12">
                  <Clock size={32} className="mx-auto mb-3 text-white/10" />
                  <p className="text-xs text-white/30">No snapshots yet</p>
                  <p className="text-[10px] text-white/20 mt-1">Save your first snapshot above</p>
                </div>
              ) : (
                snapshots.map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white font-medium">{snapshot.name}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onRestoreSnapshot(snapshot)}
                          className="p-1 text-brand hover:bg-brand/10 rounded"
                          title="Restore this snapshot"
                        >
                          <RotateCcw size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteSnapshot(snapshot.id)}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                          title="Delete snapshot"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/40">
                      <span>{formatTime(snapshot.timestamp)}</span>
                      <span>{snapshot.nodes.length} nodes</span>
                      <span>{snapshot.edges.length} edges</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
