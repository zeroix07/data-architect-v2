import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  className?: string;
}

export default function CollapsibleSection({ title, children, defaultOpen = true, badge, className }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border border-white/5 rounded-lg overflow-hidden', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-white/40 font-bold tracking-widest">{title}</span>
          {badge && <span className="text-[9px] px-1.5 py-0.5 bg-brand/10 text-brand rounded font-mono">{badge}</span>}
        </div>
        <ChevronDown size={12} className={cn('text-white/30 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="px-3 py-3 space-y-3 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
}
