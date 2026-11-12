import React from 'react';
import { FEST_CONFIG } from '../data/festConfig';

export const Footer = ({ onOpenAdmin, onSelectSection }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#04060d] text-slate-400 text-xs relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-black text-sm">
                T
              </div>
              <span className="font-tech font-extrabold text-white text-base tracking-wider">
                TECHNOTSAV <span className="text-cyan-400">2026</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              {FEST_CONFIG.tagline}
            </p>
            <p className="text-[11px] text-slate-500 leading-normal">
              {FEST_CONFIG.collegeName} • {FEST_CONFIG.department}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-2">
            <div className="font-mono uppercase text-slate-200 text-xs tracking-wider font-semibold">
              Quick Links
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectSection('hero')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  About the Fest
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('events')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Flagship Events (7)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('schedule')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Schedule Timeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectSection('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Coordinators & Helpdesk
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Flagship Events */}
          <div className="space-y-2">
            <div className="font-mono uppercase text-slate-200 text-xs tracking-wider font-semibold">
              Competitions
            </div>
            <ul className="space-y-1 text-xs">
              <li className="text-slate-400">1. Digital Treasure Hunt</li>
              <li className="text-slate-400">2. Tech Quiz</li>
              <li className="text-slate-400">3. Ideathon</li>
              <li className="text-slate-400">4. Gaming – Free Fire</li>
              <li className="text-slate-400">5. Minute to Win It</li>
              <li className="text-slate-400">6. Video Editing</li>
            </ul>
          </div>

          {/* Column 4: Organiser Access & Social */}
          <div className="space-y-3">
            <div className="font-mono uppercase text-slate-200 text-xs tracking-wider font-semibold">
              Administration
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Authorized coordinators can view attendee rosters, export registrations, or update event statuses.
            </p>
            <div>
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-mono transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} TECHNOTSAV 2026. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by React, Tailwind CSS & Supabase</span>
            <span>•</span>
            <span className="text-cyan-400/80 font-mono">v1.0 Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
