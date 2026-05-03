"use client";

import { Desktop } from '@/components/os/Desktop';
import { Taskbar } from '@/components/os/Taskbar';
import { StartMenu } from '@/components/os/StartMenu';
import { SystemPanel } from '@/components/os/SystemPanel';
import { BootManager } from '@/components/os/BootManager';
import { FullscreenGate } from '@/components/os/FullscreenGate';
import { ContextMenuManager } from '@/components/os/ContextMenuManager';
import { KeyboardManager } from '@/components/os/KeyboardManager';
import { SystemAudioManager } from '@/components/os/SystemAudioManager';

import { useOSStore } from '@/store/osStore';
import { useEffect } from 'react';

export default function Home() {
  const initStore = useOSStore(s => s.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <main 
      className="w-screen h-screen overflow-hidden bg-black text-white selection:bg-accent/30 selection:text-white relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      <SystemAudioManager />
      <FullscreenGate>
        <BootManager>
          {/* OS Environment */}
          <Desktop />
          
          {/* UI Overlay */}
          <div className="pointer-events-none relative z-[9990]">
            <StartMenu />
            <SystemPanel />
            <Taskbar />
          </div>

          {/* Global Managers */}
          <ContextMenuManager />
          <KeyboardManager />
        </BootManager>
      </FullscreenGate>
    </main>
  );
}
