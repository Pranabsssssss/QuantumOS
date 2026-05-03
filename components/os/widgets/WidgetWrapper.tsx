"use client";

import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useOSStore } from '@/store/osStore';
import { WidgetState } from '@/store/osStore';

interface WidgetWrapperProps {
  state: WidgetState;
  children: React.ReactNode;
  className?: string;
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ state, children, className }) => {
  const { updateWidgetPosition, updateWidgetScale } = useOSStore();
  const constraintsRef = useRef(null);
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const newScale = Math.max(0.5, Math.min(2.0, state.scale + delta));
    updateWidgetScale(state.id, newScale);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateWidgetPosition(state.id, { 
          x: state.position.x + info.offset.x, 
          y: state.position.y + info.offset.y 
        });
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: state.scale,
        x: state.position.x,
        y: state.position.y
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      onWheel={handleWheel}
      className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing z-[1] select-none ${className}`}
      style={{ transformOrigin: 'top left' }}
    >
      {children}
    </motion.div>
  );
};
