"use client";

import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from './WidgetWrapper';
import { WidgetState } from '@/store/osStore';
import { motion } from 'framer-motion';

export const ClockWidget = ({ state }: { state: WidgetState }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderVariant = () => {
    switch (state.variant) {
      case 0: // Digital Minimal
        return (
          <div className="p-6 liquid-glass rounded-3xl min-w-[200px] flex flex-col items-center border-white/5">
            <span className="text-6xl font-extrabold tracking-tighter text-white font-sora">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
            <span className="text-sm font-medium text-accent/60 uppercase tracking-[0.2em] mt-2 font-space">
              {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        );

      case 1: // Analog Glass
        const seconds = time.getSeconds();
        const minutes = time.getMinutes();
        const hours = time.getHours();
        return (
          <div className="w-48 h-48 liquid-glass rounded-full relative border-white/10 flex items-center justify-center">
             <div className="absolute inset-2 border border-white/5 rounded-full" />
             {/* Hour Hand */}
             <motion.div 
               className="absolute w-1 h-12 bg-white/80 rounded-full origin-bottom"
               style={{ rotate: (hours % 12) * 30 + minutes * 0.5, bottom: '50%' }}
             />
             {/* Minute Hand */}
             <motion.div 
               className="absolute w-1 h-16 bg-white/40 rounded-full origin-bottom"
               style={{ rotate: minutes * 6, bottom: '50%' }}
             />
             {/* Second Hand */}
             <motion.div 
               className="absolute w-0.5 h-16 bg-accent rounded-full origin-bottom"
               style={{ rotate: seconds * 6, bottom: '50%' }}
             />
             <div className="w-2 h-2 bg-white rounded-full z-10" />
          </div>
        );

      case 2: // Futuristic Segmented
        return (
          <div className="p-8 liquid-glass-strong rounded-2xl border-accent/20 flex flex-col items-end">
            <div className="flex gap-4 font-orbitron">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-white text-glow">
                  {time.getHours().toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-accent/40 font-bold uppercase">Hours</span>
              </div>
              <span className="text-5xl font-black text-white/20">:</span>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-white text-glow">
                  {time.getMinutes().toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-accent/40 font-bold uppercase">Mins</span>
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-accent shadow-[0_0_10px_var(--accent-color)]"
                 animate={{ width: `${(time.getSeconds() / 60) * 100}%` }}
               />
            </div>
          </div>
        );
    }
  };

  return (
    <WidgetWrapper state={state}>
      {renderVariant()}
    </WidgetWrapper>
  );
};
