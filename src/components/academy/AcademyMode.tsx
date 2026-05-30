import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Trophy, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademyModeProps {
  isActive: boolean;
}

export default function AcademyMode({ isActive }: AcademyModeProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed bottom-32 right-6 z-[200] w-64 bg-[#fbbf24]/5 backdrop-blur-xl border border-[#fbbf24]/30 rounded-xl shadow-2xl p-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 -mr-10 -mt-10 opacity-10 pointer-events-none">
            <Trophy size={80} className="text-[#fbbf24]" />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center text-[#fbbf24]">
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Academy Quest</h3>
              <p className="text-[9px] text-[#fbbf24] font-bold uppercase tracking-wider">Level 1: Edge Sync</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">Module Progress</span>
                <span className="text-[#fbbf24] font-bold">2 / 3</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '66%' }} className="h-full bg-[#fbbf24]" />
              </div>
            </div>

            <div className="space-y-2">
              {[
                { task: 'Connect Edge Vision to GCP', done: true },
                { task: 'Deploy local cache node', done: true },
                { task: 'Enable end-to-end security', done: false },
              ].map((item) => (
                <div key={item.task} className="flex items-center gap-2">
                  <div className={cn('w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors', item.done ? 'bg-[#fbbf24] border-[#fbbf24] text-black' : 'border-white/20 text-transparent')}>
                    <CheckCircle2 size={10} strokeWidth={4} />
                  </div>
                  <span className={cn('text-[10px] tracking-tight transition-colors', item.done ? 'text-white/60 line-through' : 'text-white')}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-2 py-2 bg-[#fbbf24] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#fbbf24]/20">
              Claim Rewards
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
