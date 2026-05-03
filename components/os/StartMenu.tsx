"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/osStore';
import { Search, Plus, LogOut, Music2 } from 'lucide-react';
import { 
  BrowserIcon, 
  CalculatorIcon, 
  CameraIcon, 
  ArcadeIcon, 
  MusicIcon, 
  GalleryIcon, 
  SettingsIcon, 
  BotIcon, 
  KeyboardIcon, 
  CloudIcon 
} from './Icons';

const icons: Record<string, React.ReactNode> = {
  Globe: <BrowserIcon size={32} />,
  Calculator: <CalculatorIcon size={32} />,
  Camera: <CameraIcon size={32} />,
  Arcade: <ArcadeIcon size={32} />,
  Music: <MusicIcon size={32} />,
  Gallery: <GalleryIcon size={32} />,
  Settings: <SettingsIcon size={32} />,
  Bot: <BotIcon size={32} />,
  Keyboard: <KeyboardIcon size={32} />,
  Cloud: <CloudIcon size={32} />,
};

export const StartMenu = () => {
  const { 
    activeOverlay, 
    setActiveOverlay, 
    apps, 
    openApp, 
    addApp, 
    username, 
    mediaState, 
    playTrack, 
    setBootStage, 
    accentColor 
  } = useOSStore();

  const [query, setQuery] = useState('');
  const [creatingApp, setCreatingApp] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const searchField = useRef<HTMLInputElement>(null);

  const matchedApps = apps.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const matchedMusic = query.trim() ? mediaState.tracks.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.artist.toLowerCase().includes(query.toLowerCase())
  ) : [];

  useEffect(() => {
    if (activeOverlay === 'startMenu') {
      setQuery('');
      setTimeout(() => searchField.current?.focus(), 100);

      const onKeyDown = (e: KeyboardEvent) => {
        if (document.activeElement?.tagName === 'INPUT' || e.ctrlKey || e.altKey || e.metaKey) return;
        
        if (e.key.length === 1) {
          setQuery(val => val + e.key);
          searchField.current?.focus();
        } else if (e.key === 'Backspace') {
          setQuery(val => val.slice(0, -1));
          searchField.current?.focus();
        }
      };

      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [activeOverlay]);

  const launch = (id: string) => {
    openApp(id);
    setActiveOverlay('none');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !urlInput) return;

    addApp({
      id: `custom-${Date.now()}`,
      name: nameInput,
      icon: 'Globe',
      component: 'Browser',
      defaultSize: { width: 800, height: 600 },
      url: urlInput.startsWith('http') ? urlInput : `https://${urlInput}`
    });

    setCreatingApp(false);
    setNameInput('');
    setUrlInput('');
  };

  return (
    <AnimatePresence>
      {activeOverlay === 'startMenu' && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 w-[400px] h-[550px] liquid-glass-strong rounded-2xl flex flex-col z-[9998] overflow-hidden border border-white/10 shadow-2xl pointer-events-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="p-6 pb-2"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
              <input 
                ref={searchField}
                type="text" 
                placeholder="Type here to search" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-accent/50 focus:shadow-[0_0_10px_rgba(var(--accent-color),0.3)] transition-all"
              />
            </div>
          </motion.div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {!creatingApp ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 pl-2">Pinned</h3>
                  <button 
                    onClick={() => setCreatingApp(true)}
                    className="flex items-center gap-1 text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md text-white/80 transition-colors"
                  >
                    <Plus size={14} /> Add App
                  </button>
                </div>

                <motion.div 
                  layout
                  className="grid grid-cols-4 gap-4"
                  transition={{ staggerChildren: 0.03 }}
                >
                  <AnimatePresence mode="popLayout">
                    {matchedApps.map(app => (
                      <motion.button
                        key={app.id}
                        layout
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => launch(app.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          useOSStore.getState().openContextMenu({ 
                            x: e.clientX, 
                            y: e.clientY, 
                            type: 'start_app', 
                            data: app.id 
                          });
                        }}
                        className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-accent/10 group-hover:text-accent group-hover:border-accent/30 transition-all shadow-inner">
                          {icons[app.icon] || <BrowserIcon size={32} />}
                        </div>
                        <span className="text-xs text-white/80 group-hover:text-white truncate w-full text-center">
                          {app.name}
                        </span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {matchedMusic.length > 0 && (
                  <motion.div layout className="mt-8">
                    <h3 className="text-sm font-semibold text-white/80 pl-2 mb-3">Music</h3>
                    <motion.div 
                      layout 
                      className="flex flex-col gap-2"
                      transition={{ staggerChildren: 0.03 }}
                    >
                      <AnimatePresence mode="popLayout">
                        {matchedMusic.map(track => (
                          <motion.button
                            key={track.src}
                            layout
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            onClick={() => {
                              playTrack(track);
                              setActiveOverlay('none');
                              openApp('music');
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group text-left"
                          >
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                              <Music2 size={18} />
                            </div>
                            <div className="flex flex-col truncate">
                              <span className="text-xs font-medium text-white">{track.title}</span>
                              <span className="text-[10px] text-white/40">{track.artist}</span>
                            </div>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                )}

                {matchedApps.length === 0 && matchedMusic.length === 0 && query && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-40 text-white/30"
                  >
                    <Search size={40} className="mb-4 opacity-20" />
                    <p className="text-sm">No results found for "{query}"</p>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleCreate}
                className="flex flex-col gap-4 h-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Add Web App</h3>
                  <button 
                    type="button"
                    onClick={() => setCreatingApp(false)}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/70 ml-1">App Name</label>
                  <input 
                    required
                    type="text" 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent/50 transition-all"
                    placeholder="e.g. GitHub"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/70 ml-1">URL</label>
                  <input 
                    required
                    type="url" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent/50 transition-all"
                    placeholder="https://github.com"
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-4 bg-accent/20 border border-accent/50 text-accent hover:bg-accent hover:text-black py-2 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(var(--accent-color),0.2)] hover:shadow-[0_0_20px_rgba(var(--accent-color),0.6)]"
                >
                  Add to Start Menu
                </button>
              </motion.form>
            )}
          </div>

          <div className="h-16 bg-black/40 border-t border-white/5 flex items-center justify-between px-6 mt-auto">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors -ml-2"
              title="View account"
            >
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center font-bold text-black text-sm"
                style={{ boxShadow: `0 0 10px ${accentColor}80` }}
              >
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium text-white/90 truncate max-w-[120px]">{username || 'User'}</span>
            </div>
            <button 
              onClick={() => {
                setBootStage('login');
                setActiveOverlay('none');
              }}
              className="p-2 hover:bg-white/10 rounded-xl text-white/80 hover:text-accent transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
