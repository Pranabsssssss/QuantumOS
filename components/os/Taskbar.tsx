"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Wifi, Battery, Volume2, Play, Pause, SkipBack, SkipForward, Music2 } from 'lucide-react';
import { useOSStore } from '@/store/osStore';
import { clsx } from 'clsx';
import { BrowserIcon, CalculatorIcon, CameraIcon, ArcadeIcon, MusicIcon, GalleryIcon, SettingsIcon, BotIcon, KeyboardIcon, CloudIcon, QuantumLogo } from './Icons';

const iconMap: Record<string, React.ReactNode> = {
  Globe: <BrowserIcon />,
  Calculator: <CalculatorIcon />,
  Camera: <CameraIcon />,
  Arcade: <ArcadeIcon />,
  Music: <MusicIcon />,
  Gallery: <GalleryIcon />,
  Settings: <SettingsIcon />,
  Bot: <BotIcon />,
  Keyboard: <KeyboardIcon />,
  Cloud: <CloudIcon />,
};

export const Taskbar = () => {
  const { apps, runningApps, focusedAppId, toggleStartMenu, activeOverlay, openApp, toggleSystemPanel, mediaState, setMediaState, pinnedApps, systemVolume, setSystemVolume } = useOSStore();
  const [time, setTime] = useState<Date | null>(null);
  
  // System Tray State
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [showVolumePanel, setShowVolumePanel] = useState(false);
  const volumePanelRef = useRef<HTMLDivElement>(null);

  // Ping State
  const [ping, setPing] = useState(12);
  const [showPingTooltip, setShowPingTooltip] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Global mediaState is handled via Zustand. We will listen for cross-origin postMessages.

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Simulate ping
    const pingTimer = setInterval(() => {
      setPing(prev => {
        const jitter = Math.floor(Math.random() * 50) - 20;
        // Occasional massive network spikes to show off the UI ranges
        const spike = Math.random() > 0.92 ? Math.floor(Math.random() * 1200) : 0;
        return Math.max(8, Math.min(1500, prev + jitter + spike));
      });
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(pingTimer);
    };
  }, []);

  useEffect(() => {
    const getBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          const nav = navigator as any;
          const battery = await nav.getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        }
      } catch (e) {
        console.warn("Battery API not supported or blocked");
      }
    };
    getBattery();
  }, []);



  const handleMediaAction = (action: string) => {
    const { togglePlay, nextTrack, prevTrack } = useOSStore.getState();
    if (action === 'play' || action === 'pause') togglePlay();
    if (action === 'next') nextTrack();
    if (action === 'prev') prevTrack();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumePanelRef.current && !volumePanelRef.current.contains(e.target as Node)) {
        setShowVolumePanel(false);
      }
    };
    if (showVolumePanel) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVolumePanel]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const volumeBtn = document.getElementById('volume-btn');
      if (volumeBtn && volumeBtn.matches(':hover')) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        setSystemVolume(Math.max(0, Math.min(1, systemVolume + delta)));
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, []);

  const isAnyMaximized = runningApps.some(app => app.isMaximized && !app.isMinimized);

  const MiniVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
    return (
      <div className="flex items-end gap-[2px] h-3 w-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={isPlaying ? {
              height: [4, 12, 6, 10, 4],
            } : {
              height: 4
            }}
            transition={{
              repeat: Infinity,
              duration: 0.6 + i * 0.2,
              ease: "easeInOut"
            }}
            className="w-1 bg-accent rounded-full"
          />
        ))}
      </div>
    );
  };

  const WifiDynamic = ({ ping }: { ping: number }) => {
    const bars = ping < 100 ? 4 : ping < 500 ? 3 : ping < 1000 ? 2 : 1;
    const color = ping >= 1000 ? "text-red-400" : "text-white/90";
    return (
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={color}
      >
        <path d="M1.42 9a16 16 0 0 1 21.16 0" className={clsx("transition-opacity duration-300", bars >= 4 ? "opacity-100" : "opacity-20")} />
        <path d="M5 12.55a11 11 0 0 1 14.08 0" className={clsx("transition-opacity duration-300", bars >= 3 ? "opacity-100" : "opacity-20")} />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" className={clsx("transition-opacity duration-300", bars >= 2 ? "opacity-100" : "opacity-20")} />
        <circle cx="12" cy="20" r="1.5" className="fill-current stroke-none" />
      </svg>
    );
  };

  return (
    <>
      <div 
        className={clsx(
          "fixed left-0 w-full h-14 pointer-events-none z-[9999] transition-all duration-300 ease-in-out",
          isAnyMaximized ? "bottom-0" : "bottom-5"
        )}
        onContextMenu={(e) => {
          // If they click exactly on the empty taskbar background
          if ((e.target as HTMLElement).className.includes('absolute inset-0')) {
            e.preventDefault();
            useOSStore.getState().openContextMenu({ x: e.clientX, y: e.clientY, type: 'taskbar_empty' });
          }
        }}
      >
        {/* Continuous Background Layer (Visible when maximized) */}
        <div 
          className={clsx(
            "absolute inset-0 w-full h-full border-t border-white/10 pointer-events-auto transition-all duration-300 ease-in-out",
            isAnyMaximized ? "liquid-glass-strong shadow-[0_-5px_30px_rgba(0,0,0,0.2)] opacity-100" : "bg-transparent border-transparent shadow-none opacity-0"
          )}
        />
        
        {/* Left Segment: Start & Apps */}
        <div 
          className={clsx(
            "absolute top-0 h-14 flex items-center px-4 pointer-events-auto transition-all duration-300 ease-in-out",
            isAnyMaximized 
              ? "left-0 bg-transparent border-transparent shadow-none rounded-none" 
              : "left-5 liquid-glass-strong border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl"
          )}
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleStartMenu}
            className={clsx(
              "p-2 rounded-xl transition-all duration-300 group flex items-center justify-center",
              activeOverlay === 'startMenu' ? "bg-white/10 shadow-[0_0_20px_rgba(var(--accent-color),0.4)]" : "hover:bg-white/5"
            )}
          >
            <QuantumLogo 
              size={26} 
              className={clsx(
                "transition-all duration-500",
                activeOverlay === 'startMenu' 
                  ? "text-accent drop-shadow-[0_0_12px_var(--accent-color)] rotate-90" 
                  : "text-white group-hover:text-accent group-hover:drop-shadow-[0_0_12px_var(--accent-color)] group-hover:rotate-90"
              )} 
            />
          </motion.button>

          <div className="w-px h-6 bg-white/20 mx-3" />

          <div className="flex items-center gap-2">
            <AnimatePresence mode="popLayout">
              {apps
                .filter(app => pinnedApps.includes(app.id) || runningApps.some(r => r.appId === app.id))
                .map(app => {
                  const isRunning = runningApps.some(a => a.appId === app.id);
                  const isFocused = runningApps.some(a => a.appId === app.id && a.id === focusedAppId && !a.isMinimized);

                  return (
                    <motion.button
                      key={app.id}
                      layout
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300, duration: 0.2 }}
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openApp(app.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        useOSStore.getState().openContextMenu({ x: e.clientX, y: e.clientY, type: 'taskbar_app', data: app.id });
                      }}
                      className={clsx(
                        "relative p-2 rounded-xl transition-all duration-200 group flex items-center justify-center",
                        isFocused ? "bg-white/15 shadow-[0_0_15px_rgba(var(--accent-color),0.3)]" : "hover:bg-white/10"
                      )}
                    >
                      <div className={clsx("text-white/80 group-hover:text-white transition-colors", isFocused && "text-accent")}>
                        {iconMap[app.icon] || <LayoutGrid size={20} />}
                      </div>
                      {isRunning && (
                        <motion.div 
                          layoutId={`indicator-${app.id}`}
                          className={clsx(
                            "absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full bg-accent transition-all duration-300",
                            isFocused ? "w-6 shadow-[0_0_10px_var(--accent-color)]" : "w-2 opacity-50"
                          )}
                        />
                      )}
                      
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 px-2.5 py-1.5 liquid-glass-strong rounded-lg border border-white/10 text-xs font-medium text-white/90 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-[10000]">
                        {app.name}
                      </div>
                    </motion.button>
                  );
                })}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Segment: Media Player */}
        <div 
          onClick={() => openApp('music')}
          className={clsx(
            "hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 h-14 items-center px-4 pointer-events-auto group cursor-pointer transition-all duration-300 ease-in-out",
            isAnyMaximized 
              ? "bg-transparent border-transparent shadow-none rounded-none hover:bg-white/5" 
              : "liquid-glass-strong border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl hover:bg-white/5"
          )}
        >
          <AnimatePresence mode="wait">
            {mediaState.currentTrack ? (
              <motion.div 
                key="playing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center w-full h-full"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mr-3 shadow-[inset_0_0_10px_rgba(var(--accent-color),0.2)]">
                  <MiniVisualizer isPlaying={mediaState.isPlaying} />
                </div>
                <div className="flex flex-col text-left mr-4">
                  <span className="text-sm font-medium text-white truncate max-w-[120px]">{mediaState.currentTrack.title}</span>
                  <span className="text-[10px] text-white/50 truncate max-w-[120px]">{mediaState.currentTrack.artist}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); handleMediaAction('prev'); }} className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white"><SkipBack size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleMediaAction(mediaState.isPlaying ? 'pause' : 'play'); }} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white">
                    {mediaState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleMediaAction('next'); }} className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white"><SkipForward size={16} /></button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="nomedia"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-white/50 px-2"
              >
                <Music2 size={16} />
                <span className="text-sm">No media playing</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Segment: System Tray & Clock */}
        <div 
          className={clsx(
            "absolute top-0 h-14 flex items-center px-4 pointer-events-auto transition-all duration-300 ease-in-out",
            isAnyMaximized 
              ? "right-0 bg-transparent border-transparent shadow-none rounded-none" 
              : "right-5 liquid-glass-strong border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl"
          )}
        >
          <div className="flex items-center gap-1">
            <div 
              className="relative flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
              onMouseEnter={() => hoverTimeoutRef.current = setTimeout(() => setShowPingTooltip(true), 1000)}
              onMouseLeave={() => {
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                setShowPingTooltip(false);
              }}
            >
              <WifiDynamic ping={ping} />
              
              <AnimatePresence>
                {showPingTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 liquid-glass-strong rounded-lg border border-white/10 shadow-xl whitespace-nowrap z-[10000]"
                  >
                    <span className="text-xs font-medium text-white/90">Ping: {ping}ms</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
              <span className="text-xs text-white/90 font-medium mr-1">{batteryLevel}%</span>
              <Battery size={18} className="text-white/90" />
            </div>
            <div 
              id="volume-btn"
              className={clsx(
                "flex items-center gap-1 px-2 py-1.5 rounded-xl cursor-pointer transition-colors",
                showVolumePanel ? "bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" : "hover:bg-white/10"
              )}
              onClick={() => setShowVolumePanel(!showVolumePanel)}
            >
              <Volume2 size={18} className="text-white/90" />
            </div>
          </div>

          <div className="w-px h-6 bg-white/20 mx-2" />

          <button 
            id="taskbar-clock"
            onClick={toggleSystemPanel}
            className="flex flex-col items-end leading-tight select-none hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span className="text-sm font-medium text-white/90">{time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
            <span className="text-[10px] text-white/50">{time ? time.toLocaleDateString() : ''}</span>
          </button>
        </div>
      </div>

      {/* Expandable Volume Panel */}
      <AnimatePresence>
        {showVolumePanel && (
          <motion.div
            ref={volumePanelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 w-72 liquid-glass-strong rounded-2xl p-4 z-[9998] pointer-events-auto border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/90">Volume</span>
              <span className="text-xs text-accent">{Math.round(systemVolume * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-white/70" />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={Math.round(systemVolume * 100)}
                onChange={(e) => setSystemVolume(parseInt(e.target.value) / 100)}
                className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:bg-accent transition-all"
                style={{
                  background: `linear-gradient(to right, var(--accent-color) ${systemVolume * 100}%, rgba(255,255,255,0.1) ${systemVolume * 100}%)`
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
