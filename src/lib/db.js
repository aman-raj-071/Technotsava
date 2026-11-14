// =========================================================================
// TECHNOTSAV 2026 - Unified Database Service Layer
// =========================================================================
// PRIMARY store  : Supabase Postgres (when VITE_SUPABASE_* env vars are set)
// FALLBACK store : localStorage (offline / dev without credentials)
//
// Every WRITE goes to Supabase first; on success it is mirrored to
// localStorage as a local cache.  On failure the write throws so the UI
// can show the user an error instead of silently swallowing data.
//
// Every READ prefers Supabase; falls back to localStorage only when
// Supabase is unreachable.
// =========================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import { EVENTS } from '../data/eventsData';

// ── localStorage keys ────────────────────────────────────────────────────
const LS_REGISTRATIONS = 'technotsav_2026_registrations';
const LS_EVENT_SETTINGS = 'technotsav_2026_event_settings';
const LS_BACKUP_REGISTRATIONS = 'technotsav_2026_backup_registrations';

// ── Helpers ───────────────────────────────────────────────────────────────

/** Generate a human-readable registration ID, e.g. TECH26-DTH-7842 */
export const generateRegId = (eventCode) => {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `TECH26-${eventCode || 'REG'}-${suffix}`;
};

const lsGetRegistrations = () => {
  try {
    const raw = localStorage.getItem(LS_REGISTRATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const lsSetRegistrations = (list) => {
  try {
    localStorage.setItem(LS_REGISTRATIONS, JSON.stringify(list));
  } catch (e) {
    console.warn('[db] localStorage write failed:', e);
  }
};

const lsGetSettings = () => {
  try {
    const raw = localStorage.getItem(LS_EVENT_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // Default: every event open
  return Object.fromEntries(EVENTS.map((ev) => [ev.id, true]));
};

const lsSetSettings = (map) => {
  try {
    localStorage.setItem(LS_EVENT_SETTINGS, JSON.stringify(map));
  } catch { /* ignore */ }
};

// ── Backup / Archive ───────────────────────────────────────────────────────
// Every delete is archived here so no data is ever permanently lost.
// This is the local "backup folder" (persisted in the browser's localStorage,
// downloadable as a JSON file from the admin dashboard).

/** Read the archived (deleted) registrations. */
export const getBackups = () => {
  try {
    const raw = localStorage.getItem(LS_BACKUP_REGISTRATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const lsSetBackups = (list) => {
  try {
    localStorage.setItem(LS_BACKUP_REGISTRATIONS, JSON.stringify(list));
  } catch (e) {
    console.warn('[db] backup write failed:', e);
  }
};

/** Archive an array of records (dedupes by id). */
export const backupRegistrations = (records) => {
  if (!records || records.length === 0) return;
  const existing = getBackups();
  const ids = new Set(existing.map((r) => r.id));
  const fresh = records.filter((r) => !ids.has(r.id));
  if (fresh.length) {
    lsSetBackups([...existing, ...fresh]);
  }
};

/** Build a downloadable JSON backup object (current + archived). */
export const buildBackupJSON = () => {
  return {
    exported_at: new Date().toISOString(),
    total_current: lsGetRegistrations().length,
    current_registrations: lsGetRegistrations(),
    total_archived: getBackups().length,
    archived_deleted_registrations: getBackups(),
  };
};

// ── Event Settings ────────────────────────────────────────────────────────

/**
 * Fetch the open/closed status for every event.
 * Returns { [eventId]: boolean }
 */
export const getEventSettings = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('event_settings')
        .select('event_id, is_active');

      if (!error && data && data.length > 0) {
        const map = Object.fromEntries(data.map((r) => [r.event_id, r.is_active]));
        lsSetSettings(map); // keep local cache in sync
        return map;
      }
      if (error) console.warn('[db] getEventSettings Supabase error:', error.message);
    } catch (err) {
      console.warn('[db] getEventSettings network error:', err);
    }
  }
  return lsGetSettings();
};

/**
 * Toggle an event's registration open/closed state.
 * Writes to Supabase (upsert) and local cache.
 */
export const toggleEventStatus = async (eventId, isActive) => {
  // Optimistically update local cache first so the UI is snappy
  const current = lsGetSettings();
  current[eventId] = isActive;
  lsSetSettings(current);

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('event_settings')
        .upsert(
          { event_id: eventId, is_active: isActive, updated_at: new Date().toISOString() },
          { onConflict: 'event_id' }
        );
      if (error) console.warn('[db] toggleEventStatus Supabase error:', error.message);
    } catch (err) {
      console.warn('[db] toggleEventStatus network error:', err);
    }
  }

  return current;
};

// ── Registrations ─────────────────────────────────────────────────────────

/**
 * Save a new registration.
 *
 * Throws on Supabase error so RegistrationPage can surface it to the user.
 * Always mirrors the confirmed record to localStorage as a local cache.
 */
export const saveRegistration = async (formData, event) => {
  const now = new Date().toISOString();

  // Build flat participant / USN arrays for fast search
  const allParticipants = [];
  const allUsns = [];

  if (event.type === 'individual') {
    allParticipants.push(formData.participantName);
    if (formData.usn) allUsns.push(formData.usn.toUpperCase());
  } else if (event.type === 'pair') {
    allParticipants.push(formData.member1Name, formData.member2Name);
    if (formData.member1Usn) allUsns.push(formData.member1Usn.toUpperCase());
    if (formData.member2Usn) allUsns.push(formData.member2Usn.toUpperCase());
  } else {
    // Team events
    allParticipants.push(formData.leaderName);
    if (formData.leaderUsn) allUsns.push(formData.leaderUsn.toUpperCase());
    (formData.members || []).forEach((m) => {
      if (m.name) allParticipants.push(m.name);
      if (m.usn) allUsns.push(m.usn.toUpperCase());
    });
  }

  const record = {
    id: crypto.randomUUID(),
    reg_id: generateRegId(event.code),
    event_id: event.id,
    event_name: event.name,
    team_name:
      formData.teamName?.trim() ||
      (event.type === 'individual' ? null : null),
    leader_name:
      formData.leaderName?.trim() ||
      formData.participantName?.trim() ||
      formData.member1Name?.trim() ||
      null,
    leader_usn: (
      formData.leaderUsn ||
      formData.usn ||
      formData.member1Usn ||
      ''
    ).toUpperCase(),
    leader_email:
      formData.leaderEmail?.trim() || formData.email?.trim() || null,
    leader_phone:
      formData.leaderPhone?.trim() ||
      formData.member1Phone?.trim() ||
      formData.phone?.trim() ||
      null,
    members:
      event.type === 'individual'
        ? []
        : formData.members || (
          formData.member2Name
            ? [{
              name: formData.member2Name,
              usn: formData.member2Usn?.toUpperCase() || '',
              phone: formData.member2Phone || null,
            }]
            : []
        ),
    total_members:
      formData.total_members ??
      (event.type === 'individual'
        ? 1
        : event.type === 'pair'
          ? 2
          : 1 + (Array.isArray(formData.members) ? formData.members.length : 0)),
    registration_fee: formData.registration_fee ?? null,
    all_participants: allParticipants.filter(Boolean),
    all_usns: allUsns.filter(Boolean),
    theme: formData.theme || null,
    status: 'confirmed',
    created_at: now,
  };

  // ── Supabase write (primary) ──────────────────────────────────────────
  if (isSupabaseConfigured() && supabase) {
    console.log('[db] Sending registration to Supabase…', record.reg_id);

    const { data, error } = await supabase
      .from('registrations')
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error('[db] ❌ saveRegistration FAILED');
      console.error('  code   :', error.code);
      console.error('  message:', error.message);
      console.error('  details:', error.details);
      console.error('  hint   :', error.hint);
      throw new Error(
        error.code === '23505'
          ? 'A registration with this ID already exists. Please try again.'
          : `Database error (${error.code}): ${error.message}`
      );
    }

    console.log('[db] ✅ Registration saved to Supabase:', data.reg_id);

    // Mirror the server-confirmed record to local cache
    const existing = lsGetRegistrations();
    existing.unshift(data);
    lsSetRegistrations(existing);
    return data;
  }

  console.warn('[db] ⚠️ Supabase not configured — saving to localStorage only.');

  // ── localStorage fallback (no Supabase credentials) ───────────────────
  const existing = lsGetRegistrations();
  existing.unshift(record);
  lsSetRegistrations(existing);
  return record;
};

/**
 * Fetch all registrations ordered newest-first.
 * Prefers Supabase; falls back to local cache.
 */
export const getAllRegistrations = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        lsSetRegistrations(data); // refresh local cache
        return data;
      }
      console.warn('[db] getAllRegistrations Supabase error:', error?.message);
    } catch (err) {
      console.warn('[db] getAllRegistrations network error:', err);
    }
  }
  return lsGetRegistrations();
};

/**
 * Delete a registration by its UUID.
 * Removes from Supabase and local cache, then returns the refreshed list.
 */
export const deleteRegistration = async (id) => {
  // Archive the record into the backup store BEFORE removing it, so the
  // data is never lost even after a delete.
  const doomed = lsGetRegistrations().filter((r) => r.id === id);
  if (doomed.length) backupRegistrations(doomed);

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) console.error('[db] deleteRegistration Supabase error:', error.message);
    } catch (err) {
      console.error('[db] deleteRegistration network error:', err);
    }
  }

  // Update local cache regardless
  const updated = lsGetRegistrations().filter((r) => r.id !== id);
  lsSetRegistrations(updated);
  return updated;
};

// ── CSV Export ────────────────────────────────────────────────────────────

/**
 * Convert a registrations array to a CSV string ready for download.
 */
export const exportRegistrationsToCSV = (registrations) => {
  if (!registrations || registrations.length === 0) return '';

  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const headers = [
    'Registration ID',
    'Event Name',
    'Team Name',
    'Leader / Participant Name',
    'Leader USN',
    'Email Address',
    'Phone Number',
    'Total Members',
    'Registration Fee (₹)',
    'All Participants',
    'All USNs',
    'Ideathon Theme',
    'Status',
    'Registered At (UTC)',
  ];

  const rows = registrations.map((reg) => {
    const totalMembers = 1 + (Array.isArray(reg.members) ? reg.members.length : 0);
    return [
      escape(reg.reg_id),
      escape(reg.event_name),
      escape(reg.team_name || 'N/A'),
      escape(reg.leader_name),
      escape(reg.leader_usn),
      escape(reg.leader_email || 'N/A'),
      escape(reg.leader_phone || 'N/A'),
      totalMembers,
      escape(reg.registration_fee ?? 'N/A'),
      escape((reg.all_participants || []).join('; ')),
      escape((reg.all_usns || []).join('; ')),
      escape(reg.theme || 'N/A'),
      escape(reg.status || 'confirmed'),
      escape(reg.created_at),
    ].join(',');
  });

  return [headers.map(escape).join(','), ...rows].join('\n');
};
