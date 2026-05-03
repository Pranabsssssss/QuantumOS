"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import { useOSStore, WindowState } from '@/store/osStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}

const WindowComponent: React.FC<WindowProps> = ({ windowState, children, title, icon }) => {
  const { id, isOpen, isMinimized, isMaximized, position, size, zIndex } = windowState;
  const { closeApp, minimizeApp, focusApp, updateWindowPosition, updateWindowSize, focusedAppId } = useOSStore();
  
  const isFocused = focusedAppId === id;
  const dragControls = useDragControls();

  // Local state for fast updates during drag/resize to avoid Zustand re-renders for every pixel
  const [localPos, setLocalPos] = useState(position);
  const [localSize, setLocalSize] = useState(size);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    // Only sync from store if not actively interacting
    if (!isDragging) {
      setLocalPos(position);
      setLocalSize(size);
    }
  }, [position, size, isDragging]);

  // Let AnimatePresence handle the unmount animation when isOpen becomes false

  const handlePointerDown = () => {
    focusApp(id);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    updateWindowPosition(id, { x: localPos.x + info.offset.x, y: localPos.y + info.offset.y });
  };
  
  const handleResizeDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    focusApp(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = localSize.width;
    const startHeight = localSize.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const newWidth = Math.max(400, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(300, startHeight + (moveEvent.clientY - startY));
      setLocalSize({ width: newWidth, height: newHeight });
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      updateWindowSize(id, localSize);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  return (
    <AnimatePresence>
      {isOpen && !isMinimized && (
        <motion.div
          // Removed 'layout' prop to eliminate jitter during drag/resize
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ 
            scale: isFocused ? 1.01 : 1, 
            opacity: 1,
            x: isMaximized ? 0 : localPos.x,
            y: isMaximized ? 0 : localPos.y,
            width: isMaximized ? '100vw' : localSize.width,
            height: isMaximized ? 'calc(100vh - 56px)' : localSize.height,
          }}
          exit={{ 
            scale: 0.85, 
            opacity: 0, 
            y: (isMaximized ? 0 : localPos.y) + 40,
            filter: "blur(10px)",
            transition: { 
              duration: 0.25, 
              ease: [0.32, 0.72, 0, 1]
            } 
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
          style={{ zIndex }}
          onPointerDown={handlePointerDown}
          className={cn(
            "absolute flex flex-col rounded-xl overflow-hidden will-change-transform",
            isFocused ? "liquid-glass-strong shadow-[0_10px_40px_rgba(0,0,0,0.5),_0_0_15px_rgba(var(--accent-color),0.4)]" : "liquid-glass shadow-glass",
            isMaximized ? "rounded-none" : "border border-glass-border"
          )}
        >
          {/* Title Bar */}
          <div 
            className="h-10 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing border-b border-white/5 bg-black/20"
            onPointerDown={(e) => {
              if (e.button === 2) return; // Prevent drag on right click
              if (isMaximized) return; // Prevent drag if maximized
              dragControls.start(e);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              useOSStore.getState().openContextMenu({ x: e.clientX, y: e.clientY, type: 'window', data: id });
            }}
          >
            <div className="flex items-center gap-2 pointer-events-none">
              {icon}
              <span className="text-sm font-medium text-white/90">{title}</span>
            </div>
            
            {/* Window Controls */}
            <div className="flex items-center gap-1 pointer-events-auto">
              <button 
                onClick={() => minimizeApp(id)}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <Minus size={14} />
              </button>
              <button 
                onClick={() => {
                  const isMax = !isMaximized;
                  useOSStore.setState(state => ({
                    runningApps: state.runningApps.map(app => app.id === id ? { ...app, isMaximized: isMax } : app)
                  }));
                }}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <Square size={12} />
              </button>
              <button 
                onClick={() => closeApp(id)}
                className="p-1.5 rounded-md hover:bg-red-500/80 text-white/70 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Hidden draggable area mapping */}
          {!isMaximized && (
            <motion.div
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDrag={(e, info) => {
                setLocalPos({
                  x: position.x + info.offset.x,
                  y: position.y + info.offset.y
                });
              }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 pointer-events-none"
            />
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-hidden bg-black/40 relative z-10">
            {isFocused && !isMaximized && (
              <div className="absolute inset-0 pointer-events-none border border-accent/20 rounded-xl transition-colors duration-300" />
            )}
            {children}
          </div>

          {/* Resize Handle */}
          {!isMaximized && (
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20"
              onPointerDown={handleResizeDrag}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Memoize to prevent re-rendering all windows when one window updates its local position
export const Window = React.memo(WindowComponent, (prevProps, nextProps) => {
  // Compare critical windowState fields to determine if a re-render is actually needed
  const prev = prevProps.windowState;
  const next = nextProps.windowState;
  
  return (
    prev.isOpen === next.isOpen &&
    prev.isMinimized === next.isMinimized &&
    prev.isMaximized === next.isMaximized &&
    prev.position.x === next.position.x &&
    prev.position.y === next.position.y &&
    prev.size.width === next.size.width &&
    prev.size.height === next.size.height &&
    prev.zIndex === next.zIndex &&
    // Re-render if focus state changes since it affects the glow/shadow
    useOSStore.getState().focusedAppId === prev.id === (useOSStore.getState().focusedAppId === next.id)
  );
});
