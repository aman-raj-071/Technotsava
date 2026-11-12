import React from 'react';
import { FEST_CONFIG } from '../data/festConfig';

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
            <span>// Assistance & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-tech font-bold text-white mb-4">
            Contact <span className="text-gradient-cyan">Organisers</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Have questions regarding competition guidelines, registrations, accommodation or transport?
            Connect with our faculty coordinators and student conveners.
          </p>
        </div>

        {/* Coordinators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Faculty Coordinators */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">Faculty Advisory Lead</h3>
                <span className="text-xs font-mono text-cyan-400">Academic & Institutional Supervision</span>
              </div>
            </div>

            <div className="space-y-4">
              {FEST_CONFIG.coordinators.faculty.map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-white text-sm">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.designation}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{c.department}</div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <a
                      href={`tel:${c.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{c.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Conveners */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">Student Conveners</h3>
                <span className="text-xs font-mono text-purple-400">Operations & Participant Support</span>
              </div>
            </div>

            <div className="space-y-4">
              {FEST_CONFIG.coordinators.student.map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-white text-sm">{c.name}</div>
                    <div className="text-xs text-purple-300 font-mono">{c.role}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{c.branchYear}</div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <a
                      href={`tel:${c.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{c.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Fest Guidelines FAQ Cards */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-display font-bold text-white mb-6 text-center">
            Frequently Asked Questions & General Rules
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">Q.</span>
                <span>Is a college ID card required on fest day?</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Yes. Every registered participant must carry their official physical college ID card for identity verification at the helpdesk.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-purple-300 mb-1 flex items-center gap-2">
                <span className="text-purple-400 font-bold">Q.</span>
                <span>Can a student participate in multiple events?</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Yes, as long as event timings do not overlap according to the fest schedule. A separate registration must be submitted for each event.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-amber-300 mb-1 flex items-center gap-2">
                <span className="text-amber-400 font-bold">Q.</span>
                <span>Will participation certificates be issued?</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                All registered participants who report and compete will receive official verified E-certificates from the organizing department.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-2">
                <span className="text-emerald-400 font-bold">Q.</span>
                <span>How will winners receive their prizes?</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cash prizes, mementos, and medals will be awarded on-stage during the Grand Valedictory Ceremony at the Main Auditorium on Day 2.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
