import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DocsOverlay from '@/components/modals/DocsOverlay';

interface LoginLandingProps {
  onLogin: () => void;
}

export default function LoginLanding({ onLogin }: LoginLandingProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  return (
    <>
      <motion.div
        key="login-land"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-[#020617] flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="relative z-10 max-w-3xl">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-2xl shadow-brand/40">
              <div className="w-6 h-6 border-2 border-white rotate-45" />
            </div>
            <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.4em]">Ultimate Architect</h2>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-emerald-400">Data Engineering</span>
          </h1>

          <p className="text-lg text-white/40 mb-12 max-w-xl mx-auto leading-relaxed">
            Design, simulate, and deploy enterprise-grade data architectures with precision. Built for systems that never sleep.
          </p>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-8 py-4 bg-brand text-white font-bold text-sm tracking-widest uppercase rounded-full shadow-2xl shadow-brand/20 hover:scale-105 transition-all group active:scale-95"
            >
              Go to Workspace
            </button>
            <button
              onClick={() => setShowDocs(true)}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white/60 font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-all"
            >
              Documentation
            </button>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-12 text-left">
            <div>
              <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">Visual IDE</h4>
              <p className="text-xs text-white/30 leading-relaxed">Low-code canvas for cloud orchestration.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">IaC Generation</h4>
              <p className="text-xs text-white/30 leading-relaxed">Instant Terraform and K8s manifests.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">Edge-Ready</h4>
              <p className="text-xs text-white/30 leading-relaxed">First-class support for Edge AI and IoT.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <DocsOverlay isOpen={showDocs} onClose={() => setShowDocs(false)} />

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            key="login-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-surface-brighter border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest">Sign In</h3>
                <button onClick={() => setIsLoginModalOpen(false)} className="text-white/40 hover:text-white">&times;</button>
              </div>

              <p className="text-sm text-white/40 mb-8 leading-relaxed">
                Unlock enterprise features and cloud synchronization by signing in to your account.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    onLogin();
                    setIsLoginModalOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-4 py-3 bg-white text-[#020617] font-bold text-sm rounded-xl hover:bg-white/90 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
                <button className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-all">
                  Continue with SSO
                </button>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] text-white/20 uppercase font-black">Enterprise Access Only</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
