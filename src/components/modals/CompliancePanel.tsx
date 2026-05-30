import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertTriangle, ShieldAlert, Info, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComplianceIssue } from '@/lib/compliance';
import { getComplianceStats } from '@/lib/compliance';

interface CompliancePanelProps {
  isOpen: boolean;
  onClose: () => void;
  issues: ComplianceIssue[];
  onHighlightNode: (nodeId: string) => void;
}

export default function CompliancePanel({ isOpen, onClose, issues, onHighlightNode }: CompliancePanelProps) {
  const stats = getComplianceStats(issues);

  const severityIcon = (s: string) => {
    if (s === 'error') return <ShieldAlert size={12} className="text-red-400" />;
    if (s === 'warning') return <AlertTriangle size={12} className="text-amber-400" />;
    return <Info size={12} className="text-blue-400" />;
  };

  const severityBg = (s: string) => {
    if (s === 'error') return 'bg-red-500/5 border-red-500/20';
    if (s === 'warning') return 'bg-amber-500/5 border-amber-500/20';
    return 'bg-blue-500/5 border-blue-500/20';
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
            className="fixed right-0 top-0 bottom-0 w-[420px] z-[160] bg-surface-brighter border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
                  <Shield size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Compliance Check</h3>
                  <p className="text-[10px] text-white/40">{stats.total} issues found</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-3 p-4 border-b border-white/5">
              {stats.errors > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <ShieldAlert size={12} className="text-red-400" />
                  <span className="text-[10px] text-red-400 font-bold">{stats.errors} Errors</span>
                </div>
              )}
              {stats.warnings > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <AlertTriangle size={12} className="text-amber-400" />
                  <span className="text-[10px] text-amber-400 font-bold">{stats.warnings} Warnings</span>
                </div>
              )}
              {stats.info > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Info size={12} className="text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-bold">{stats.info} Info</span>
                </div>
              )}
              {stats.total === 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <Shield size={12} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-bold">All Clear</span>
                </div>
              )}
            </div>

            {/* Issues list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              {issues.map((issue, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer hover:brightness-110 transition-all',
                    severityBg(issue.severity)
                  )}
                  onClick={() => issue.nodeId && onHighlightNode(issue.nodeId)}
                >
                  <div className="flex items-start gap-2">
                    {severityIcon(issue.severity)}
                    <div className="flex-1">
                      <div className="text-xs text-white font-medium mb-0.5">{issue.message}</div>
                      {issue.suggestion && (
                        <div className="text-[10px] text-white/40 italic">{issue.suggestion}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
