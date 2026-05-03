"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/osStore';
import { 
  RefreshCw, Image as ImageIcon, Settings, 
  X, Minus, Square, Play, Trash2, Pin, PinOff 
} from 'lucide-react';
import { clsx } from 'clsx';

export const ContextMenuManager = () => {
  const { 
    contextMenu, closeContextMenu, openApp, closeApp, 
    minimizeApp, removeApp, runningApps, pinnedApps, togglePinApp 
  } = useOSStore();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't close immediately if they right clicked to open it (prevent immediate close)
      if (e.type === 'mousedown' && e.button === 2) return;
      
      if (contextMenu.isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contextMenu.isOpen) {
        closeContextMenu();
      }
    };

    if (contextMenu.isOpen) {
      document.addEventListener('mousedown', handleGlobalClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.isOpen, closeContextMenu]);

  useEffect(() => {
    if (contextMenu.isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let newX = contextMenu.x;
      let newY = contextMenu.y;

      if (newX + rect.width > window.innerWidth) {
        newX -= rect.width;
      }
      if (newY + rect.height > window.innerHeight) {
        newY -= rect.height;
      }

      setAdjustedPos({ x: newX, y: newY });
    } else {
      setAdjustedPos({ x: -9999, y: -9999 });
    }
  }, [contextMenu.isOpen, contextMenu.x, contextMenu.y]);

  if (!contextMenu.isOpen) return null;

  const renderOptions = () => {
    switch (contextMenu.type) {
      case 'desktop':
        return (
          <>
            <MenuItem icon={<RefreshCw size={14} />} label="Refresh" onClick={() => {
              // Fake Windows-style refresh: briefly flash the desktop
              const desktop = document.querySelector('[data-desktop]') as HTMLElement;
              if (desktop) {
                desktop.style.transition = 'opacity 0.15s ease';
                desktop.style.opacity = '0';
                setTimeout(() => {
                  desktop.style.opacity = '1';
                  setTimeout(() => { desktop.style.transition = ''; }, 200);
                }, 150);
              }
            }} />
            <div className="h-px bg-white/10 my-1 mx-2" />
            <MenuItem icon={<ImageIcon size={14} />} label="Change Wallpaper" onClick={() => openApp('settings')} />
            <MenuItem icon={<Settings size={14} />} label="Settings" onClick={() => openApp('settings')} />
          </>
        );
      case 'taskbar_empty':
        return (
          <MenuItem icon={<Settings size={14} />} label="Taskbar Settings" onClick={() => openApp('settings')} />
        );
      case 'taskbar_app':
        const isRunning = runningApps.some(a => a.appId === contextMenu.data);
        const runningInstance = runningApps.find(a => a.appId === contextMenu.data);
        const isPinnedTaskbar = pinnedApps.includes(contextMenu.data);
        return (
          <>
            <MenuItem icon={<Play size={14} />} label="Open" onClick={() => openApp(contextMenu.data)} />
            {isRunning && runningInstance && (
              <MenuItem icon={<Minus size={14} />} label="Minimize" onClick={() => minimizeApp(runningInstance.id)} />
            )}
            <div className="h-px bg-white/10 my-1 mx-2" />
            <MenuItem 
              icon={isPinnedTaskbar ? <PinOff size={14} /> : <Pin size={14} />} 
              label={isPinnedTaskbar ? "Unpin from Taskbar" : "Pin to Taskbar"} 
              onClick={() => togglePinApp(contextMenu.data)} 
            />
            {isRunning && runningInstance && (
              <MenuItem icon={<X size={14} />} label="Close" onClick={() => closeApp(runningInstance.id)} variant="danger" />
            )}
          </>
        );
      case 'start_app':
        const isPinnedStart = pinnedApps.includes(contextMenu.data);
        return (
          <>
            <MenuItem icon={<Play size={14} />} label="Open" onClick={() => openApp(contextMenu.data)} />
            <MenuItem 
              icon={isPinnedStart ? <PinOff size={14} /> : <Pin size={14} />} 
              label={isPinnedStart ? "Unpin from Taskbar" : "Pin to Taskbar"} 
              onClick={() => togglePinApp(contextMenu.data)} 
            />
            <div className="h-px bg-white/10 my-1 mx-2" />
            <MenuItem icon={<Trash2 size={14} />} label="Remove App" onClick={() => removeApp(contextMenu.data)} variant="danger" />
          </>
        );
      case 'window':
        return (
          <>
            <MenuItem icon={<Minus size={14} />} label="Minimize" onClick={() => minimizeApp(contextMenu.data)} />
            <MenuItem icon={<Square size={14} />} label="Maximize / Restore" onClick={() => {
              const app = runningApps.find(a => a.id === contextMenu.data);
              if (app) {
                useOSStore.setState(state => ({
                  runningApps: state.runningApps.map(a => a.id === app.id ? { ...a, isMaximized: !a.isMaximized } : a)
                }));
              }
            }} />
            <div className="h-px bg-white/10 my-1 mx-2" />
            <MenuItem icon={<X size={14} />} label="Close" onClick={() => closeApp(contextMenu.data)} variant="danger" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed z-[100000] min-w-[180px] py-1.5 liquid-glass-strong border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden"
        style={{
          left: adjustedPos.x !== -9999 ? adjustedPos.x : contextMenu.x,
          top: adjustedPos.y !== -9999 ? adjustedPos.y : contextMenu.y,
          visibility: adjustedPos.x !== -9999 ? 'visible' : 'hidden'
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {renderOptions()}
      </motion.div>
    </AnimatePresence>
  );
};

const MenuItem = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'default' 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  variant?: 'default' | 'danger';
}) => {
  const { closeContextMenu } = useOSStore();
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        closeContextMenu();
      }}
      className={clsx(
        "w-full px-3 py-2 flex items-center gap-3 text-sm transition-colors text-left group",
        variant === 'danger' 
          ? "text-red-400 hover:bg-red-500/20" 
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
    >
      <span className={clsx(
        "transition-transform group-hover:scale-110",
        variant === 'danger' ? "text-red-400" : "text-accent"
      )}>
        {icon}
      </span>
      {label}
    </button>
  );
};
