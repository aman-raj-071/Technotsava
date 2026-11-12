import React, { useState } from 'react';
import { EVENTS } from '../data/eventsData';

export const EventsSection = ({ onSelectEvent, eventSettings = {} }) => {
  const [selectedRuleEvent, setSelectedRuleEvent] = useState(null);

  // Helper to render icon for event
  const renderIcon = (id) => {
    switch (id) {
      case 'digital-treasure-hunt':
        return (
          <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'tech-quiz':
        return (
          <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ideathon':
        return (
          <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'gaming-free-fire':
        return (
          <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      case 'minute-to-win-it':
        return (
          <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'video-editing':
        return (
          <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <section id="events" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
            <span>// Flagship Competitions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-tech font-bold text-white mb-4">
            Six Arenas of <span className="text-gradient-cyan">Glory</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Choose your battlefield. Click any event card to view rules or proceed directly to its dedicated registration page.
          </p>
        </div>

        {/* 6 Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {EVENTS.map((event) => {
            const isActive = eventSettings[event.id] !== false;

            return (
              <div
                key={event.id}
                onClick={() => isActive && onSelectEvent(event)}
                className={`group relative glass-panel-glow rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border border-slate-700/60 hover:-translate-y-1.5 cursor-pointer overflow-hidden ${
                  !isActive ? 'opacity-70 grayscale-[30%] cursor-not-allowed' : ''
                }`}
              >
                {/* Top Corner Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-cyan-500/20 transition-all duration-300" />

                <div>
                  {/* Top Bar: Category & Team Size Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-cyan-300 border border-cyan-500/20">
                      {event.category}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      {event.teamSizeText}
                    </span>
                  </div>

                  {/* Icon & Event Name */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-cyan-400/60 transition-colors shadow-md">
                      {renderIcon(event.id)}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {event.name}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                        Code: {event.code}
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {event.shortDescription}
                  </p>

                  {/* Themes indicator for Ideathon */}
                  {event.themes && (
                    <div className="mb-5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                      <div className="font-semibold text-amber-200">2 Selectable Themes:</div>
                      <div className="text-[11px] text-slate-400">• Smart Campus & Student Life</div>
                      <div className="text-[11px] text-slate-400">• Daily Life Productivity & Digital Utilities</div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  {/* View Rules Modal Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRuleEvent(event);
                    }}
                    className="text-xs text-slate-400 hover:text-white font-mono hover:underline flex items-center gap-1 py-1"
                  >
                    <span>Guidelines</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {/* Register Button */}
                  {isActive ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(event);
                      }}
                      className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all duration-200 shadow-md flex items-center gap-1.5 group-hover:scale-105"
                    >
                      <span>Register Now</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-red-950/60 text-red-400 border border-red-500/30">
                      Registration Closed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules / Guidelines Modal */}
      {selectedRuleEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative">
            <button
              onClick={() => setSelectedRuleEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {selectedRuleEvent.category}
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                {selectedRuleEvent.teamSizeText}
              </span>
            </div>

            <h3 className="text-2xl font-display font-bold text-white mb-2">
              {selectedRuleEvent.name}
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              {selectedRuleEvent.detailedDescription}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3">
                Rules & Eligibility Criteria:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {selectedRuleEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedRuleEvent(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const ev = selectedRuleEvent;
                  setSelectedRuleEvent(null);
                  onSelectEvent(ev);
                }}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-lg shadow-lg"
              >
                Proceed to Register
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
