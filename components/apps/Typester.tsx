"use client";

import React, { useState } from 'react';
import { Loader2, RefreshCw, Keyboard, Trophy } from 'lucide-react';

export const Typester = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  return (
    <div className="w-full h-full bg-[#111] flex flex-col relative overflow-hidden">
      {/* App Header/Toolbar */}
      <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Keyboard size={14} className="text-accent" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Typester Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
             <Trophy size={10} className="text-accent" />
             <span className="text-[9px] font-bold text-accent uppercase tracking-tighter">Live Session</span>
          </div>
          <button 
            onClick={() => {
              setIsLoading(true);
              setKey(k => k + 1);
            }}
            className="text-white/30 hover:text-white transition-colors"
            title="Restart Session"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <iframe
          key={key}
          src="https://typetest.pranab.tech"
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />

        {isLoading && (
          <div className="absolute inset-0 bg-[#111] flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Keyboard size={24} className="text-accent/40 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Loading Typester</span>
              <span className="text-[10px] text-white/30">Calibrating mechanical switches...</span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Footer */}
      <div className="h-6 bg-black/40 flex items-center px-4 justify-between border-t border-white/5">
         <span className="text-[8px] text-white/20 uppercase tracking-widest">Powered by Quantum Typing Engine</span>
         <div className="flex items-center gap-4">
            <div className="flex gap-2 text-[8px] text-white/20">
               <span>WPM: --</span>
               <span>ACC: --%</span>
            </div>
         </div>
      </div>
    </div>
  );
};
