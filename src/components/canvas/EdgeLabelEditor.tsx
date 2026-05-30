import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, X } from 'lucide-react';

interface EdgeLabelEditorProps {
  edgeId: string;
  currentLabel: string;
  onUpdateLabel: (edgeId: string, label: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const PRESET_LABELS = [
  'HTTPS', 'gRPC', 'REST API', 'GraphQL',
  'Pub/Sub', 'Kafka', 'WebSocket',
  'VPN', 'VPC Peering', 'Private Link',
  'ETL', 'CDC', 'Stream', 'Batch',
  'Read', 'Write', 'Read/Write',
];

export default function EdgeLabelEditor({ edgeId, currentLabel, onUpdateLabel, onClose, position }: EdgeLabelEditorProps) {
  const [label, setLabel] = useState(currentLabel);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-50 bg-surface-brighter border border-white/10 rounded-lg shadow-2xl p-3 w-56"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Tag size={12} className="text-brand" />
          <span className="text-[10px] text-white font-bold uppercase tracking-wider">Connection Label</span>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white">
          <X size={12} />
        </button>
      </div>

      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Enter label..."
        className="w-full bg-surface-card border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand/50 mb-2"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') { onUpdateLabel(edgeId, label); onClose(); }
          if (e.key === 'Escape') onClose();
        }}
      />

      <div className="flex flex-wrap gap-1 mb-2">
        {PRESET_LABELS.map((preset) => (
          <button
            key={preset}
            onClick={() => { setLabel(preset); onUpdateLabel(edgeId, preset); onClose(); }}
            className="px-1.5 py-0.5 bg-white/5 hover:bg-brand/10 text-[9px] text-white/50 hover:text-brand rounded transition-colors"
          >
            {preset}
          </button>
        ))}
      </div>

      <button
        onClick={() => { onUpdateLabel(edgeId, label); onClose(); }}
        className="w-full py-1.5 bg-brand text-white text-[10px] font-bold uppercase rounded hover:bg-brand/80 transition-all"
      >
        Apply
      </button>
    </motion.div>
  );
}
