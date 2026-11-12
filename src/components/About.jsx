import React from 'react';
import { FEST_CONFIG } from '../data/festConfig';

export const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
            <span>// About TECHNOTSAV</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-tech font-bold text-white mb-4">
            Unleashing Future <span className="text-gradient-cyan">Technologists</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            TECHNOTSAV 2026 is the annual flagship inter-collegiate technology festival engineered to bring
            together creative problem-solvers, competitive gamers, innovative thinkers, and digital creators on a single grand stage.
          </p>
        </div>

        {/* Fest Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {FEST_CONFIG.stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-cyan-500/15 text-center hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-tech font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-2 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3 Pillars of TECHNOTSAV */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Think & Innovate</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Showcase architectural acumen in our Ideathon and solve cryptic cryptographic logic in the Digital Treasure Hunt. Push the limits of intellect.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Compete with the Best</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              From buzzer-speed Computer Science trivia in the Tech Quiz to Free Fire battle royale tactics and 60-second micro agility showdowns.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Create & Celebrate</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bring visual stories to life in Video Editing, collaborate with peers, win prestigious accolades, and create memories that resonate for a lifetime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
