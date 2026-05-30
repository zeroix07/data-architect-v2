import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'Z'], action: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo' },
  { keys: ['Ctrl', 'O'], action: 'Open templates' },
  { keys: ['Ctrl', '['], action: 'Toggle left sidebar' },
  { keys: ['Ctrl', ']'], action: 'Toggle right sidebar' },
  { keys: ['Ctrl', 'F'], action: 'Search nodes' },
  { keys: ['Delete'], action: 'Delete selected node' },
  { keys: ['?'], action: 'Show shortcuts' },
];

export default function ShortcutsOverlay({ isOpen, onClose }: ShortcutsOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-surface-brighter border border-white/10 rounded-xl shadow-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Keyboard Shortcuts</h2>
              <button onClick={onClose} className="text-white/30 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((s) => (
                <div key={s.action} className="flex items-center justify-between">
                  <span className="text-xs text-white/60">{s.action}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((key, i) => (
                      <span key={i}>
                        <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/80 font-mono">{key}</kbd>
                        {i < s.keys.length - 1 && <span className="text-white/20 mx-0.5">+</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
