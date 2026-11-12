import React, { useState, useEffect } from 'react';
import { FEST_CONFIG } from '../data/festConfig';

export const Navbar = ({ onOpenAdmin, onSelectEvent, currentView, onGoHome, onOpenParticipant }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      onGoHome();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-[#060813]/90 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <img src="/sjcit-logo.png" alt="SJCIT Logo" className="w-10 h-10 rounded-xl object-contain transition-transform duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(56,189,248,0.4)]" />
            <div>
              <div className="font-tech font-extrabold text-xl tracking-wider text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <span>TECHNOTSAV</span>
                <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-widest font-mono uppercase">
                Think • Create • Compete
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNavClick('hero')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
            >
              Events (6)
            </button>
            <button
              onClick={() => handleNavClick('schedule')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
            >
              Schedule
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
            >
              Contact
            </button>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Participant Status Button */}
            <button
              onClick={onOpenParticipant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400/60 rounded-lg transition-all shadow-sm"
              title="Check your registration status & download your pass"
            >
              <svg
                className="w-3.5 h-3.5 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Check Status</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400/60 rounded-lg transition-all shadow-sm"
              title="Secure Organiser Management Portal"
            >
              <svg
                className="w-3.5 h-3.5 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Admin Portal</span>
            </button>

            {/* Quick Register CTA */}
            <button
              onClick={() => handleNavClick('events')}
              className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-300 rounded-lg overflow-hidden group shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-all duration-300 group-hover:opacity-90"></span>
              <span className="relative flex items-center gap-1.5 text-slate-950 font-bold">
                <span>Register Now</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenParticipant}
              className="p-2 text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 rounded-lg"
              title="Check Status - Download Your Pass"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              onClick={onOpenAdmin}
              className="p-2 text-purple-400 bg-purple-950/40 border border-purple-500/30 rounded-lg"
              title="Admin Portal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/60 rounded-lg"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0e1f]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-4 pt-3 pb-6 mt-2 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('hero')}
            className="block w-full text-left px-3 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left px-3 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
          >
            About TECHNOTSAV
          </button>
          <button
            onClick={() => handleNavClick('events')}
            className="block w-full text-left px-3 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
          >
            All Events (6)
          </button>
          <button
            onClick={() => handleNavClick('schedule')}
            className="block w-full text-left px-3 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
          >
            Fest Schedule
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left px-3 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
          >
            Contact Organisers
          </button>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenParticipant();
              }}
              className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 rounded-lg"
            >
              Check Registration Status
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-purple-300 bg-purple-950/50 border border-purple-500/30 rounded-lg"
            >
              Admin Portal
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className="flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-lg shadow-lg"
            >
              Register For Events
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
