"use client";

import React from 'react';

// Premium, high-fidelity, multi-colored SVG Icons for Quantum OS

export const BrowserIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="browser-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00c6ff" />
        <stop offset="100%" stopColor="#0072ff" />
      </linearGradient>
      <linearGradient id="browser-shine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#browser-bg)" />
    <circle cx="50" cy="50" r="45" fill="url(#browser-shine)" />
    <ellipse cx="50" cy="50" rx="20" ry="45" stroke="#ffffff" strokeWidth="4" strokeOpacity="0.8" fill="none" />
    <path d="M5 50H95" stroke="#ffffff" strokeWidth="4" strokeOpacity="0.8" strokeLinecap="round" />
    <path d="M15 25H85M15 75H85" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
  </svg>
);

export const CalculatorIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="calc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2c3e50" />
        <stop offset="100%" stopColor="#0f171e" />
      </linearGradient>
      <linearGradient id="calc-screen" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7f8c8d" />
        <stop offset="100%" stopColor="#bdc3c7" />
      </linearGradient>
      <linearGradient id="calc-accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff9a44" />
        <stop offset="100%" stopColor="#fc6076" />
      </linearGradient>
    </defs>
    <rect x="15" y="5" width="70" height="90" rx="15" fill="url(#calc-bg)" stroke="#34495e" strokeWidth="2"/>
    <rect x="25" y="15" width="50" height="20" rx="5" fill="url(#calc-screen)" />
    <circle cx="35" cy="50" r="6" fill="#ecf0f1" />
    <circle cx="50" cy="50" r="6" fill="#ecf0f1" />
    <circle cx="65" cy="50" r="6" fill="url(#calc-accent)" />
    <circle cx="35" cy="70" r="6" fill="#ecf0f1" />
    <circle cx="50" cy="70" r="6" fill="#ecf0f1" />
    <rect x="59" y="64" width="12" height="12" rx="6" fill="url(#calc-accent)" />
  </svg>
);

export const CameraIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="cam-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e0eafc" />
        <stop offset="100%" stopColor="#cfdef3" />
      </linearGradient>
      <linearGradient id="cam-lens" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#232526" />
        <stop offset="100%" stopColor="#414345" />
      </linearGradient>
      <radialGradient id="cam-reflection" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#4facfe" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect x="10" y="30" width="80" height="55" rx="12" fill="url(#cam-bg)" stroke="#a1b3c6" strokeWidth="2"/>
    <path d="M25 30 L35 15 H65 L75 30 Z" fill="url(#cam-bg)" stroke="#a1b3c6" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="50" cy="55" r="22" fill="url(#cam-lens)" stroke="#ffffff" strokeWidth="3"/>
    <circle cx="50" cy="55" r="18" fill="url(#cam-reflection)" />
    <circle cx="80" cy="40" r="4" fill="#ff4b2b" />
  </svg>
);

export const ArcadeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="arc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8E2DE2" />
        <stop offset="100%" stopColor="#4A00E0" />
      </linearGradient>
      <linearGradient id="arc-pad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
    </defs>
    <rect x="5" y="25" width="90" height="50" rx="25" fill="url(#arc-bg)" stroke="#a64dff" strokeWidth="2"/>
    <path d="M25 40 H35 V60 H25 Z M15 45 H45 V55 H15 Z" fill="url(#arc-pad)" />
    <circle cx="75" cy="40" r="5" fill="#00ffcc" />
    <circle cx="65" cy="50" r="5" fill="#ff00cc" />
    <circle cx="85" cy="50" r="5" fill="#ffff00" />
    <circle cx="75" cy="60" r="5" fill="#00ccff" />
  </svg>
);

export const MusicIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="mus-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f857a6" />
        <stop offset="100%" stopColor="#ff5858" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#mus-bg)" stroke="#ffb3b3" strokeWidth="2" strokeOpacity="0.5"/>
    
    {/* Music Note perfectly centered inside the 100x100 box */}
    <g fill="#ffffff">
      {/* Note Heads */}
      <circle cx="32.5" cy="69" r="12" />
      <circle cx="67.5" cy="59" r="12" />
      
      {/* Stems aligned to the right edge of note heads */}
      <rect x="38.5" y="29" width="6" height="42" />
      <rect x="73.5" y="19" width="6" height="42" />
      
      {/* Bridges connecting stems */}
      <polygon points="38.5,29 79.5,19 79.5,27 38.5,37" />
      <polygon points="38.5,42 79.5,32 79.5,37 38.5,47" />
    </g>
  </svg>
);

export const SettingsIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="set-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#434343" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id="set-tooth" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#555555" />
        <stop offset="100%" stopColor="#222222" />
      </linearGradient>
      <linearGradient id="set-inner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="100%" stopColor="#4facfe" />
      </linearGradient>
    </defs>
    
    <g fill="url(#set-tooth)">
      <rect x="40" y="5" width="20" height="90" rx="4" />
      <rect x="40" y="5" width="20" height="90" rx="4" transform="rotate(45 50 50)" />
      <rect x="40" y="5" width="20" height="90" rx="4" transform="rotate(90 50 50)" />
      <rect x="40" y="5" width="20" height="90" rx="4" transform="rotate(135 50 50)" />
    </g>

    <circle cx="50" cy="50" r="35" fill="url(#set-bg)" />
    <circle cx="50" cy="50" r="22" fill="#000000" stroke="url(#set-inner)" strokeWidth="4"/>
    <circle cx="50" cy="50" r="8" fill="url(#set-inner)" />
  </svg>
);

export const GalleryIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="gal-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#gal-bg)" stroke="#e879f9" strokeWidth="2" strokeOpacity="0.5"/>
    {/* Mountain landscape */}
    <polygon points="25,68 42,42 55,55 65,40 80,68" fill="rgba(255,255,255,0.35)" />
    <polygon points="25,68 42,50 58,68" fill="rgba(255,255,255,0.25)" />
    {/* Sun */}
    <circle cx="70" cy="32" r="8" fill="rgba(255,255,255,0.6)" />
  </svg>
);

export const CloudIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="cloud-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00c6ff" />
        <stop offset="100%" stopColor="#0072ff" />
      </linearGradient>
      <linearGradient id="cloud-shine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M25 70 C10 70, 10 45, 25 45 C25 25, 55 25, 55 45 C75 45, 75 70, 55 70 Z" fill="url(#cloud-bg)" />
    <path d="M25 70 C10 70, 10 45, 25 45 C25 25, 55 25, 55 45 C75 45, 75 70, 55 70 Z" fill="url(#cloud-shine)" />
    <circle cx="40" cy="50" r="10" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
    <path d="M40 45 V55 M35 50 H45" stroke="white" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
    <rect x="70" y="30" width="8" height="2" rx="1" fill="white" opacity="0.3" />
    <rect x="80" y="45" width="10" height="2" rx="1" fill="white" opacity="0.3" />
  </svg>
);

export const KeyboardIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="kb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2c3e50" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
      <linearGradient id="kb-accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="100%" stopColor="#4facfe" />
      </linearGradient>
    </defs>
    <rect x="5" y="25" width="90" height="50" rx="12" fill="url(#kb-bg)" stroke="url(#kb-accent)" strokeWidth="2" />
    <rect x="15" y="35" width="10" height="10" rx="2" fill="url(#kb-accent)" opacity="0.8" />
    <rect x="30" y="35" width="10" height="10" rx="2" fill="white" opacity="0.2" />
    <rect x="45" y="35" width="10" height="10" rx="2" fill="white" opacity="0.2" />
    <rect x="60" y="35" width="10" height="10" rx="2" fill="white" opacity="0.2" />
    <rect x="75" y="35" width="10" height="10" rx="2" fill="#ff00cc" opacity="0.8" />
    <rect x="15" y="50" width="10" height="10" rx="2" fill="white" opacity="0.2" />
    <rect x="30" y="50" width="40" height="10" rx="2" fill="url(#kb-accent)" opacity="0.4" />
    <rect x="75" y="50" width="10" height="10" rx="2" fill="white" opacity="0.2" />
  </svg>
);

export const BotIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transition-transform hover:scale-110">
    <defs>
      <linearGradient id="bot-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="100%" stopColor="#4facfe" />
      </linearGradient>
      <linearGradient id="bot-head" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2c3e50" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
    </defs>
    <rect x="15" y="15" width="70" height="70" rx="20" fill="url(#bot-bg)" opacity="0.15" />
    <path d="M30 35 C30 25, 70 25, 70 35 L75 65 C75 75, 25 75, 25 65 Z" fill="url(#bot-head)" stroke="url(#bot-bg)" strokeWidth="2" />
    <rect x="35" y="45" width="10" height="6" rx="3" fill="url(#bot-bg)" className="animate-pulse" />
    <rect x="55" y="45" width="10" height="6" rx="3" fill="url(#bot-bg)" className="animate-pulse" />
    <rect x="42" y="60" width="16" height="4" rx="2" fill="url(#bot-bg)" opacity="0.5" />
    <path d="M50 25 V15 M45 15 H55" stroke="url(#bot-bg)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const QuantumLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Futuristic Geometric 'Q' */}
    <circle cx="45" cy="45" r="35" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-90" />
    <circle cx="45" cy="45" r="18" fill="currentColor" className="opacity-20" />
    <path d="M68 68 L88 88" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="opacity-100" />
    <circle cx="45" cy="45" r="6" fill="currentColor" className="opacity-100" />
  </svg>
);
