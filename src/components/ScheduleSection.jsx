import React, { useState } from 'react';
import { FEST_CONFIG } from '../data/festConfig';

export const ScheduleSection = () => {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section id="schedule" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
            <span>// Fest Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-tech font-bold text-white mb-4">
            Event <span className="text-gradient-cyan">Schedule</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Timeline of competitions, workshops, prelims and ceremonies across campus.
            (Editable placeholders for fest dates and venue allocations).
          </p>
        </div>

        {/* Day Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass-panel p-1.5 rounded-2xl border border-cyan-500/30 flex gap-2">
            {FEST_CONFIG.schedule.map((sch, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm transition-all duration-200 ${
                  activeDay === idx
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{sch.day}</span>
                <span className="opacity-75 hidden sm:inline ml-2 text-xs">({sch.date})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Events List */}
        <div className="space-y-4">
          {FEST_CONFIG.schedule[activeDay]?.items.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-700/60 hover:border-cyan-500/40 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Column: Time & Venue */}
              <div className="md:w-1/3 shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{item.time}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="font-medium text-slate-300">{item.venue}</span>
                </div>
              </div>

              {/* Right Column: Title & Description */}
              <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-6 pt-3 md:pt-0">
                <h4 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
