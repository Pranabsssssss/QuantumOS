"use client";

import React, { useState, useEffect } from 'react';
import { Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FullscreenGate = ({ children }: { children: React.ReactNode }) => {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    checkFullscreen();
    
    document.addEventListener('fullscreenchange', checkFullscreen);
    return () => document.removeEventListener('fullscreenchange', checkFullscreen);
  }, []);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.error("Failed to enter fullscreen:", e);
    }
  };

  if (!mounted) return <>{children}</>;

  return (
    <>
      {/* OS content pointer events should be disabled when not in fullscreen */}
      <div className={isFullscreen ? "" : "pointer-events-none select-none blur-sm transition-all duration-500"}>
        {children}
      </div>

      <AnimatePresence>
        {!isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl text-white"
          >
            <div className="flex flex-col items-center max-w-md text-center p-8 liquid-glass-strong rounded-3xl border border-white/10 shadow-2xl">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6 shadow-[0_0_30px_rgba(var(--accent-color),0.3)]">
                <Maximize size={32} />
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Immersive Experience Required</h2>
              <p className="text-white/60 mb-8 leading-relaxed text-sm">
                Quantum OS is designed as a fully immersive Web Operating System. Please enter fullscreen mode to continue interacting with the environment.
              </p>
              
              <button 
                onClick={requestFullscreen}
                className="bg-accent text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(var(--accent-color),0.4)] hover:shadow-[0_0_30px_rgba(var(--accent-color),0.6)] hover:scale-105 active:scale-95"
              >
                <Maximize size={18} />
                Enter Fullscreen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
