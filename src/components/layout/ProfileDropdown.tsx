import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, LogOut, Moon, Sun, Bell, Shield, Palette, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileDropdownProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function ProfileDropdown({ theme, onToggleTheme }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-emerald-500 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-white font-bold leading-none">Architect</div>
          </div>
          <ChevronDown size={10} className={cn('text-white/30 transition-transform', isOpen && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-56 bg-surface-brighter border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              {/* Profile Header */}
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-emerald-500 flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white font-bold">Architect User</div>
                    <div className="text-[10px] text-white/40">Open Source Platform</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-1.5">
                <button
                  onClick={() => { setShowSettings(true); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <Settings size={14} className="text-white/40" />
                  <span className="text-xs text-white/80">Settings</span>
                </button>

                <button
                  onClick={onToggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  {theme === 'dark' ? <Sun size={14} className="text-white/40" /> : <Moon size={14} className="text-white/40" />}
                  <span className="text-xs text-white/80">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                  <Bell size={14} className="text-white/40" />
                  <span className="text-xs text-white/80">Notifications</span>
                  <span className="ml-auto text-[8px] px-1.5 py-0.5 bg-brand/20 text-brand rounded-full font-bold">3</span>
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                  <Shield size={14} className="text-white/40" />
                  <span className="text-xs text-white/80">Privacy & Security</span>
                </button>
              </div>

              <div className="p-1.5 border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-left">
                  <LogOut size={14} className="text-red-400/60" />
                  <span className="text-xs text-red-400/80">Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface-brighter border border-white/10 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Settings size={18} className="text-brand" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Settings</h2>
                </div>
                <button onClick={() => setShowSettings(false)} className="text-white/30 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar max-h-[60vh]">
                {/* Profile Section */}
                <div>
                  <h3 className="text-[10px] uppercase text-white/40 font-bold tracking-widest mb-3">Profile</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-white/60 mb-1 block">Display Name</label>
                      <input defaultValue="Architect User" className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50" />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/60 mb-1 block">Email</label>
                      <input defaultValue="architect@example.com" className="w-full bg-surface-card border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand/50" />
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div>
                  <h3 className="text-[10px] uppercase text-white/40 font-bold tracking-widest mb-3">Appearance</h3>
                  <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Palette size={14} className="text-white/40" />
                      <div>
                        <div className="text-xs text-white">Theme</div>
                        <div className="text-[10px] text-white/40">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</div>
                      </div>
                    </div>
                    <button
                      onClick={onToggleTheme}
                      className={cn('w-10 h-5 rounded-full p-0.5 transition-all', theme === 'dark' ? 'bg-brand' : 'bg-amber-500')}
                    >
                      <motion.div animate={{ x: theme === 'dark' ? 0 : 18 }} className="w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="text-[10px] uppercase text-white/40 font-bold tracking-widest mb-3">Notifications</h3>
                  <div className="space-y-2">
                    {['Architecture updates', 'Validation alerts', 'Compliance warnings'].map((item) => (
                      <label key={item} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg cursor-pointer">
                        <span className="text-xs text-white/80">{item}</span>
                        <input type="checkbox" defaultChecked className="accent-brand" />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div>
                  <h3 className="text-[10px] uppercase text-white/40 font-bold tracking-widest mb-3">Keyboard Shortcuts</h3>
                  <div className="space-y-1.5">
                    {[
                      { key: 'Ctrl + Z', action: 'Undo' },
                      { key: 'Ctrl + Shift + Z', action: 'Redo' },
                      { key: 'Ctrl + O', action: 'Open templates' },
                      { key: 'Ctrl + F', action: 'Search nodes' },
                      { key: 'Ctrl + [', action: 'Toggle left sidebar' },
                      { key: 'Ctrl + ]', action: 'Toggle right sidebar' },
                      { key: '?', action: 'Show shortcuts' },
                    ].map((s) => (
                      <div key={s.key} className="flex items-center justify-between px-3 py-2 bg-white/[0.02] rounded">
                        <span className="text-[10px] text-white/60">{s.action}</span>
                        <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-white/80 font-mono">{s.key}</kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/5 flex justify-end gap-2">
                <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-white/5 text-white/60 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white/10">
                  Cancel
                </button>
                <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-brand/80">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
