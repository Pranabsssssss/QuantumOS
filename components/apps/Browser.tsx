"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Home, Lock } from 'lucide-react';

export const Browser: React.FC<{ url?: string }> = ({ url: initialUrl = "https://quanti-search.vercel.app" }) => {
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = urlInput;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }
    setCurrentUrl(finalUrl);
    setUrlInput(finalUrl);
    setIsLoading(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Browser Toolbar */}
      <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center px-2 gap-2 text-gray-600">
        <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50">
          <ChevronLeft size={18} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50" disabled>
          <ChevronRight size={18} />
        </button>
        <button 
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
          onClick={() => setIsLoading(true)}
        >
          <RotateCw size={16} className={isLoading ? "animate-spin" : ""} />
        </button>
        <button 
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
          onClick={() => {
            setCurrentUrl(initialUrl);
            setUrlInput(initialUrl);
          }}
        >
          <Home size={16} />
        </button>

        <form onSubmit={handleNavigate} className="flex-1 flex items-center max-w-2xl mx-2">
          <div className="w-full relative flex items-center">
            <Lock size={12} className="absolute left-3 text-gray-400" />
            <input 
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-full py-1 pl-8 pr-4 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
            />
          </div>
        </form>
      </div>

      {/* Iframe View */}
      <div className="flex-1 relative bg-white">
        <iframe 
          src={currentUrl}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation"
        />
      </div>
    </div>
  );
};
