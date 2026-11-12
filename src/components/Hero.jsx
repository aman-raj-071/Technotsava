import React from 'react';
import { FEST_CONFIG } from '../data/festConfig';

export const Hero = ({ onExploreEvents, onQuickRegister }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden cyber-grid-bg"
    >
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none -z-10 animate-glow-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[300px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Editable College & Edition Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono tracking-wide mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)] animate-float-slow">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold">{FEST_CONFIG.collegeName}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{FEST_CONFIG.department}</span>
        </div>

        {/* Fest Logo Placeholder & Branding */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#090d1f] border border-cyan-500/40 flex flex-col items-center justify-center p-3 shadow-2xl">
              <svg
                className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polygon
                  points="12 2 2 8.5 2 15.5 12 22 22 15.5 22 8.5 12 2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                <path d="M12 2v7M12 15v7M2 8.5l7 3.5M15 12l7-3.5M2 15.5l7-3.5M15 12l7 3.5" strokeWidth="1.2" opacity="0.6"/>
              </svg>
              <span className="text-[9px] font-mono tracking-widest text-cyan-300 font-bold mt-1">
                FEST LOGO
              </span>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-tech font-extrabold tracking-tight text-white mb-4">
          <span className="inline-block hover:scale-105 transition-transform duration-300">TECHNOTSAV</span>{' '}
          <span className="text-gradient-cyan text-glow">2026</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-slate-200 italic mb-6 tracking-wide">
          Think. Create. Compete. Celebrate.
        </p>

        {/* Short Introduction */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
          {FEST_CONFIG.shortIntro}
        </p>

        {/* Fest Info Chips (Editable placeholders: Date, Venue, Fee) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10 text-left">
          {/* Fest Date */}
          <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Fest Date</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-100">{FEST_CONFIG.festDate}</div>
            </div>
          </div>

          {/* Venue */}
          <div className="glass-panel p-3.5 rounded-xl border border-purple-500/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Campus Venue</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-100">{FEST_CONFIG.venue}</div>
            </div>
          </div>

          {/* Registration Fee */}
          <div className="glass-panel p-3.5 rounded-xl border border-indigo-500/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Registration Fee</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-100">{FEST_CONFIG.registrationFee}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Explore Events Button */}
          <button
            onClick={onExploreEvents}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Explore Events</span>
            <svg
              className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Register Now Button */}
          <button
            onClick={onQuickRegister}
            className="w-full sm:w-auto relative px-8 py-3.5 rounded-xl font-bold text-slate-950 overflow-hidden group shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 group-hover:opacity-95 transition-opacity" />
            <span className="relative flex items-center justify-center gap-2">
              <span>Register Now</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Quick event badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 font-mono">FEATURING:</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors">Digital Treasure Hunt</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-purple-400/40 transition-colors">Tech Quiz</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors">Ideathon</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-rose-400/40 transition-colors">Free Fire Gaming</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-colors">Minute to Win It</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-violet-400/40 transition-colors">Video Editing</span>
        </div>
      </div>
    </section>
  );
};
