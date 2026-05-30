import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PanelLeft, PanelRight } from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import ProfileDropdown from '@/components/layout/ProfileDropdown';

interface HeaderProps {
  isSimulationMode: boolean;
  setIsSimulationMode: (v: boolean) => void;
  isFailoverActive: boolean;
  setIsFailoverActive: (v: boolean) => void;
  connectionType: 'default' | 'replication';
  setConnectionType: (v: 'default' | 'replication') => void;
  nodesCount: number;
  onOpenWelcome: () => void;
  onShowToR: () => void;
  onSave: () => void;
  onValidate: () => void;
  isValidating: boolean;
  estimatedCost: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Header({
  isSimulationMode,
  setIsSimulationMode,
  isFailoverActive,
  setIsFailoverActive,
  connectionType,
  setConnectionType,
  nodesCount,
  onOpenWelcome,
  onShowToR,
  onSave,
  onValidate,
  isValidating,
  estimatedCost,
  leftCollapsed,
  rightCollapsed,
  onToggleLeft,
  onToggleRight,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [projectName, setProjectName] = useState('Untitled Architecture');
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);

  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-surface-brighter z-10 shrink-0">
      <div className="flex items-center gap-2">
        <Tooltip content={leftCollapsed ? 'Expand components (Ctrl+[)' : 'Collapse components (Ctrl+[)'}>
          <button
            onClick={onToggleLeft}
            className={cn(
              'w-8 h-8 rounded flex items-center justify-center transition-all',
              leftCollapsed ? 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10' : 'bg-brand/10 text-brand hover:bg-brand/20'
            )}
          >
            <PanelLeft size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Ultimate Architect v2.4.0">
          <div className="relative group">
            <div className="w-8 h-8 rounded flex items-center justify-center transition-all bg-brand shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <div className="absolute top-0 right-0 -mr-1 -mt-1 w-3 h-3 bg-red-500 rounded-full border-2 border-surface-brighter" />
          </div>
        </Tooltip>

        <div className="flex flex-col">
          <h1 className="font-bold tracking-tight text-white uppercase text-sm leading-none mb-1">
            Ultimate <span className="font-medium text-brand">Architect</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-white/40 font-black uppercase tracking-widest">v2.4.0</div>
            <div className="h-2 w-px bg-white/10" />
            {isEditingProjectName ? (
              <input
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingProjectName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingProjectName(false)}
                className="bg-brand/10 text-[10px] text-white font-bold uppercase tracking-widest focus:outline-none border-b border-brand w-32"
              />
            ) : (
              <Tooltip content="Click to rename project">
                <button
                  onClick={() => setIsEditingProjectName(true)}
                  className="text-[10px] text-white/60 font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  {projectName}
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Open template chooser (Ctrl+O)">
          <button
            onClick={onOpenWelcome}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-brand/10 text-[#fbbf24] hover:text-white border border-[#fbbf24]/30 hover:border-brand/45 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            Open
          </button>
        </Tooltip>

        <Tooltip content="Save project as .darch file">
          <button onClick={onSave} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
            Save
          </button>
        </Tooltip>

        <Tooltip content="Generate Technical Specification document">
          <button onClick={onShowToR} className="flex items-center gap-2 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand border border-brand/30 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
            ToR
          </button>
        </Tooltip>

        <Tooltip content="Validate architecture for issues">
          <button
            onClick={onValidate}
            disabled={isValidating}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 bg-brand text-white text-xs font-semibold shadow-lg shadow-brand/20 rounded-md transition-all active:scale-95 disabled:opacity-50',
              isValidating && 'animate-pulse'
            )}
          >
            Validate
          </button>
        </Tooltip>

        <div className="h-6 w-px bg-white/10" />

        <Tooltip content={rightCollapsed ? 'Expand inspector (Ctrl+])' : 'Collapse inspector (Ctrl+])'}>
          <button
            onClick={onToggleRight}
            className={cn(
              'w-8 h-8 rounded flex items-center justify-center transition-all',
              rightCollapsed ? 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10' : 'bg-brand/10 text-brand hover:bg-brand/20'
            )}
          >
            <PanelRight size={16} />
          </button>
        </Tooltip>

        <div className="h-6 w-px bg-white/10" />

        <ProfileDropdown theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  );
}
