"use client";

import React, { useRef, useEffect } from 'react';

interface VideoWallpaperProps {
  src: string;
}

export const VideoWallpaper: React.FC<VideoWallpaperProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force loop and autoplay via JS as well
    video.loop = true;
    video.muted = true;
    
    const playVideo = () => {
      video.play().catch(err => {
        console.warn("Autoplay blocked or failed:", err);
      });
    };

    playVideo();

    // Aggressive loop fallback
    const handleEnded = () => {
      video.currentTime = 0;
      playVideo();
    };

    // Prevent pause if document is visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playVideo();
      }
    };

    video.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none"
    />
  );
};
