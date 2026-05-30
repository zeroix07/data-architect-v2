import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Trash2, ShieldAlert, Activity, Globe, Box } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const BoundaryNode = ({ id, data, selected }: NodeProps) => {
  const isFailoverActive = data.isFailoverActive;
  const label = data.label || 'Zone';
  const role = data.role || 'none'; // 'none' | 'primary' | 'dr'

  // Determine role based on selected role setting or label name matches
  const isPrimary = role === 'primary' || label.toLowerCase().includes('primary');
  const isDR = role === 'dr' || label.toLowerCase().includes('dr') || label.toLowerCase().includes('disaster') || label.toLowerCase().includes('recovery');

  // Style change based on failover state
  const showDegraded = isFailoverActive && isPrimary;
  const showDRActive = isFailoverActive && isDR;

  const IconComponent = data.templateId === 'vpc-zone' ? Box : Globe;

  return (
    <div
      style={{ width: data.width || 460, height: data.height || 320 }}
      className={cn(
        'rounded-xl border-2 border-dashed bg-transparent p-4 flex flex-col transition-all duration-700 relative group/boundary min-h-[180px]',
        selected ? 'border-brand bg-white/[0.02] shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-brand/50' : 'border-white/20 bg-white/[0.005]',
        showDegraded && 'border-red-500/50 bg-red-950/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.15)] opacity-40',
        showDRActive && 'border-amber-500/80 bg-amber-500/[0.05] shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-2 ring-amber-500/20',
        !showDegraded && !showDRActive && 'hover:border-white/40'
      )}
    >
      <Handle type="target" position={Position.Left} className="!left-[-4px] !w-2 !h-2 !border-0 !bg-brand/60" />
      <Handle type="source" position={Position.Right} className="!right-[-4px] !w-2 !h-2 !border-0 !bg-brand/60" />

      {/* Editable Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 flex-1">
          <div className={cn(
            "p-1 rounded bg-white/5",
            showDegraded ? "text-red-400" : showDRActive ? "text-amber-400" : "text-white/60"
          )}>
            <IconComponent size={12} />
          </div>
          <input
            type="text"
            value={label}
            onChange={(e) => data.onChangeLabel?.(id, e.target.value)}
            className={cn(
              "bg-transparent border-none text-[11px] font-bold uppercase tracking-wider text-white/90 focus:outline-none focus:ring-1 focus:ring-brand/30 rounded px-1.5 py-0.5 w-[150px] sm:w-[180px]",
              showDegraded && "text-red-400 font-extrabold",
              showDRActive && "text-amber-400 font-extrabold"
            )}
            title="Edit zone label directly"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Badge overlays */}
          {isPrimary && (
            <span className={cn(
              "text-[8px] px-1.5 py-0.5 rounded font-mono font-bold tracking-widest uppercase shrink-0",
              showDegraded ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            )}>
              {showDegraded ? "DEGRADED" : "PRIMARY"}
            </span>
          )}
          {isDR && (
            <span className={cn(
              "text-[8px] px-1.5 py-0.5 rounded font-mono font-bold tracking-widest uppercase shrink-0",
              showDRActive ? "bg-amber-500 text-black animate-pulse font-black" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
            )}>
              {showDRActive ? "STANDBY-ACTIVE" : "DR STANDBY"}
            </span>
          )}
        </div>

        {/* Delete action overlay */}
        <button
          title="Delete Zone Box"
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.(id);
          }}
          className="p-1.5 rounded hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all shrink-0"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Internal Grid visualization for boundaries */}
      <div className="flex-1 rounded border border-white/[0.02] bg-white/[0.005] pointer-events-none relative flex flex-col justify-end p-2.5">
        <div className="flex justify-between items-center text-[7px] tracking-widest text-white/20 font-mono z-10 uppercase">
          <div>Boundary: {data.templateId === 'vpc-zone' ? 'VPC virtual boundary' : 'Georegion boundary box'}</div>
          {showDegraded && <div className="text-red-500 font-bold flex items-center gap-1 animate-pulse"><ShieldAlert size={10} /> FAILURE</div>}
          {showDRActive && <div className="text-amber-500 font-bold flex items-center gap-1"><Activity size={10} className="animate-pulse" /> RECOVERY OK</div>}
        </div>
      </div>
    </div>
  );
};

export default memo(BoundaryNode);
