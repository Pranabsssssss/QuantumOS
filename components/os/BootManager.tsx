"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/osStore';
import { User, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export const BootManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bootStage, setBootStage, wallpaper, username } = useOSStore();
  
  // BIOS logs simulation
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (bootStage !== 'bios') return;

    const initialLogs = [
      "Quantum BIOS v1.0.4",
      "Copyright (C) 2026 Quantum Technologies",
      "",
      "Initializing system...",
      "Loading kernel...",
      "Checking hardware...",
      "Memory test: 640K OK",
      "",
      "Press DEL or F2 to enter setup"
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < initialLogs.length) {
        setLogs(prev => [...prev, initialLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    const autoBootTimer = setTimeout(() => {
      if (useOSStore.getState().bootStage === 'bios') {
        setBootStage('login');
      }
    }, 3000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'F2') {
        clearTimeout(autoBootTimer);
        setBootStage('setup');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      clearTimeout(autoBootTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [bootStage, setBootStage]);

  // Setup mode handling
  const handleBootFromSetup = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {}
    setBootStage('login');
  };

  const LoginScreen = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = (e?: React.FormEvent) => {
      e?.preventDefault();
      setIsLoggingIn(true);
      setTimeout(() => {
        setBootStage('desktop');
      }, 1200);
    };

    const isVideo = wallpaper.endsWith('.mp4') || wallpaper.endsWith('.webm');

    return (
      <motion.div
        key="login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
        className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Background Layer (Blurred Wallpaper) */}
        <div className="absolute inset-0 z-0">
          {isVideo ? (
            <video src={wallpaper} autoPlay loop muted className="w-full h-full object-cover blur-2xl scale-110 opacity-60" />
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center blur-2xl scale-110 opacity-60"
              style={{ backgroundImage: `url('${wallpaper}')` }}
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Login Panel */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center w-full max-w-sm"
        >
          {/* Avatar Area */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-32 h-32 rounded-full liquid-glass-strong flex items-center justify-center mb-8 border-white/20 shadow-glow"
          >
            <User size={64} className="text-white/80" />
          </motion.div>

          <h1 className="text-4xl font-light text-white mb-12 tracking-tight font-sora">
            {username}
          </h1>

          <form onSubmit={handleLogin} className="w-full px-8 flex flex-col gap-4">
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-xl px-5 py-3.5 text-white transition-all font-space flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <Loader2 size={18} className="animate-spin" /> : <>Login <ArrowRight size={18} /></>}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <div className="absolute bottom-12 inset-x-0 flex flex-col items-center gap-2 text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold">
           Quantum OS v2.0
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {bootStage === 'bios' && (
        <motion.div
          key="bios"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black text-white font-mono p-6 z-[99999] overflow-hidden flex flex-col"
        >
          {logs.map((log, i) => (
            <div key={i} className="text-sm md:text-base leading-relaxed">{log}</div>
          ))}
          <div className="w-2 h-4 bg-white animate-pulse mt-2" />
        </motion.div>
      )}

      {bootStage === 'setup' && (
        <motion.div
          key="setup"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-slate-900 text-slate-200 z-[99999] flex flex-col"
        >
          <div className="flex-1 max-w-4xl w-full mx-auto p-8 flex flex-col justify-center">
            <h1 className="text-4xl font-light mb-12 text-center text-blue-400">Quantum Settings Utility</h1>
            
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 grid grid-cols-2 gap-8 mb-12 backdrop-blur-md">
              <div>
                <h3 className="text-sm text-slate-400 uppercase tracking-widest mb-4">System Info</h3>
                <ul className="space-y-3 font-mono text-sm">
                  <li className="flex justify-between"><span>Processor:</span> <span>Quantum Neural Core 9</span></li>
                  <li className="flex justify-between"><span>Memory:</span> <span>128 TB Holographic RAM</span></li>
                  <li className="flex justify-between"><span>Storage:</span> <span>1 PB Quantum Drive</span></li>
                  <li className="flex justify-between"><span>Firmware:</span> <span>Q-EFI v4.0.1</span></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm text-slate-400 uppercase tracking-widest mb-4">Boot Options</h3>
                <ul className="space-y-3 font-mono text-sm">
                  <li className="flex justify-between"><span>Boot Option #1:</span> <span className="text-white">Quantum OS Manager</span></li>
                  <li className="flex justify-between"><span>Boot Option #2:</span> <span>Network Boot</span></li>
                  <li className="flex justify-between"><span>Secure Boot:</span> <span className="text-emerald-400">Enabled</span></li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <button 
                onClick={handleBootFromSetup}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-lg"
              >
                Save & Boot OS
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {bootStage === 'login' && <LoginScreen />}

      {bootStage === 'desktop' && (
        <motion.div
          key="desktop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
