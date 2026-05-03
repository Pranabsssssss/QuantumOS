"use client";

import { useEffect, useRef } from 'react';
import { useOSStore } from '@/store/osStore';

export const SystemAudioManager = () => {
  const { mediaState, setMediaState, systemVolume, nextTrack, runningApps } = useOSStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTrackSrc = useRef<string | null>(null);

  // 1. Initialize Global Music Audio Instance
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      (window as any).globalAudio = audioRef.current;
    }
    
    const audio = audioRef.current;

    const handlePlay = () => setMediaState({ isPlaying: true });
    const handlePause = () => setMediaState({ isPlaying: false });
    const handleTimeUpdate = () => setMediaState({ currentTime: audio.currentTime });
    const handleDurationChange = () => setMediaState({ duration: audio.duration });
    const handleEnded = () => nextTrack();

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => useOSStore.getState().prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => useOSStore.getState().nextTrack());
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setMediaState, nextTrack]);

  // 2. Global Volume Control & Iframe Sync
  useEffect(() => {
    // Sync Music Audio
    if (audioRef.current) {
      audioRef.current.volume = systemVolume;
    }

    // Sync all root audio/video elements
    const syncMedia = () => {
      document.querySelectorAll("audio, video").forEach(el => {
        (el as HTMLMediaElement).volume = systemVolume;
      });
    };
    syncMedia();

    // Set up observer for dynamically added media elements
    const observer = new MutationObserver(syncMedia);
    observer.observe(document.body, { childList: true, subtree: true });

    // Sync Iframes via postMessage
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      iframe.contentWindow?.postMessage({ 
        type: 'SET_VOLUME', 
        value: systemVolume 
      }, '*');
    });

    return () => observer.disconnect();
  }, [systemVolume]);

  // 3. Sync state -> Music audio (track/play/pause/seek)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (mediaState.currentTrack && mediaState.currentTrack.src !== lastTrackSrc.current) {
      audio.src = mediaState.currentTrack.src;
      lastTrackSrc.current = mediaState.currentTrack.src;
      if (mediaState.isPlaying) audio.play().catch(() => {});
      
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: mediaState.currentTrack.title,
          artist: mediaState.currentTrack.artist,
          album: 'Quantum OS',
          artwork: [{ src: '/icons/music-art.png', sizes: '512x512', type: 'image/png' }]
        });
      }
    }

    if (mediaState.isPlaying && audio.paused && audio.src) {
      audio.play().catch(() => {});
    } else if (!mediaState.isPlaying && !audio.paused) {
      audio.pause();
    }

    if (Math.abs(audio.currentTime - mediaState.currentTime) > 1.5) {
      audio.currentTime = mediaState.currentTime;
    }
  }, [mediaState.currentTrack, mediaState.isPlaying, mediaState.currentTime]);

  // 4. Handle Music App Lifecycle (Stop on Close)
  useEffect(() => {
    const isMusicRunning = runningApps.some(app => app.appId === 'music');
    
    if (!isMusicRunning && mediaState.currentTrack) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setMediaState({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0
      });
      lastTrackSrc.current = null;
    }
  }, [runningApps, mediaState.currentTrack, setMediaState]);

  return null;
};
