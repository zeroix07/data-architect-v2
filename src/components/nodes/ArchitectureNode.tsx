import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Trash2, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NODE_TEMPLATES } from '@/constants/nodes';

const ArchitectureNode = ({ id, data, selected }: NodeProps) => {
  const template = NODE_TEMPLATES.find((t) => t.id === data.templateId);
  const Icon = template?.icon || Box;
  const isDisabled = data.isDisabled;
  const isInsidePrimary = data.isInsidePrimary;
  const isInsideDR = data.isInsideDR;
  const isFailoverActive = data.isFailoverActive;

  const showFailoverPrimaryDegraded = isFailoverActive && isInsidePrimary;
  const showFailoverDRAssumed = isFailoverActive && isInsideDR;

  return (
    <div
      className={cn(
        'px-4 py-3 rounded border bg-[#141A26] flex flex-col min-w-[176px] transition-all duration-500 shadow-2xl relative group/node',
        selected ? 'border-brand ring-1 ring-brand/50' : 'border-white/10',
        isDisabled && 'grayscale opacity-50 contrast-75',
        !isDisabled && data.type === 'cloud' && 'border-l-4 border-l-orange-500',
        !isDisabled && data.type === 'on-premise' && 'border-l-4 border-l-yellow-500',
        !isDisabled && data.type === 'open-source' && 'border-l-4 border-l-cyan-500',
        isDisabled && 'border-l-4 border-l-gray-600',
        showFailoverPrimaryDegraded && 'grayscale opacity-30 border-red-500/30 text-red-100/40 shadow-none scale-95 duration-500',
        showFailoverDRAssumed && 'border-amber-500/80 bg-[#1e1c14] shadow-[0_0_20px_rgba(245,158,11,0.2)] duration-500 ring-1 ring-amber-500/30'
      )}
    >
      <Handle type="target" position={Position.Left} className="!left-[-4px] !w-3 !h-3 !border-0 !bg-brand shadow-[0_0_8px_rgba(59,130,246,0.5)]" />

      <div className="flex justify-between items-start">
        <div className="text-[10px] uppercase text-white/40 mb-1 font-bold tracking-widest">{data.type} {isDisabled && '(Inactive)'}</div>
        <div className="flex items-center gap-1 opacity-0 group-hover/node:opacity-100 transition-all -mr-1 -mt-1">
          <button
            title={isDisabled ? 'Activate Node' : 'Deactivate Node'}
            onClick={(e) => { e.stopPropagation(); data.onToggleActive?.(id); }}
            className={cn('p-1 rounded hover:bg-white/10 transition-all', isDisabled ? 'text-emerald-500' : 'text-amber-500')}
          >
            <Power size={12} />
          </button>
          <button
            title="Delete Node"
            onClick={(e) => { e.stopPropagation(); data.onDelete?.(id); }}
            className="p-1 rounded hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="text-xs font-bold text-white tracking-wide flex items-center justify-between">
        <span>{data.label}</span>
        {showFailoverPrimaryDegraded && <span className="text-[7px] text-red-500 font-mono tracking-widest uppercase ml-1 animate-pulse shrink-0">OFFLINE</span>}
        {showFailoverDRAssumed && <span className="text-[7px] text-amber-500 font-mono tracking-widest uppercase ml-1 animate-pulse shrink-0 font-black">FAILOVER ACTIVE</span>}
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className={cn(
          'p-1.5 rounded bg-white/5',
          data.type === 'cloud' ? 'text-orange-500' : data.type === 'on-premise' ? 'text-yellow-500' : 'text-cyan-500'
        )}>
          <Icon size={14} />
        </div>
        <div className="flex gap-1">
          <div className={cn('w-1.5 h-1.5 rounded-full', isDisabled ? 'bg-gray-600' : 'bg-brand')} />
          {data.type !== 'cloud' && <div className={cn('w-1.5 h-1.5 rounded-full', isDisabled ? 'bg-gray-700' : 'bg-slate-500')} />}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!right-[-4px] !w-3 !h-3 !border-0 !bg-brand shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
    </div>
  );
};

export default memo(ArchitectureNode);
