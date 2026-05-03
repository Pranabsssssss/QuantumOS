"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/osStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export const SystemPanel = () => {
  const { activeOverlay, setActiveOverlay } = useOSStore();
  const panelRef = useRef<HTMLDivElement>(null);

  const [time, setTime] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync calendar with actual current month initially
  useEffect(() => {
    if (activeOverlay === 'clockPanel') {
      setCurrentMonth(new Date());
    }
  }, [activeOverlay]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking the taskbar clock area
      const taskbarClock = document.getElementById('taskbar-clock');
      if (
        panelRef.current && 
        !panelRef.current.contains(e.target as Node) &&
        taskbarClock &&
        !taskbarClock.contains(e.target as Node)
      ) {
        setActiveOverlay('none');
      }
    };

    if (activeOverlay === 'clockPanel') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeOverlay, setActiveOverlay]);

  // Analog Clock Math
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secDeg = seconds * 6;
  const minDeg = minutes * 6;
  const hourDeg = hours * 30;

  // Calendar Math
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <AnimatePresence>
      {activeOverlay === 'clockPanel' && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 bottom-24 w-80 liquid-glass-strong rounded-2xl z-[9998] p-6 flex flex-col gap-8 shadow-2xl border border-white/10 pointer-events-auto overflow-y-auto scrollbar-hide"
        >
          {/* Digital Clock */}
          <div className="flex flex-col items-center mt-4">
            <h1 className="text-5xl font-light tracking-tight text-white/90">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </h1>
            <p className="text-sm text-white/50 mt-1 font-medium">
              {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Analog Clock */}
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-full border border-white/10 bg-black/20 shadow-inner relative flex items-center justify-center backdrop-blur-sm">
              {/* Clock Face Markers */}
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-1 h-2 bg-white/20 rounded-full"
                  style={{ 
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-80px)`,
                  }} 
                />
              ))}
              
              {/* Center Dot */}
              <div className="w-3 h-3 bg-accent rounded-full z-20 shadow-[0_0_10px_var(--accent-color)]" />
              
              {/* Hour Hand */}
              <div 
                className="absolute w-1.5 h-12 bg-white/80 rounded-full origin-bottom z-10"
                style={{ transform: `translateY(-50%) rotate(${hourDeg}deg)` }}
              />
              
              {/* Minute Hand */}
              <div 
                className="absolute w-1 h-16 bg-white/60 rounded-full origin-bottom z-10"
                style={{ transform: `translateY(-50%) rotate(${minDeg}deg)` }}
              />
              
              {/* Second Hand - smooth motion handled by CSS transition or fast state updates */}
              <div 
                className="absolute w-[2px] h-20 bg-accent rounded-full origin-bottom z-10"
                style={{ 
                  transform: `translateY(-50%) rotate(${secDeg}deg)`,
                  transition: 'transform 0.1s linear' // Adds micro-smoothness
                }}
              />
            </div>
          </div>

          <div className="h-px w-full bg-white/10 my-2" />

          {/* Calendar */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="font-medium text-white/90">{monthNames[month]} {year}</span>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/70">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/70">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-xs font-medium text-white/40 py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((d, i) => {
                const isToday = isCurrentMonth && d === today.getDate();
                return (
                  <div 
                    key={i} 
                    className={clsx(
                      "aspect-square flex items-center justify-center text-sm rounded-md transition-colors cursor-default",
                      d === null ? "" : "hover:bg-white/10",
                      isToday ? "bg-accent text-black font-semibold shadow-[0_0_10px_rgba(var(--accent-color),0.5)]" : (d ? "text-white/80" : "")
                    )}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
