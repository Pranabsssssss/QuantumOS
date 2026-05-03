"use client";

import React from 'react';
import { useOSStore } from '@/store/osStore';
import { ClockWidget } from './widgets/ClockWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { AnimatePresence } from 'framer-motion';

export const WidgetManager = () => {
  const { widgets } = useOSStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      <AnimatePresence>
        {widgets.map(widget => {
          if (!widget.isEnabled) return null;

          switch (widget.type) {
            case 'clock':
              return <ClockWidget key={widget.id} state={widget} />;
            case 'weather':
              return <WeatherWidget key={widget.id} state={widget} />;
            case 'calendar':
              return <CalendarWidget key={widget.id} state={widget} />;
            default:
              return null;
          }
        })}
      </AnimatePresence>
    </div>
  );
};
