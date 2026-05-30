import { useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSidebarProps {
  side: 'left' | 'right';
  width: number;
  onResize: (width: number) => void;
  collapsedWidth?: number;
  isCollapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
  collapsedContent?: ReactNode;
}

export default function CollapsibleSidebar({
  side,
  width,
  onResize,
  collapsedWidth = 0,
  isCollapsed,
  onToggle,
  children,
  className,
  collapsedContent,
}: CollapsibleSidebarProps) {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const currentWidth = isCollapsed ? collapsedWidth : width;

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  }, [width]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = side === 'left'
        ? e.clientX - startXRef.current
        : startXRef.current - e.clientX;

      const newWidth = Math.max(50, startWidthRef.current + delta);
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, side, onResize]);

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = width * 0.25;
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      if (side === 'left') {
        if (offset < -threshold || velocity < -500) {
          if (!isCollapsed) onToggle();
        } else if (offset > threshold || velocity > 500) {
          if (isCollapsed) onToggle();
        }
      } else {
        if (offset > threshold || velocity > 500) {
          if (!isCollapsed) onToggle();
        } else if (offset < -threshold || velocity < -500) {
          if (isCollapsed) onToggle();
        }
      }

      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    },
    [side, isCollapsed, onToggle, width, x]
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative shrink-0 overflow-hidden transition-none', className)}
      style={{ width: currentWidth }}
    >
      <motion.div
        className={cn(
          'h-full w-full flex flex-col border-white/10 bg-surface-brighter',
          side === 'left' ? 'border-r' : 'border-l'
        )}
        style={{ x }}
        drag={isResizing ? false : 'x'}
        dragConstraints={{ left: side === 'right' ? -80 : 0, right: side === 'left' ? 80 : 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 z-30 w-6 h-12 flex items-center justify-center',
            'bg-surface-brighter border border-white/10 rounded-md shadow-lg',
            'text-white/40 hover:text-white hover:bg-white/5 transition-all',
            side === 'left' ? '-right-3 rounded-l-none' : '-left-3 rounded-r-none'
          )}
          title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {side === 'left' ? (
            isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />
          ) : (
            isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />
          )}
        </button>

        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            onMouseDown={handleResizeStart}
            className={cn(
              'absolute top-0 bottom-0 z-20 cursor-col-resize',
              'hover:bg-brand/20 transition-colors',
              isResizing && 'bg-brand/30',
              side === 'left' ? '-right-1 w-2' : '-left-1 w-2'
            )}
            title="Drag to resize"
          >
            <div className={cn(
              'absolute top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full transition-colors',
              isResizing ? 'bg-brand' : 'bg-white/10',
              side === 'left' ? 'right-0' : 'left-0'
            )} />
          </div>
        )}

        {/* Content */}
        {!isCollapsed && children}

        {/* Collapsed Content (optional) */}
        {isCollapsed && collapsedContent}
      </motion.div>
    </div>
  );
}
