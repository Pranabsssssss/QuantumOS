"use client";

import React from 'react';
import { WidgetWrapper } from './WidgetWrapper';
import { WidgetState } from '@/store/osStore';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

export const WeatherWidget = ({ state }: { state: WidgetState }) => {
  const renderVariant = () => {
    switch (state.variant) {
      case 0: // Compact Card
        return (
          <div className="p-6 liquid-glass rounded-3xl flex items-center gap-6 border-white/5 font-sora">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-lg">
              <Sun size={40} className="text-accent text-glow" />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-white leading-none">24°C</span>
              <span className="text-sm text-white/40 font-medium mt-1">Sunny • New York</span>
            </div>
          </div>
        );

      case 1: // Expanded Forecast
        return (
          <div className="p-6 liquid-glass rounded-3xl flex flex-col gap-4 min-w-[280px] font-space">
            <div className="flex justify-between items-center mb-2">
               <span className="text-xl font-bold text-white">Forecast</span>
               <Wind size={18} className="text-accent/60" />
            </div>
            {[
              { day: 'Mon', temp: '22°', icon: <Sun size={18}/> },
              { day: 'Tue', temp: '19°', icon: <Cloud size={18}/> },
              { day: 'Wed', temp: '21°', icon: <CloudRain size={18}/> }
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-sm font-medium text-white/60">{d.day}</span>
                <div className="flex items-center gap-3">
                  <span className="text-accent/40">{d.icon}</span>
                  <span className="text-base font-bold text-white">{d.temp}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 2: // Minimal Icon + Temp
        return (
          <div className="flex flex-col items-center gap-2 font-orbitron">
             <div className="p-4 liquid-glass-strong rounded-full border-accent/30 shadow-[0_0_20px_rgba(var(--accent-color),0.2)]">
               <Cloud size={32} className="text-accent" />
             </div>
             <span className="text-2xl font-black text-white tracking-widest text-glow">20°</span>
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
