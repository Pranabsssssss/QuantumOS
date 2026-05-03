"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/osStore';
import { clsx } from 'clsx';
import { BrowserIcon, CalculatorIcon, CameraIcon, ArcadeIcon, MusicIcon, GalleryIcon, SettingsIcon } from './Icons';

const iconMap: Record<string, React.ReactNode> = {
  Globe: <BrowserIcon size={48} />,
  Calculator: <CalculatorIcon size={48} />,
  Camera: <CameraIcon size={48} />,
  Arcade: <ArcadeIcon size={48} />,
  Music: <MusicIcon size={48} />,
  Gallery: <GalleryIcon size={48} />,
  Settings: <SettingsIcon size={48} />,
};

export const KeyboardManager = () => {
  const { 
    windowSwitcher, setWindowSwitcher, runningApps, apps, 
    focusApp, toggleStartMenu, focusedAppId
  } = useOSStore();

  useEffect(() => {
    // Attempt to lock keyboard (works in Chrome Fullscreen)
    const lockKeyboard = async () => {
      if ('keyboard' in navigator && (navigator as any).keyboard?.lock) {
        try {
          await (navigator as any).keyboard.lock(['AltLeft', 'AltRight', 'Tab', 'MetaLeft', 'MetaRight']);
        } catch (e) {
          console.warn("Keyboard lock failed/unsupported", e);
        }
      }
    };
    lockKeyboard();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Start Menu Trigger (Meta key or Ctrl+Space)
      if (e.key === 'Meta' || (e.ctrlKey && e.key === ' ')) {
        e.preventDefault();
        toggleStartMenu();
        return;
      }

      // Alt+Tab Switcher
      if ((e.altKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'Tab')) {
        e.preventDefault();
        
        const { runningApps, windowSwitcher, focusedAppId } = useOSStore.getState();
        if (runningApps.length === 0) return;

        // Windows-like sorting: most recent (highest z-index) first
        const sortedApps = [...runningApps].sort((a, b) => b.zIndex - a.zIndex);

        useOSStore.setState(state => {
          const isFirstPress = !state.windowSwitcher.isOpen;
          let nextIndex;
          
          if (isFirstPress) {
            // Find current focused window index in sorted list
            const currentIndex = sortedApps.findIndex(a => a.id === focusedAppId);
            // Skip current window (move to next)
            nextIndex = (currentIndex + 1) % sortedApps.length;
          } else {
            if (e.shiftKey) {
              // Backward cycle
              nextIndex = (state.windowSwitcher.activeIndex - 1 + sortedApps.length) % sortedApps.length;
            } else {
              // Forward cycle
              nextIndex = (state.windowSwitcher.activeIndex + 1) % sortedApps.length;
            }
          }
          
          return { windowSwitcher: { isOpen: true, activeIndex: nextIndex } };
        });
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // If Alt or Ctrl is released, close switcher and focus selected
      if (e.key === 'Alt' || e.key === 'Control') {
        const state = useOSStore.getState();
        if (state.windowSwitcher.isOpen && state.runningApps.length > 0) {
          const sortedApps = [...state.runningApps].sort((a, b) => b.zIndex - a.zIndex);
          const selectedApp = sortedApps[state.windowSwitcher.activeIndex];
          if (selectedApp) {
            focusApp(selectedApp.id);
            // Also ensure it's not minimized
            if (selectedApp.isMinimized) {
              useOSStore.getState().restoreApp(selectedApp.id);
            }
          }
          setWindowSwitcher({ isOpen: false });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [toggleStartMenu, focusApp, setWindowSwitcher]);

  // If switcher is open but no apps running, auto-close
  useEffect(() => {
    if (windowSwitcher.isOpen && runningApps.length === 0) {
      setWindowSwitcher({ isOpen: false });
    }
  }, [runningApps.length, windowSwitcher.isOpen, setWindowSwitcher]);

  return (
    <AnimatePresence>
      {windowSwitcher.isOpen && runningApps.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="flex items-center gap-6 p-8 liquid-glass-strong border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-x-auto max-w-[90vw]"
          >
            {[...runningApps].sort((a, b) => b.zIndex - a.zIndex).map((instance, idx) => {
              const appConfig = apps.find(a => a.id === instance.appId);
              const isActive = idx === windowSwitcher.activeIndex;
              
              if (!appConfig) return null;

              return (
                <div 
                  key={instance.id}
                  className={clsx(
                    "flex flex-col items-center justify-center p-6 rounded-2xl w-48 h-48 transition-all duration-300",
                    isActive ? "bg-white/20 scale-110 shadow-[0_0_40px_rgba(var(--accent-color),0.4)] border border-accent/50" : "bg-black/40 opacity-50"
                  )}
                >
                  <div className={clsx("mb-6 transition-transform", isActive && "scale-110 text-accent")}>
                    {iconMap[appConfig.icon]}
                  </div>
                  <span className={clsx("text-base font-semibold text-center truncate w-full", isActive ? "text-white" : "text-white/60")}>
                    {appConfig.name}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
