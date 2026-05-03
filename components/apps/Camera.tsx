"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Camera as CameraIcon, Video, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'requesting' | 'active' | 'denied' | 'error'>('requesting');
  const [errorMessage, setErrorMessage] = useState('');
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setStatus('requesting');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
        audio: false 
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus('active');
    } catch (err: any) {
      console.error("Camera Error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatus('denied');
        setErrorMessage("Camera access was denied. Please check your browser permissions.");
      } else {
        setStatus('error');
        setErrorMessage(err.message || "An unexpected error occurred while accessing the camera.");
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-black relative flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {status === 'active' ? (
          <motion.div 
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full relative"
          >
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]"
            />
            
            {/* Camera UI Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/10 flex items-center justify-center">
              {/* Center Crosshair */}
              <div className="w-8 h-8 border border-white/20 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/20" />
                <div className="absolute left-1/2 top-0 w-px h-full bg-white/20" />
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 px-6">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 rounded-full border-4 border-white bg-white/10 flex items-center justify-center shadow-2xl pointer-events-auto transition-colors hover:bg-white"
                onClick={() => {
                  // Capture logic could go here
                  console.log("Shutter clicked");
                }}
              >
                <div className="w-12 h-12 rounded-full border-2 border-black/20" />
              </motion.button>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="status"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center text-center p-8"
          >
            {status === 'requesting' ? (
              <>
                <div className="w-16 h-16 rounded-full border-t-2 border-accent animate-spin mb-6" />
                <h3 className="text-xl font-medium text-white mb-2">Requesting Camera Access</h3>
                <p className="text-white/50 text-sm max-w-xs">Please allow camera permissions in your browser to use this app.</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Camera Unavailable</h3>
                <p className="text-white/50 text-sm max-w-xs mb-8">{errorMessage}</p>
                <button 
                  onClick={startCamera}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl text-white transition-all active:scale-95"
                >
                  <RefreshCcw size={18} />
                  <span>Try Again</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
