"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music2 } from 'lucide-react';
import { useOSStore, Track } from '@/store/osStore';
import { clsx } from 'clsx';

export const Music: React.FC = () => {
  const { mediaState, playTrack, togglePlay, nextTrack, prevTrack, seekTrack, setTracks } = useOSStore();
  const { currentTrack, isPlaying, currentTime, duration, tracks } = mediaState;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Load tracks from API
  useEffect(() => {
    fetch('/api/music')
      .then(res => res.json())
      .then((data: Track[]) => {
        setTracks(data);
      })
      .catch(err => console.error("Failed to load music:", err));
  }, [setTracks]);

  // Visualizer Setup (Connect to globalAudio)
  useEffect(() => {
    const audio = (window as any).globalAudio as HTMLAudioElement;
    if (!audio) return;

    let analyser: AnalyserNode;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
    } catch (e) {
      // Analyser might already be connected
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      if (!analyserRef.current) return;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#a855f7';
      const barCount = 64;
      const barWidth = w / barCount;

      for (let i = 0; i < barCount; i++) {
        const dataIdx = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIdx] / 255;
        const barHeight = value * h * 0.85;

        const gradient = ctx.createLinearGradient(0, h, 0, h - barHeight);
        gradient.addColorStop(0, accentColor + '40');
        gradient.addColorStop(0.5, accentColor + '90');
        gradient.addColorStop(1, accentColor);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(i * barWidth + 1, h - barHeight, barWidth - 2, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      }
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex bg-black/90 text-white overflow-hidden">
      {/* Left Panel: Track List */}
      <div className="w-64 min-w-[220px] border-r border-white/10 flex flex-col bg-black/40">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
            <Music2 size={14} className="text-accent" /> Library
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {tracks.map((track, idx) => (
            <button
              key={idx}
              onClick={() => playTrack(track)}
              className={clsx(
                "w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors border-l-2",
                currentTrack?.src === track.src
                  ? "bg-accent/10 border-accent text-white"
                  : "border-transparent hover:bg-white/5 text-white/70 hover:text-white"
              )}
            >
              <span className="text-sm font-medium truncate">{track.title}</span>
              <span className="text-[11px] text-white/40 truncate">{track.artist}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel: Now Playing */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        <canvas ref={canvasRef} width={800} height={200} className="absolute bottom-24 left-0 right-0 w-full h-[200px] opacity-70 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className={clsx(
            "w-40 h-40 rounded-3xl bg-gradient-to-br from-accent/30 to-purple-900/50 border border-white/10 flex items-center justify-center mb-8 transition-all duration-700",
            isPlaying ? "shadow-[0_0_60px_rgba(var(--accent-color),0.4)] scale-105" : "shadow-none scale-100"
          )}>
            <div className={clsx("absolute inset-0 rounded-3xl bg-accent/20 animate-pulse", !isPlaying && "hidden")} />
            <Music2 size={56} className={clsx("transition-colors", isPlaying ? "text-accent" : "text-white/20")} />
          </div>

          <h2 className="text-2xl font-bold text-center mb-1 max-w-[400px] truncate">
            {currentTrack?.title || 'No Track Selected'}
          </h2>
          <p className="text-sm text-white/50 text-center">
            {currentTrack?.artist || '—'}
          </p>
        </div>

        {/* Seek Bar */}
        <div className="relative z-10 w-full max-w-md flex items-center gap-3 mb-6">
          <span className="text-[11px] text-white/40 w-10 text-right font-mono">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => seekTrack(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
            style={{
              background: duration ? `linear-gradient(to right, var(--accent-color) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)` : 'rgba(255,255,255,0.1)'
            }}
          />
          <span className="text-[11px] text-white/40 w-10 font-mono">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-6">
          <button onClick={prevTrack} className="p-3 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <SkipBack size={22} />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-accent text-black hover:brightness-110 transition-all shadow-[0_0_25px_rgba(var(--accent-color),0.4)] hover:shadow-[0_0_35px_rgba(var(--accent-color),0.6)] hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
          </button>
          <button onClick={nextTrack} className="p-3 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <SkipForward size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
