"use client";

import React, { useState } from 'react';
import { RefreshCcw, ExternalLink } from 'lucide-react';

export const Arcade: React.FC<{ url?: string }> = ({ url = "https://ellisonleao.github.io/clumsy-bird/" }) => {
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  const handleRetry = () => {
    setHasError(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className="w-full h-full bg-[#faf8ef] flex flex-col relative group">
      {/* External Link Hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 hover:bg-black/60 transition-colors border border-black/10"
        >
          <span>Open App Externally</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {hasError ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] text-white">
          <p className="mb-4 text-lg font-medium text-white/80">Game failed to load</p>
          <button 
            onClick={handleRetry}
            className="flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-lg hover:bg-accent hover:text-black transition-colors border border-accent/30"
          >
            <RefreshCcw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : (
        <iframe 
          key={key}
          src={url}
          className="w-full flex-1 border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-storage-access-by-user-activation"
          allow="autoplay; fullscreen"
          onError={() => setHasError(true)}
          // Using onLoad doesn't guarantee lack of X-Frame-Options block, but standard onError handles basic network failures.
        />
      )}
    </div>
  );
};
