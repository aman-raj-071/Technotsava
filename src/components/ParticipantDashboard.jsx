import React, { useState } from 'react';
import { getAllRegistrations } from '../lib/db';
import { FEST_CONFIG } from '../data/festConfig';

/**
 * TECHNOTSAV 2026 - Participant Status Dashboard
 * Lets a registered participant look up their pass by Registration ID
 * (or USN / email), see verification status, and download/print the pass.
 */
export const ParticipantDashboard = ({ onBackToFest, onRegisterAnother }) => {
  const [regIdInput, setRegIdInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [foundRecord, setFoundRecord] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setSearchError('');
    setFoundRecord(null);
    setSearched(true);
    setLoading(true);

    const q = regIdInput.trim();
    if (!q) {
      setSearchError('Please enter your Registration ID.');
      setLoading(false);
      return;
    }

    const qLower = q.toLowerCase();

    try {
      const all = (await getAllRegistrations()) || [];

      // 1. Exact match on Registration ID
      let rec = all.find((x) => x.reg_id?.toLowerCase() === qLower);

      // 2. Fallback: match by any USN or leader email/phone
      if (!rec) {
        rec = all.find((x) => {
          const usns = (x.all_usns || []).map((u) => u.toLowerCase());
          const leaderUsn = (x.leader_usn || '').toLowerCase();
          const mail = (x.leader_email || '').toLowerCase();
          const phone = (x.leader_phone || '').replace(/[\s\-\(\)\+]/g, '');
          const qClean = q.replace(/[\s\-\(\)\+]/g, '');
          return (
            usns.includes(qLower) ||
            leaderUsn === qLower ||
            mail === qLower ||
            phone === qClean
          );
        });
      }

      if (rec) {
        setFoundRecord(rec);
      } else {
        setSearchError(
          `No registration found for "${q}". Please check your Registration ID and try again.`
        );
      }
    } catch (err) {
      console.error('Participant dashboard search error:', err);
      setSearchError('Something went wrong while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!foundRecord) return;
    try {
      const all = (await getAllRegistrations()) || [];
      const latest = all.find((r) => r.reg_id === foundRecord.reg_id);
      if (latest) setFoundRecord(latest);
    } catch (err) {
      console.error('Refresh status error:', err);
    }
  };

  const isVerified =
    foundRecord &&
    (foundRecord.status === 'confirmed' || foundRecord.status === 'completed');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBackToFest}
            className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-5 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Fest</span>
          </button>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {FEST_CONFIG.name}
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Participant Portal
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-tech font-extrabold text-white mb-2">
            🎫 Participant <span className="text-gradient-cyan">Dashboard</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            Enter your unique Registration ID to check your pass status, view your
            registration details, and download your verified entry pass.
          </p>
        </div>

        {/* Search Card */}
        <form
          onSubmit={handleSearch}
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/25 shadow-2xl mb-8"
        >
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
            Registration ID <span className="text-rose-400">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="e.g. TECH26-DTH-7842"
                value={regIdInput}
                onChange={(e) => setRegIdInput(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 text-sm font-mono uppercase focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:opacity-95 transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Check Status</span>
                </>
              )}
            </button>
          </div>

          {searchError && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>{searchError}</div>
            </div>
          )}

          <p className="text-[11px] text-slate-500 mt-3">
            Tip: You can also search by your USN or registered email / phone number.
          </p>
        </form>

        {/* Not found state */}
        {searched && !loading && !foundRecord && !searchError && (
          <div className="glass-panel rounded-3xl border border-slate-800 p-10 text-center">
            <div className="text-5xl mb-4">🔎</div>
            <h3 className="text-xl font-display font-bold text-white mb-2">
              No Record Found
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Could not find a registration with that ID. Double-check your
              Registration ID or register for an event.
            </p>
            <button
              onClick={onRegisterAnother}
              className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:opacity-95 transition-all text-sm"
            >
              Register for an Event →
            </button>
          </div>
        )}

        {/* Found record */}
        {foundRecord && (
          <div className="space-y-6">
            {/* Status banner */}
            <div
              className={`rounded-3xl p-6 border shadow-2xl ${
                isVerified
                  ? 'bg-emerald-950/40 border-emerald-500/40'
                  : 'bg-amber-950/40 border-amber-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span
                    className={`inline-block text-xs font-mono px-3 py-1 rounded-full border font-bold mb-2 ${
                      isVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                    }`}
                  >
                    {isVerified ? '✓ Pass Verified & Confirmed' : '⏳ Pending Admin Verification'}
                  </span>
                  <h2 className="text-xl font-display font-bold text-white">
                    Status:{' '}
                    <span className={isVerified ? 'text-emerald-400' : 'text-amber-400'}>
                      {(foundRecord.status || 'pending').toUpperCase()}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-2 max-w-lg">
                    {isVerified
                      ? '🎉 Your registration is confirmed by the TECHNOTSAV team. Your official entry pass is active and ready to download/print.'
                      : '⏳ Your registration is queued for admin verification. Once approved, your pass will become active. Check back later!'}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Registration ID
                  </div>
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-cyan-400 tracking-wider bg-slate-900/70 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                    {foundRecord.reg_id}
                  </div>
                </div>
              </div>
            </div>

            {/* Pass details card */}
            <div
              id="printable-pass"
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-500/20 pb-5 mb-6 gap-3">
                <div>
                  <div className="font-tech text-lg font-bold text-white tracking-wider flex items-center gap-2">
                    <span>TECHNOTSAV 2026</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
                      {isVerified ? 'OFFICIAL PASS' : 'UNVERIFIED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {FEST_CONFIG.collegeName}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Registration ID
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-extrabold text-cyan-400 tracking-wider">
                    {foundRecord.reg_id}
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 text-sm">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Event
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {foundRecord.event_name}
                  </div>
                </div>

                {foundRecord.team_name && (
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Team / Squad
                    </div>
                    <div className="text-base font-bold text-cyan-300 mt-0.5">
                      {foundRecord.team_name}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {foundRecord.team_name ? 'Team Leader / Primary Contact' : 'Participant Name'}
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    {foundRecord.leader_name}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    USN: {foundRecord.leader_usn}
                  </div>
                </div>

                {foundRecord.leader_phone && (
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Contact Phone
                    </div>
                    <div className="text-sm font-semibold text-slate-200 mt-0.5">
                      {foundRecord.leader_phone}
                    </div>
                    {foundRecord.leader_email && (
                      <div className="text-xs text-slate-400">{foundRecord.leader_email}</div>
                    )}
                  </div>
                )}

                {foundRecord.theme && (
                  <div className="sm:col-span-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-0.5">
                      Selected Ideathon Theme:
                    </span>
                    <span className="text-sm font-bold">{foundRecord.theme}</span>
                  </div>
                )}
              </div>

              {/* Members list */}
              {Array.isArray(foundRecord.members) && foundRecord.members.length > 0 && (
                <div className="mb-6 pt-4 border-t border-slate-800">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Registered Team Members ({foundRecord.members.length + 1} Total):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-cyan-400 font-semibold">1. {foundRecord.leader_name}</span>{' '}
                      (Leader)
                      <div className="text-slate-400 font-mono">USN: {foundRecord.leader_usn}</div>
                    </div>
                    {foundRecord.members.map((m, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-200 font-semibold">
                          {i + 2}. {m.name}
                        </span>
                        <div className="text-slate-400 font-mono">USN: {m.usn}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white p-1 rounded-lg flex flex-col justify-between shrink-0 shadow-inner">
                    <div className="flex justify-between">
                      <div className="w-4 h-4 bg-black"></div>
                      <div className="w-4 h-4 bg-black"></div>
                    </div>
                    <div className="flex justify-center items-center font-mono text-[6px] text-black font-extrabold">
                      {foundRecord.reg_id.slice(-4)}
                    </div>
                    <div className="flex justify-between">
                      <div className="w-4 h-4 bg-black"></div>
                      <div className="w-4 h-4 bg-black"></div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <div>Scan for verification at the event desk.</div>
                    <div className="font-mono text-slate-500 mt-0.5">
                      Registered: {new Date(foundRecord.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-medium text-xs border ${
                      isVerified
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {isVerified ? 'Confirmed & Active' : 'Pending Verification'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              {isVerified ? (
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-95 transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Download / Print Pass</span>
                </button>
              ) : (
                <button
                  onClick={handleRefresh}
                  className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:opacity-95 transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Verification Status</span>
                </button>
              )}

              <button
                onClick={onRegisterAnother}
                className="px-5 py-3 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors text-sm"
              >
                Register Another Event
              </button>

              <button
                onClick={onBackToFest}
                className="px-5 py-3 rounded-xl font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors text-sm"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
