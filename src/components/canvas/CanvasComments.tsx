import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  color: string;
  timestamp: string;
}

interface CanvasCommentsProps {
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onDeleteComment: (id: string) => void;
  onUpdateComment: (id: string, text: string) => void;
  canvasRef: React.RefObject<HTMLElement | null>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function CanvasComments({ comments, onAddComment, onDeleteComment, onUpdateComment, canvasRef }: CanvasCommentsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!isAdding || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    onAddComment({ x, y, text: 'New comment', author: 'You', color });
    setIsAdding(false);
  }, [isAdding, canvasRef, onAddComment]);

  return (
    <>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute z-40 group"
          style={{ left: comment.x, top: comment.y }}
        >
          <div className="relative">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              style={{ backgroundColor: comment.color }}
              onClick={() => { setEditingId(comment.id); setEditText(comment.text); }}
            >
              <MessageSquare size={12} className="text-white" />
            </div>

            <AnimatePresence>
              {editingId === comment.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-8 left-0 w-56 bg-surface-brighter border border-white/10 rounded-lg shadow-2xl p-3 z-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/40 font-bold">{comment.author}</span>
                    <button onClick={() => onDeleteComment(comment.id)} className="text-white/20 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-surface-card border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand/50 resize-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { onUpdateComment(comment.id, editText); setEditingId(null); }}
                      className="flex-1 py-1 bg-brand text-white text-[10px] font-bold rounded hover:bg-brand/80"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-1 bg-white/5 text-white/60 text-[10px] font-bold rounded hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </>
  );
}
