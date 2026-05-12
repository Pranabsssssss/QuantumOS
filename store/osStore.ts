import { create } from 'zustand';

export type ContextMenuType = 'desktop' | 'taskbar_empty' | 'taskbar_app' | 'start_app' | 'window';

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  type: ContextMenuType;
  data?: any;
}

export interface Track {
  title: string;
  artist: string;
  src: string;
}

export interface MediaState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  tracks: Track[];
}

export interface WindowSwitcherState {
  isOpen: boolean;
  activeIndex: number;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: string;
  defaultSize: { width: number; height: number };
  url?: string;
}

export interface WindowState {
  id: string;
  appId: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface WidgetState {
  id: string;
  type: 'clock' | 'weather' | 'calendar';
  variant: number; // 0, 1, 2
  isEnabled: boolean;
  position: { x: number; y: number };
  scale: number;
}

interface OSState {
  apps: AppConfig[];
  runningApps: WindowState[];
  widgets: WidgetState[];
  focusedAppId: string | null;
  activeOverlay: 'none' | 'startMenu' | 'clockPanel';
  wallpaper: string;
  accentColor: string;
  username: string;
  bootStage: 'bios' | 'setup' | 'booting' | 'login' | 'desktop';
  mediaState: MediaState;
  contextMenu: ContextMenuState;
  windowSwitcher: WindowSwitcherState;
  pinnedApps: string[];
  systemVolume: number;

  setSystemVolume: (volume: number) => void;

  setBootStage: (stage: 'bios' | 'setup' | 'booting' | 'login' | 'desktop') => void;
  setActiveOverlay: (overlay: 'none' | 'startMenu' | 'clockPanel') => void;
  toggleStartMenu: () => void;
  toggleSystemPanel: () => void;
  setMediaState: (state: Partial<MediaState>) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTrack: (time: number) => void;
  setTracks: (tracks: Track[]) => void;
  openApp: (appId: string) => void;
  closeApp: (instanceId: string) => void;
  minimizeApp: (instanceId: string) => void;
  restoreApp: (instanceId: string) => void;
  focusApp: (instanceId: string) => void;
  setWallpaper: (wallpaper: string) => void;
  setAccentColor: (color: string) => void;
  setUsername: (name: string) => void;
  updateWindowPosition: (instanceId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (instanceId: string, size: { width: number; height: number }) => void;
  addApp: (app: AppConfig) => void;
  removeApp: (appId: string) => void;
  pinApp: (appId: string) => void;
  unpinApp: (appId: string) => void;
  togglePinApp: (appId: string) => void;
  openContextMenu: (payload: Omit<ContextMenuState, 'isOpen'>) => void;
  closeContextMenu: () => void;
  setWindowSwitcher: (state: Partial<WindowSwitcherState>) => void;
  
  // Widget Actions
  updateWidgetPosition: (id: string, position: { x: number; y: number }) => void;
  updateWidgetScale: (id: string, scale: number) => void;
  toggleWidget: (id: string) => void;
  setWidgetVariant: (id: string, variant: number) => void;

  initStore: () => void;
}

const defaultApps: AppConfig[] = [
  { id: 'browser', name: 'Quantex', icon: 'Globe', component: 'Browser', defaultSize: { width: 800, height: 600 }, url: 'https://quanti-search.vercel.app' },
  { id: 'calculator', name: 'Calculator', icon: 'Calculator', component: 'Calculator', defaultSize: { width: 320, height: 480 } },
  { id: 'camera', name: 'Camera', icon: 'Camera', component: 'Camera', defaultSize: { width: 640, height: 480 } },
  { id: 'arcade', name: 'Arcade', icon: 'Arcade', component: 'Arcade', defaultSize: { width: 600, height: 800 }, url: 'https://ellisonleao.github.io/clumsy-bird/' },
  { id: 'music', name: 'Music', icon: 'Music', component: 'Music', defaultSize: { width: 800, height: 600 } },
  { id: 'gallery', name: 'Gallery', icon: 'Gallery', component: 'Gallery', defaultSize: { width: 800, height: 600 }, url: 'https://galary-quant.vercel.app' },
  { id: 'ai-chat', name: 'AI Chat', icon: 'Bot', component: 'AIChat', defaultSize: { width: 500, height: 700 } },
  { id: 'typester', name: 'Typester', icon: 'Keyboard', component: 'Typester', defaultSize: { width: 900, height: 550 } },
  { id: 'settings', name: 'Settings', icon: 'Settings', component: 'Settings', defaultSize: { width: 600, height: 500 } },
];

const defaultPinnedApps = ['browser', 'calculator', 'camera', 'gallery', 'settings'];

let nextZIndex = 10;

export const useOSStore = create<OSState>((set, get) => ({
  apps: defaultApps,
  runningApps: [],
  focusedAppId: null,
  activeOverlay: 'none',
  wallpaper: '/wallpapers/Quantum Def.jpeg',
  accentColor: '#a855f7', // Default purple
  username: 'User',
  bootStage: 'bios',
  mediaState: {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    tracks: []
  },
  contextMenu: { isOpen: false, x: 0, y: 0, type: 'desktop' },
  windowSwitcher: { isOpen: false, activeIndex: 0 },
  pinnedApps: defaultPinnedApps,
  systemVolume: 0.8,
  widgets: [
    { id: 'clock-widget', type: 'clock', variant: 0, isEnabled: true, position: { x: 20, y: 20 }, scale: 1 },
    { id: 'weather-widget', type: 'weather', variant: 0, isEnabled: true, position: { x: 20, y: 220 }, scale: 1 },
    { id: 'calendar-widget', type: 'calendar', variant: 0, isEnabled: false, position: { x: 20, y: 420 }, scale: 1 },
  ],

  setSystemVolume: (volume) => {
    set({ systemVolume: volume });
    if (typeof window !== 'undefined') localStorage.setItem("systemVolume", volume.toString());
  },

  setBootStage: (stage) => set({ bootStage: stage }),
  setActiveOverlay: (overlay) => set({ activeOverlay: overlay }),
  toggleSystemPanel: () => set((state) => ({ activeOverlay: state.activeOverlay === 'clockPanel' ? 'none' : 'clockPanel' })),
  toggleStartMenu: () => set((state) => ({ activeOverlay: state.activeOverlay === 'startMenu' ? 'none' : 'startMenu' })),
  setMediaState: (state) => set((s) => ({ mediaState: { ...s.mediaState, ...state } })),

  playTrack: (track) => set((s) => ({ 
    mediaState: { ...s.mediaState, currentTrack: track, isPlaying: true } 
  })),

  togglePlay: () => set((s) => ({ 
    mediaState: { ...s.mediaState, isPlaying: !s.mediaState.isPlaying } 
  })),

  nextTrack: () => {
    const { tracks, currentTrack } = get().mediaState;
    if (tracks.length === 0) return;
    const idx = currentTrack ? tracks.findIndex(t => t.src === currentTrack.src) : -1;
    const nextIdx = (idx + 1) % tracks.length;
    get().playTrack(tracks[nextIdx]);
  },

  prevTrack: () => {
    const { tracks, currentTrack, currentTime } = get().mediaState;
    if (tracks.length === 0) return;
    if (currentTime > 3) {
      get().seekTrack(0);
      return;
    }
    const idx = currentTrack ? tracks.findIndex(t => t.src === currentTrack.src) : -1;
    const prevIdx = (idx - 1 + tracks.length) % tracks.length;
    get().playTrack(tracks[prevIdx]);
  },

  seekTrack: (time) => set((s) => ({ 
    mediaState: { ...s.mediaState, currentTime: time } 
  })),

  setTracks: (tracks) => set((s) => ({ 
    mediaState: { ...s.mediaState, tracks } 
  })),

  openContextMenu: (payload) => {
    set((state) => ({
      contextMenu: { isOpen: true, ...payload },
      activeOverlay: payload.type === 'start_app' ? state.activeOverlay : 'none'
    }));
  },
  closeContextMenu: () => set((state) => ({ contextMenu: { ...state.contextMenu, isOpen: false } })),
  setWindowSwitcher: (payload) => set((state) => ({ windowSwitcher: { ...state.windowSwitcher, ...payload } })),

  updateWidgetPosition: (id, position) => set((state) => {
    const newWidgets = state.widgets.map(w => w.id === id ? { ...w, position } : w);
    if (typeof window !== 'undefined') localStorage.setItem('widgets', JSON.stringify(newWidgets));
    return { widgets: newWidgets };
  }),

  updateWidgetScale: (id, scale) => set((state) => {
    const newWidgets = state.widgets.map(w => w.id === id ? { ...w, scale } : w);
    if (typeof window !== 'undefined') localStorage.setItem('widgets', JSON.stringify(newWidgets));
    return { widgets: newWidgets };
  }),

  toggleWidget: (id) => set((state) => {
    const newWidgets = state.widgets.map(w => w.id === id ? { ...w, isEnabled: !w.isEnabled } : w);
    if (typeof window !== 'undefined') localStorage.setItem('widgets', JSON.stringify(newWidgets));
    return { widgets: newWidgets };
  }),

  setWidgetVariant: (id, variant) => set((state) => {
    const newWidgets = state.widgets.map(w => w.id === id ? { ...w, variant } : w);
    if (typeof window !== 'undefined') localStorage.setItem('widgets', JSON.stringify(newWidgets));
    return { widgets: newWidgets };
  }),

  initStore: () => {
    if (typeof window === 'undefined') return;
    const savedWallpaper = localStorage.getItem("wallpaper");
    const savedAccent = localStorage.getItem("accentColor");
    const savedUsername = localStorage.getItem("username");
    const savedPinned = localStorage.getItem("pinnedApps");
    const savedVolume = localStorage.getItem("systemVolume");
    const savedWidgets = localStorage.getItem("widgets");

    if (savedWallpaper) set({ wallpaper: savedWallpaper });
    if (savedAccent) {
      set({ accentColor: savedAccent });
      document.documentElement.style.setProperty('--accent-color', savedAccent);
    } else {
      document.documentElement.style.setProperty('--accent-color', '#a855f7');
    }
    if (savedUsername) set({ username: savedUsername });
    if (savedPinned) {
      try { set({ pinnedApps: JSON.parse(savedPinned) }); } catch { }
    }
    if (savedVolume) set({ systemVolume: parseFloat(savedVolume) });
    if (savedWidgets) {
      try { set({ widgets: JSON.parse(savedWidgets) }); } catch { }
    }
  },



  openApp: (appId) => {
    const { apps, runningApps, focusApp } = get();

    const existingApp = runningApps.find(app => app.appId === appId);
    if (existingApp) {
      if (existingApp.isMinimized) {
        get().restoreApp(existingApp.id);
      }
      focusApp(existingApp.id);
      return;
    }

    const appConfig = apps.find(a => a.id === appId);
    if (!appConfig) return;

    // Responsive default sizes
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

    // Set width to 60% of screen, height to 70% of screen, with minimum limits
    const calcWidth = Math.max(appConfig.defaultSize.width, screenWidth * 0.6);
    const calcHeight = Math.max(appConfig.defaultSize.height, screenHeight * 0.7);

    // Center window and add slight offset for multiple windows
    const offset = runningApps.length * 20;
    const initialX = typeof window !== 'undefined' ? (screenWidth - calcWidth) / 2 + offset : 100;
    const initialY = typeof window !== 'undefined' ? (screenHeight - calcHeight) / 2 + offset : 100;

    const newWindowId = `${appId}-${Date.now()}`;
    const newWindow: WindowState = {
      id: newWindowId,
      appId,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: initialX, y: initialY },
      size: { width: calcWidth, height: calcHeight },
      zIndex: nextZIndex++,
    };

    set({ runningApps: [...runningApps, newWindow], activeOverlay: 'none' });
    focusApp(newWindowId);
  },

  closeApp: (instanceId) => {
    set((state) => ({
      runningApps: state.runningApps.map(app =>
        app.id === instanceId ? { ...app, isOpen: false } : app
      ),
      focusedAppId: state.focusedAppId === instanceId ? null : state.focusedAppId
    }));

    // Delay the actual removal to allow framer-motion exit animations to play
    setTimeout(() => {
      set((state) => ({
        runningApps: state.runningApps.filter(app => app.id !== instanceId)
      }));
    }, 300);
  },

  minimizeApp: (instanceId) => set((state) => ({
    runningApps: state.runningApps.map(app =>
      app.id === instanceId ? { ...app, isMinimized: true } : app
    ),
    focusedAppId: state.focusedAppId === instanceId ? null : state.focusedAppId
  })),

  restoreApp: (instanceId) => {
    set((state) => ({
      runningApps: state.runningApps.map(app =>
        app.id === instanceId ? { ...app, isMinimized: false } : app
      )
    }));
    get().focusApp(instanceId);
  },

  focusApp: (instanceId) => {
    const { runningApps, focusedAppId } = get();
    if (focusedAppId === instanceId) return;

    const maxZ = runningApps.length > 0 ? Math.max(...runningApps.map(a => a.zIndex)) : nextZIndex - 1;
    const newZ = Math.max(maxZ + 1, nextZIndex);
    nextZIndex = newZ + 1;

    set((state) => ({
      runningApps: state.runningApps.map(app =>
        app.id === instanceId ? { ...app, zIndex: newZ } : app
      ),
      focusedAppId: instanceId,
      activeOverlay: 'none'
    }));
  },

  setWallpaper: (wallpaper) => {
    set({ wallpaper });
    if (typeof window !== 'undefined') localStorage.setItem("wallpaper", wallpaper);
  },

  setAccentColor: (color) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--accent-color', color);
      localStorage.setItem("accentColor", color);
    }
    set({ accentColor: color });
  },

  setUsername: (name) => {
    set({ username: name });
    if (typeof window !== 'undefined') localStorage.setItem("username", name);
  },

  updateWindowPosition: (instanceId, position) => set((state) => ({
    runningApps: state.runningApps.map(app =>
      app.id === instanceId ? { ...app, position } : app
    )
  })),

  updateWindowSize: (instanceId, size) => set((state) => ({
    runningApps: state.runningApps.map(app =>
      app.id === instanceId ? { ...app, size } : app
    )
  })),

  addApp: (app) => set((state) => ({ apps: [...state.apps, app] })),
  removeApp: (appId) => set((state) => ({ apps: state.apps.filter(a => a.id !== appId) })),

  pinApp: (appId) => {
    set((state) => {
      const newPinned = [...state.pinnedApps, appId];
      if (typeof window !== 'undefined') localStorage.setItem('pinnedApps', JSON.stringify(newPinned));
      return { pinnedApps: newPinned };
    });
  },
  unpinApp: (appId) => {
    set((state) => {
      const newPinned = state.pinnedApps.filter(id => id !== appId);
      if (typeof window !== 'undefined') localStorage.setItem('pinnedApps', JSON.stringify(newPinned));
      return { pinnedApps: newPinned };
    });
  },
  togglePinApp: (appId) => {
    const { pinnedApps } = get();
    if (pinnedApps.includes(appId)) {
      get().unpinApp(appId);
    } else {
      get().pinApp(appId);
    }
  }
}));
