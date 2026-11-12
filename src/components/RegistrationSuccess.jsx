import React from 'react';
import { FEST_CONFIG } from '../data/festConfig';

export const RegistrationSuccess = ({ record, onBackToEvents, onRegisterAnother }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(record.created_at).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
      <div className="max-w-2xl w-full">
        {/* Success Alert Banner */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white mb-2">
            Registration Confirmed!
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Your registration has been successfully recorded in the TECHNOTSAV 2026 database.
          </p>
        </div>

        {/* Printable Ticket Card */}
        <div
          id="printable-ticket"
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden mb-8"
        >
          {/* Top Decorative Tech Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-500/20 pb-5 mb-6 gap-3">
            <div>
              <div className="font-tech text-lg font-bold text-white tracking-wider flex items-center gap-2">
                <img src="/sjcit-logo.png" alt="SJCIT Logo" className="w-8 h-8 object-contain" />
                <span>TECHNOTSAV 2026</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
                  OFFICIAL PASS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{FEST_CONFIG.collegeName}</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Registration ID
              </div>
              <div className="text-lg sm:text-xl font-mono font-extrabold text-cyan-400 tracking-wider">
                {record.reg_id}
              </div>
            </div>
          </div>

          {/* Core Ticket Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 text-sm">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Event</div>
              <div className="text-base font-bold text-white mt-0.5">{record.event_name}</div>
            </div>

            {record.team_name && (
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Team Name</div>
                <div className="text-base font-bold text-cyan-300 mt-0.5">{record.team_name}</div>
              </div>
            )}

            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {record.team_name ? 'Team Leader / Primary Contact' : 'Participant Name'}
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">{record.leader_name}</div>
              <div className="text-xs font-mono text-slate-400">USN: {record.leader_usn}</div>
            </div>

            {record.leader_phone && (
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Contact Phone</div>
                <div className="text-sm font-semibold text-slate-200 mt-0.5">{record.leader_phone}</div>
                {record.leader_email && (
                  <div className="text-xs text-slate-400">{record.leader_email}</div>
                )}
              </div>
            )}

            {/* Ideathon Theme if present */}
            {record.theme && (
              <div className="sm:col-span-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-0.5">
                  Selected Ideathon Theme:
                </span>
                <span className="text-sm font-bold">{record.theme}</span>
              </div>
            )}
          </div>

          {/* Team Members List (if applicable) */}
          {Array.isArray(record.members) && record.members.length > 0 && (
            <div className="mb-6 pt-4 border-t border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Registered Team Members ({record.members.length + 1} Total):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-cyan-400 font-semibold">1. {record.leader_name}</span> (Leader)
                  <div className="text-slate-400 font-mono">USN: {record.leader_usn}</div>
                </div>
                {record.members.map((m, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-200 font-semibold">{i + 2}. {m.name}</span>
                    <div className="text-slate-400 font-mono">USN: {m.usn}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ticket Footer & Simulated QR Code */}
          <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              {/* QR Code representation */}
              <div className="w-14 h-14 bg-white p-1 rounded-lg flex flex-col justify-between shrink-0 shadow-inner">
                <div className="flex justify-between">
                  <div className="w-4 h-4 bg-black"></div>
                  <div className="w-4 h-4 bg-black"></div>
                </div>
                <div className="flex justify-center items-center font-mono text-[6px] text-black font-extrabold">
                  {record.reg_id.slice(-4)}
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 bg-black"></div>
                  <div className="w-4 h-4 bg-black"></div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                <div>Scan for verification at the event desk.</div>
                <div className="font-mono text-slate-500 mt-0.5">Registered: {formattedDate}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-medium text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Confirmed & Active
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print / Save Ticket</span>
          </button>

          <button
            onClick={onRegisterAnother}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Register for Another Event</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
