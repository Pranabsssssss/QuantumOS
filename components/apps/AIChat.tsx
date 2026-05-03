"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react';

export const AIChat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  return (
    <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
      {/* App Header/Toolbar */}
      <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent-color)]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Quantum Neural Link</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsLoading(true);
              setKey(k => k + 1);
            }}
            className="text-white/30 hover:text-white transition-colors"
            title="Refresh AI Link"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
          <a 
            href="https://ai.quantum.pranab.tech" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="flex-1 relative">
        <iframe
          key={key}
          src="https://ai.quantum.pranab.tech"
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />

        {isLoading && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-accent/10 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Initializing AI</span>
              <span className="text-[10px] text-white/30 animate-pulse">Establishing Secure Neural Handshake...</span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Footer */}
      <div className="h-6 bg-accent/5 flex items-center px-4 justify-between">
         <span className="text-[8px] text-accent/40 uppercase tracking-tighter italic">Quantum AI Core v4.2 // Encrypted Stream</span>
         <div className="flex gap-1">
            <div className="w-1 h-1 bg-accent/20 rounded-full" />
            <div className="w-1 h-1 bg-accent/20 rounded-full" />
            <div className="w-1 h-1 bg-accent/20 rounded-full" />
         </div>
      </div>
    </div>
  );
};
