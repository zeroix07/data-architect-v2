import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Node } from 'reactflow';

interface NodeSearchProps {
  nodes: Node[];
  onSelectNode: (node: Node) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function NodeSearch({ nodes, onSelectNode, isOpen, onClose }: NodeSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = query.length > 0
    ? nodes.filter((n) =>
        n.type === 'architectureNode' &&
        (n.data.label?.toLowerCase().includes(query.toLowerCase()) ||
         n.data.templateId?.toLowerCase().includes(query.toLowerCase()) ||
         n.data.type?.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelect = useCallback((node: Node) => {
    onSelectNode(node);
    onClose();
  }, [onSelectNode, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-80 bg-surface-brighter border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <Search size={14} className="text-white/40" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nodes..."
              className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder:text-white/30"
            />
            <button onClick={onClose} className="text-white/30 hover:text-white">
              <X size={14} />
            </button>
          </div>

          {filtered.length > 0 && (
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {filtered.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleSelect(node)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    node.data.type === 'cloud' ? 'bg-blue-500' :
                    node.data.type === 'on-premise' ? 'bg-yellow-500' : 'bg-cyan-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-white font-medium truncate">{node.data.label}</div>
                    <div className="text-[9px] text-white/40">{node.data.templateId}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length > 0 && filtered.length === 0 && (
            <div className="px-3 py-4 text-center text-[10px] text-white/30">No nodes found</div>
          )}

          {query.length === 0 && (
            <div className="px-3 py-4 text-center text-[10px] text-white/30">Type to search nodes</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
