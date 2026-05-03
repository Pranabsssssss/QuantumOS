"use client";

import React, { useState } from 'react';
import { useOSStore } from '@/store/osStore';
import { clsx } from 'clsx';
import { Check, Paintbrush, Monitor, User, Layout, Loader2 } from 'lucide-react';

interface Wallpaper {
  name: string;
  path: string;
  isVideo?: boolean;
}

const accentColors = [
  { name: 'Purple', value: '#a855f7' },
  { name: 'Cyan', value: '#00f0ff' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Blue', value: '#3b82f6' },
];

export const Settings = () => {
  const { 
    wallpaper, setWallpaper, accentColor, setAccentColor, username, setUsername,
    widgets, toggleWidget, setWidgetVariant
  } = useOSStore();
  const [activeTab, setActiveTab] = useState('personalization');
  const [tempUsername, setTempUsername] = useState(username);
  const [loadingWallpaper, setLoadingWallpaper] = useState<string | null>(null);
  const [dynamicWallpapers, setDynamicWallpapers] = useState<Wallpaper[]>([]);
  const [isFetchingWps, setIsFetchingWps] = useState(true);

  React.useEffect(() => {
    fetch('/api/wallpapers')
      .then(res => res.json())
      .then(data => {
        setDynamicWallpapers(data);
        setIsFetchingWps(false);
      })
      .catch(() => setIsFetchingWps(false));
  }, []);

  const handleWallpaperChange = (wpPath: string, isVideo?: boolean) => {
    if (isVideo) {
      setWallpaper(wpPath);
      return;
    }
    
    // Preload image
    setLoadingWallpaper(wpPath);
    const img = new Image();
    img.src = wpPath;
    img.onload = () => {
      setWallpaper(wpPath);
      setLoadingWallpaper(null);
    };
    img.onerror = () => {
      console.error("Failed to load wallpaper", wpPath);
      setLoadingWallpaper(null);
    };
  };

  const handleSaveUser = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
    }
  };

  return (
    <div className="w-full h-full bg-black/80 text-white flex select-none">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/10 p-4 flex flex-col gap-2 bg-black/20">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center font-bold text-black text-sm shadow-[0_0_10px_rgba(var(--accent-color),0.5)]">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium truncate">{username}</span>
            <span className="text-[10px] text-white/50">Local Account</span>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('personalization')}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
            activeTab === 'personalization' ? "bg-accent/20 text-accent font-medium shadow-[inset_2px_0_0_var(--accent-color)]" : "hover:bg-white/5 text-white/70"
          )}
        >
          <Paintbrush size={16} /> Personalization
        </button>
        <button 
          onClick={() => setActiveTab('user')}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
            activeTab === 'user' ? "bg-accent/20 text-accent font-medium shadow-[inset_2px_0_0_var(--accent-color)]" : "hover:bg-white/5 text-white/70"
          )}
        >
          <User size={16} /> Account
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
            activeTab === 'system' ? "bg-accent/20 text-accent font-medium shadow-[inset_2px_0_0_var(--accent-color)]" : "hover:bg-white/5 text-white/70"
          )}
        >
          <Monitor size={16} /> System
        </button>
        <button 
          onClick={() => setActiveTab('widgets')}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
            activeTab === 'widgets' ? "bg-accent/20 text-accent font-medium shadow-[inset_2px_0_0_var(--accent-color)]" : "hover:bg-white/5 text-white/70"
          )}
        >
          <Layout size={16} /> Widgets
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto pb-24">
        <h2 className="text-2xl font-semibold mb-6 capitalize">{activeTab}</h2>

        {activeTab === 'personalization' && (
          <div className="space-y-8">
            {/* Background */}
            <section>
              <h3 className="text-sm font-medium text-white/80 mb-4 uppercase tracking-wider">Background</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isFetchingWps ? (
                  <div className="col-span-full h-32 flex flex-col items-center justify-center text-white/20 gap-2">
                    <Loader2 className="animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Scanning Wallpapers...</span>
                  </div>
                ) : (
                  dynamicWallpapers.map((wp) => (
                    <button
                      key={wp.path}
                      onClick={() => handleWallpaperChange(wp.path, wp.isVideo)}
                      className={clsx(
                        "relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                        wallpaper === wp.path ? "border-accent shadow-[0_0_15px_rgba(var(--accent-color),0.4)]" : "border-transparent",
                        loadingWallpaper === wp.path && "opacity-50 pointer-events-none"
                      )}
                    >
                      {wp.isVideo ? (
                        <video
                          src={wp.path}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                          onLoadedData={(e) => {
                            const vid = e.currentTarget;
                            vid.currentTime = 1;
                            vid.pause();
                          }}
                        />
                      ) : (
                        <img src={wp.path} alt={wp.name} className="w-full h-full object-cover" />
                      )}
                      {wallpaper === wp.path && (
                        <div className="absolute top-2 right-2 bg-accent text-black rounded-full p-1 z-10">
                          <Check size={12} />
                        </div>
                      )}
                      {loadingWallpaper === wp.path && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-1.5 text-[10px] text-center truncate z-10">
                        {wp.name}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            {/* Colors */}
            <section>
              <h3 className="text-sm font-medium text-white/80 mb-4 uppercase tracking-wider">Accent Color</h3>
              <div className="flex gap-4 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                      accentColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
                    )}
                    style={{ backgroundColor: color.value, boxShadow: accentColor === color.value ? `0 0 15px ${color.value}` : 'none' }}
                  >
                    {accentColor === color.value && <Check size={16} className="text-black" />}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'user' && (
          <div className="space-y-4 max-w-md">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/80">Username</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveUser()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-accent transition-colors text-white"
                />
                <button 
                  onClick={handleSaveUser}
                  className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all"
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-white/50">Your username is saved locally and will persist across reloads.</p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-2">Quantum OS</h3>
              <p className="text-sm text-white/60 mb-4">Version 2.0.0 (Web Edition)</p>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-white/50">Processor</span>
                <span>WebAssembly / JS Engine</span>
                <span className="text-white/50">Installed RAM</span>
                <span>Depends on host browser</span>
                <span className="text-white/50">System type</span>
                <span>64-bit Web OS</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'widgets' && (
          <div className="space-y-10">
            {widgets.map((widget) => (
              <section key={widget.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold capitalize">{widget.type} Widget</h3>
                    <p className="text-xs text-white/40">Manage your desktop {widget.type} display</p>
                  </div>
                  <button 
                    onClick={() => toggleWidget(widget.id)}
                    className={clsx(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                      widget.isEnabled 
                        ? "bg-accent/20 border-accent text-accent" 
                        : "bg-white/5 border-white/10 text-white/40"
                    )}
                  >
                    {widget.isEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="flex gap-4">
                  {[0, 1, 2].map((v) => (
                    <button
                      key={v}
                      disabled={!widget.isEnabled}
                      onClick={() => setWidgetVariant(widget.id, v)}
                      className={clsx(
                        "flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                        !widget.isEnabled && "opacity-20 grayscale",
                        widget.variant === v && widget.isEnabled
                          ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(var(--accent-color),0.2)]"
                          : "border-white/5 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs">
                        W{v + 1}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Style {v + 1}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
