import React, { useState, useEffect } from 'react';
import {
  getAllRegistrations,
  deleteRegistration,
  getEventSettings,
  toggleEventStatus,
  exportRegistrationsToCSV
} from '../lib/db';
import { isSupabaseConfigured } from '../lib/supabase';
import { EVENTS } from '../data/eventsData';

export const AdminDashboard = ({ onBackToFest }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Data States
  const [registrations, setRegistrations] = useState([]);
  const [eventSettings, setEventSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Actions
  const [viewingRecord, setViewingRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const configuredPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'admin2026';

  // Check existing session
  useEffect(() => {
    const session = sessionStorage.getItem('technotsav_admin_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [regs, settings] = await Promise.all([
        getAllRegistrations(),
        getEventSettings()
      ]);
      setRegistrations(regs || []);
      setEventSettings(settings || {});
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if (passcode.trim() === configuredPasscode) {
      sessionStorage.setItem('technotsav_admin_session', 'authenticated');
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid Admin Passcode. Default is: admin2026');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('technotsav_admin_session');
    setIsAuthenticated(false);
    setPasscode('');
  };

  // Toggle Event Status (Enable/Disable registrations)
  const handleToggleEvent = async (eventId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const updated = await toggleEventStatus(eventId, newStatus);
      setEventSettings({ ...updated });
      setStatusMessage(`Event status updated.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Registration
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        const updated = await deleteRegistration(id);
        setRegistrations(updated);
        if (viewingRecord?.id === id) setViewingRecord(null);
        setStatusMessage('Registration deleted successfully.');
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csvContent = exportRegistrationsToCSV(filteredRegistrations);
    if (!csvContent) {
      alert('No registrations available to export.');
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TECHNOTSAV_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered and Searched Registrations
  const filteredRegistrations = registrations.filter((reg) => {
    // Event filter
    if (selectedEventFilter !== 'all' && reg.event_id !== selectedEventFilter) {
      return false;
    }

    // Search query filter (Reg ID, Team, Leader, Members, USNs)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchRegId = reg.reg_id?.toLowerCase().includes(q);
      const matchTeam = reg.team_name?.toLowerCase().includes(q);
      const matchLeader = reg.leader_name?.toLowerCase().includes(q);
      const matchUsn = (reg.all_usns || []).some((u) => u.toLowerCase().includes(q)) || reg.leader_usn?.toLowerCase().includes(q);
      const matchParticipants = (reg.all_participants || []).some((p) => p.toLowerCase().includes(q));
      const matchTheme = reg.theme?.toLowerCase().includes(q);

      return matchRegId || matchTeam || matchLeader || matchUsn || matchParticipants || matchTheme;
    }

    return true;
  });

  // Calculate stats
  const totalCount = registrations.length;
  const eventCounts = {};
  EVENTS.forEach((ev) => {
    eventCounts[ev.id] = registrations.filter((r) => r.event_id === ev.id).length;
  });

  // ========================================================
  // LOGIN SCREEN (IF NOT AUTHENTICATED)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 text-purple-400">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-tech font-bold text-white">Admin Authentication</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter the secure fest coordinator passcode to access private registration records.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Passcode (Default: <code className="text-cyan-400">admin2026</code>)
              </label>
              <input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-400 text-white placeholder-slate-500 text-sm focus:outline-none"
              />
              {authError && <p className="text-xs text-rose-400 mt-1.5">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition-opacity text-sm shadow-lg shadow-purple-500/20"
            >
              Unlock Dashboard
            </button>

            <button
              type="button"
              onClick={onBackToFest}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to TECHNOTSAV Public Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ========================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ========================================================
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Live Organiser Portal
              </span>
              <span
                className={`text-xs font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isSupabaseConfigured()
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {isSupabaseConfigured() ? 'Supabase Cloud Connected' : 'Local Persistence Mode'}
              </span>
            </div>
            <h1 className="text-3xl font-tech font-extrabold text-white mt-1">
              TECHNOTSAV 2026 <span className="text-gradient-purple">Admin Suite</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              title="Refresh Data"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 rounded-lg transition-opacity flex items-center gap-1.5 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded-lg transition-colors"
            >
              Log Out
            </button>

            <button
              onClick={onBackToFest}
              className="px-3.5 py-2 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-colors"
            >
              Back to Fest
            </button>
          </div>
        </div>

        {/* Status Toast Notification */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between animate-in fade-in">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="text-cyan-400 font-bold">×</button>
          </div>
        )}

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-700/60">
            <div className="text-xs font-mono uppercase text-slate-400">Total Registrations</div>
            <div className="text-3xl font-tech font-bold text-white mt-1">{totalCount}</div>
            <div className="text-[11px] text-cyan-400 mt-1">Across all 6 events</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-700/60">
            <div className="text-xs font-mono uppercase text-slate-400">Most Popular Event</div>
            <div className="text-lg font-bold text-white mt-1 truncate">
              {Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0]?.[1] > 0
                ? EVENTS.find((e) => e.id === Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0][0])?.name
                : 'None yet'}
            </div>
            <div className="text-[11px] text-purple-400 mt-1">Top candidate volume</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-700/60">
            <div className="text-xs font-mono uppercase text-slate-400">Active Competitions</div>
            <div className="text-3xl font-tech font-bold text-white mt-1">
              {Object.values(eventSettings).filter((v) => v !== false).length} / 6
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">Accepting submissions</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-700/60">
            <div className="text-xs font-mono uppercase text-slate-400">Filtered View</div>
            <div className="text-3xl font-tech font-bold text-white mt-1">
              {filteredRegistrations.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Matching criteria</div>
          </div>
        </div>

        {/* Event-Wise Registration Counts & Registration Toggles */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-bold text-white">
              Event Registration Status & Quotas
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Toggle switch to open/close event forms in real-time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EVENTS.map((ev) => {
              const count = eventCounts[ev.id] || 0;
              const isActive = eventSettings[ev.id] !== false;

              return (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-white truncate max-w-[170px]">
                      {ev.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      <span className="text-cyan-400 font-bold">{count}</span> registrations
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleEvent(ev.id, isActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{isActive ? 'Open' : 'Closed'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search & Event Filter Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
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
                placeholder="Search by Team Name, Participant, USN, or Reg ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Event Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedEventFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedEventFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Events ({totalCount})
            </button>
            {EVENTS.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEventFilter(ev.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  selectedEventFilter === ev.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {ev.name} ({eventCounts[ev.id] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Registrations Table */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <svg className="animate-spin w-6 h-6 mx-auto mb-2 text-cyan-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Loading registrations...</span>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <p className="text-base font-semibold text-slate-300">No Registrations Found</p>
              <p className="text-xs">
                {searchQuery || selectedEventFilter !== 'all'
                  ? 'Try modifying your search or clearing the active event filter.'
                  : 'Registrations submitted through the website will appear here in real time.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Reg ID</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Team / Participant</th>
                    <th className="py-3 px-4">Leader / Contact</th>
                    <th className="py-3 px-4">Members</th>
                    <th className="py-3 px-4">Registered At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                        {reg.reg_id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div>{reg.event_name}</div>
                        {reg.theme && (
                          <span className="text-[10px] text-amber-400 block font-mono truncate max-w-[150px]">
                            {reg.theme}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {reg.team_name || reg.leader_name}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium">{reg.leader_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          USN: {reg.leader_usn}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {1 + (Array.isArray(reg.members) ? reg.members.length : 0)} pax
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setViewingRecord(reg)}
                          className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 font-mono text-[11px]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(reg.id)}
                          disabled={deletingId === reg.id}
                          className="px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60 font-mono text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Record Details Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative">
            <button
              onClick={() => setViewingRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {viewingRecord.reg_id}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Confirmed
              </span>
            </div>

            <h3 className="text-xl font-display font-bold text-white mb-1">
              {viewingRecord.event_name}
            </h3>
            {viewingRecord.team_name && (
              <p className="text-sm font-semibold text-cyan-300 mb-4">
                Team: {viewingRecord.team_name}
              </p>
            )}

            {/* Ideathon Theme */}
            {viewingRecord.theme && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <span className="font-mono uppercase text-amber-400 block mb-0.5">Ideathon Theme:</span>
                <span className="font-bold">{viewingRecord.theme}</span>
              </div>
            )}

            {/* Leader Details */}
            <div className="mb-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="font-mono uppercase text-cyan-400 font-semibold mb-1">
                Leader / Primary Contact:
              </div>
              <div className="text-white font-medium text-sm">{viewingRecord.leader_name}</div>
              <div className="text-slate-300 font-mono">USN: {viewingRecord.leader_usn}</div>
              {viewingRecord.leader_phone && (
                <div className="text-slate-300">Phone: {viewingRecord.leader_phone}</div>
              )}
              {viewingRecord.leader_email && (
                <div className="text-slate-300">Email: {viewingRecord.leader_email}</div>
              )}
            </div>

            {/* Members List */}
            {Array.isArray(viewingRecord.members) && viewingRecord.members.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-mono uppercase text-slate-400 mb-2">
                  Additional Team Members ({viewingRecord.members.length}):
                </div>
                <div className="space-y-2">
                  {viewingRecord.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="text-white font-medium">{idx + 2}. {m.name}</span>
                      <span className="text-slate-400 font-mono">USN: {m.usn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-500 font-mono">
                Registered: {new Date(viewingRecord.created_at).toLocaleString()}
              </span>
              <button
                onClick={() => handleDelete(viewingRecord.id)}
                className="px-3 py-1.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 font-mono"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
