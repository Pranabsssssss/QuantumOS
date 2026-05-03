"use client";

import React, { useState } from 'react';
import { Loader2, RefreshCw, Cloud, HardDrive, ShieldCheck } from 'lucide-react';

export const Cloudrive = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* App Header/Toolbar */}
      <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Cloud size={14} className="text-blue-400" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Cloudrive Quantum</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
             <ShieldCheck size={10} className="text-blue-400" />
             <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Secure Link</span>
          </div>
          <button 
            onClick={() => {
              setIsLoading(true);
              setKey(k => k + 1);
            }}
            className="text-white/30 hover:text-white transition-colors"
            title="Refresh Storage"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <iframe
          key={key}
          src="https://Cloudrive.pranab.tech"
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />

        {isLoading && (
          <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <HardDrive size={24} className="text-blue-500/40 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Mounting Cloudrive</span>
              <span className="text-[10px] text-white/30">Synchronizing quantum data shards...</span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Footer */}
      <div className="h-6 bg-black/40 flex items-center px-4 justify-between border-t border-white/5">
         <span className="text-[8px] text-white/20 uppercase tracking-widest italic">Encrypted // Secure Storage Active</span>
         <div className="flex items-center gap-4">
            <div className="flex gap-2 text-[8px] text-white/20">
               <span>Usage: 12.4 TB / 100 TB</span>
            </div>
         </div>
      </div>
    </div>
  );
};
