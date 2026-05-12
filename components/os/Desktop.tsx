"use client";

import React, { useRef, useEffect } from 'react';
import { useOSStore } from '@/store/osStore';
import { Window } from './Window';
import { AnimatePresence } from 'framer-motion';
import { VideoWallpaper } from './VideoWallpaper';
import { WidgetManager } from './WidgetManager';

import { Browser } from '@/components/apps/Browser';
import { Calculator } from '@/components/apps/Calculator';
import { Camera } from '@/components/apps/Camera';
import { Arcade } from '@/components/apps/Arcade';
import { Music } from '@/components/apps/Music';
import { Gallery } from '@/components/apps/Gallery';
import { Settings } from '@/components/apps/Settings';
import { AIChat } from '@/components/apps/AIChat';
import { Typester } from '@/components/apps/Typester';
import { BrowserIcon, CalculatorIcon, CameraIcon, ArcadeIcon, MusicIcon, GalleryIcon, SettingsIcon, BotIcon, KeyboardIcon } from './Icons';

const iconMap: Record<string, React.ReactNode> = {
  Globe: <BrowserIcon size={16} />,
  Calculator: <CalculatorIcon size={16} />,
  Camera: <CameraIcon size={16} />,
  Arcade: <ArcadeIcon size={16} />,
  Music: <MusicIcon size={16} />,
  Gallery: <GalleryIcon size={16} />,
  Settings: <SettingsIcon size={16} />,
  Bot: <BotIcon size={16} />,
  Keyboard: <KeyboardIcon size={16} />,
};

const ComponentMap: Record<string, React.FC<any>> = {
  Browser,
  Calculator,
  Camera,
  Arcade,
  Music,
  Gallery,
  Settings,
  AIChat,
  Typester,
};

export const Desktop = () => {
  const { wallpaper, runningApps, apps, activeOverlay, setActiveOverlay } = useOSStore();
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === desktopRef.current || (e.target as HTMLElement).tagName === 'VIDEO') {
      if (activeOverlay !== 'none') setActiveOverlay('none');
      useOSStore.setState({ focusedAppId: null });
    }
  };

  const isVideo = wallpaper.endsWith('.mp4') || wallpaper.endsWith('.webm');

  return (
    <div 
      ref={desktopRef}
      className="fixed inset-0 w-full h-full overflow-hidden bg-black select-none z-0"
      data-desktop
      onClick={handleDesktopClick}
      onContextMenu={(e) => {
        if (e.target === desktopRef.current || (e.target as HTMLElement).tagName === 'VIDEO' || (e.target as HTMLElement).className.includes('bg-[url')) {
          e.preventDefault();
          useOSStore.getState().openContextMenu({
            x: e.clientX,
            y: e.clientY,
            type: 'desktop'
          });
        }
      }}
    >
      {/* Wallpaper Layer */}
      {isVideo ? (
        <VideoWallpaper src={wallpaper} />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out pointer-events-none"
          style={{ backgroundImage: `url('${wallpaper}')` }}
        />
      )}
      
      {/* Subtle Desktop Grid / Noise Overlay for premium feel */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Windows Layer */}
      <AnimatePresence>
        {runningApps.map(appState => {
          const appConfig = apps.find(a => a.id === appState.appId);
          if (!appConfig) return null;

          const AppContent = ComponentMap[appConfig.component] || ComponentMap['Browser'];

          return (
            <Window 
              key={appState.id} 
              windowState={appState} 
              title={appConfig.name}
              icon={iconMap[appConfig.icon] || <BrowserIcon size={16} />}
            >
              <AppContent url={appConfig.url} />
            </Window>
          );
        })}
      </AnimatePresence>

      <WidgetManager />
    </div>
  );
};
