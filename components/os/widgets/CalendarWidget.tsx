"use client";

import React from 'react';
import { WidgetWrapper } from './WidgetWrapper';
import { WidgetState } from '@/store/osStore';

export const CalendarWidget = ({ state }: { state: WidgetState }) => {
  const date = new Date();

  const renderVariant = () => {
    switch (state.variant) {
      case 0: // Monthly Grid
        return (
          <div className="p-6 liquid-glass rounded-3xl min-w-[280px] font-space">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-lg font-bold text-white">{date.toLocaleString('default', { month: 'long' })}</span>
              <span className="text-sm text-white/40">{date.getFullYear()}</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <span key={d} className="text-[10px] font-bold text-accent/40 mb-2">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-colors
                    ${i + 1 === date.getDate() ? 'bg-accent text-black font-bold shadow-lg' : 'text-white/60 hover:bg-white/5'}
                  `}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // Agenda View
        return (
          <div className="p-6 liquid-glass rounded-3xl min-w-[260px] font-sora">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 px-1">Upcoming</h3>
            <div className="flex flex-col gap-3">
              {[
                { time: '10:00', title: 'System Sync', color: 'bg-accent' },
                { time: '14:30', title: 'Design Review', color: 'bg-purple-500' }
              ].map((ev, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:border-accent/30 transition-colors">
                  <div className={`w-1 h-8 rounded-full ${ev.color}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/30">{ev.time}</span>
                    <span className="text-xs font-semibold text-white/90">{ev.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Minimal Date Display
        return (
          <div className="p-8 liquid-glass-strong rounded-full w-40 h-40 flex flex-col items-center justify-center border-white/10 font-orbitron">
            <span className="text-sm font-bold text-accent/60 uppercase tracking-[0.3em] mb-1">
              {date.toLocaleString('default', { month: 'short' })}
            </span>
            <span className="text-6xl font-black text-white text-glow leading-none">
              {date.getDate()}
            </span>
            <span className="text-[10px] font-medium text-white/30 uppercase mt-2">
              {date.toLocaleString('default', { weekday: 'long' })}
            </span>
          </div>
        );
    }
  };

  return (
    <WidgetWrapper state={state}>
      {renderVariant()}
    </WidgetWrapper>
  );
};
