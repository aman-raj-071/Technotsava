// =========================================================================
// TECHNOTSAV 2026 - Unified Database Service Layer
// =========================================================================
// Automatically talks to Supabase Cloud Database when configured.
// Falls back to persistent browser storage if Supabase credentials
// have not yet been provided, guaranteeing 100% operational functionality.
// =========================================================================

import { supabase, isSupabaseConfigured } from './supabase';
import { EVENTS } from '../data/eventsData';

const LOCAL_STORAGE_KEY = 'technotsav_2026_registrations';
const EVENT_STATUS_KEY = 'technotsav_2026_event_settings';

/**
 * Generate a unique, professional registration ID
 * e.g., TECH26-DTH-7842
 */
export const generateRegId = (eventCode) => {
  const prefix = `TECH26-${eventCode || 'REG'}`;
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
};

/**
 * Get initial event settings (all active by default)
 */
export const getEventSettings = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('event_settings')
        .select('*');
      if (!error && data && data.length > 0) {
        const settingsMap = {};
        data.forEach(item => {
          settingsMap[item.event_id] = item.is_active;
        });
        return settingsMap;
      }
    } catch (err) {
      console.warn('Supabase fetch event settings error, falling back:', err);
    }
  }

  // Local storage fallback
  try {
    const raw = localStorage.getItem(EVENT_STATUS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }

  // Default: all enabled
  const defaults = {};
  EVENTS.forEach(ev => {
    defaults[ev.id] = true;
  });
  return defaults;
};

/**
 * Toggle event registration status (Enable / Disable)
 */
export const toggleEventStatus = async (eventId, isActive) => {
  // Update local storage
  const current = await getEventSettings();
  current[eventId] = isActive;
  localStorage.setItem(EVENT_STATUS_KEY, JSON.stringify(current));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase
        .from('event_settings')
        .upsert({
          event_id: eventId,
          is_active: isActive,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('Supabase update event status error:', err);
    }
  }

  return current;
};

/**
 * Save a new registration
 */
export const saveRegistration = async (formData, event) => {
  const regId = generateRegId(event.code);
  const now = new Date().toISOString();

  // Consolidate participant names and USNs for searchability
  const allParticipants = [];
  const allUsns = [];

  if (event.type === 'individual') {
    allParticipants.push(formData.participantName);
    allUsns.push(formData.usn?.toUpperCase());
  } else if (event.type === 'pair') {
    allParticipants.push(formData.member1Name, formData.member2Name);
    allUsns.push(formData.member1Usn?.toUpperCase(), formData.member2Usn?.toUpperCase());
  } else {
    // Team events
    allParticipants.push(formData.leaderName);
    allUsns.push(formData.leaderUsn?.toUpperCase());
    if (Array.isArray(formData.members)) {
      formData.members.forEach(m => {
        if (m.name) allParticipants.push(m.name);
        if (m.usn) allUsns.push(m.usn.toUpperCase());
      });
    }
  }

  const record = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`,
    reg_id: regId,
    event_id: event.id,
    event_name: event.name,
    team_name: formData.teamName || (event.type === 'individual' ? null : 'Solo / Pair'),
    leader_name: formData.leaderName || formData.participantName || formData.member1Name,
    leader_usn: (formData.leaderUsn || formData.usn || formData.member1Usn || '').toUpperCase(),
    leader_email: formData.leaderEmail || formData.email || null,
    leader_phone: formData.leaderPhone || formData.member1Phone || formData.phone || null,
    members: event.type === 'individual' ? [] : (formData.members || [
      ...(formData.member2Name ? [{ name: formData.member2Name, usn: formData.member2Usn?.toUpperCase(), phone: formData.member2Phone }] : [])
    ]),
    all_participants: allParticipants.filter(Boolean),
    all_usns: allUsns.filter(Boolean),
    theme: formData.theme || null,
    status: 'confirmed',
    created_at: now
  };

  // If Supabase is active, persist to Supabase
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('registrations')
      .insert([record])
      .select();

    if (error) {
      console.error('Supabase registration insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Always mirror to localStorage as backup/offline access
  try {
    const existing = getLocalRegistrations();
    existing.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('LocalStorage mirror error:', e);
  }

  return record;
};

/**
 * Helper to get local registrations
 */
const getLocalRegistrations = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading localStorage:', e);
    return [];
  }
};

/**
 * Fetch all registrations (with event filtering & search)
 */
export const getAllRegistrations = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
      console.warn('Supabase fetch failed, falling back to local records:', error);
    } catch (err) {
      console.warn('Supabase connection error:', err);
    }
  }

  // Local storage fallback
  return getLocalRegistrations();
};

/**
 * Delete a registration
 */
export const deleteRegistration = async (id) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
      }
    } catch (err) {
      console.error('Supabase delete failed:', err);
    }
  }

  // Update local storage
  try {
    const existing = getLocalRegistrations();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * Export registrations to CSV string
 */
export const exportRegistrationsToCSV = (registrations) => {
  if (!registrations || registrations.length === 0) return '';

  const headers = [
    'Registration ID',
    'Event Name',
    'Team Name',
    'Primary Contact / Leader Name',
    'Leader USN',
    'Email Address',
    'Phone Number',
    'Total Members',
    'All Participants',
    'All USNs',
    'Ideathon Theme',
    'Status',
    'Registration Date (UTC)'
  ];

  const rows = registrations.map(reg => {
    const totalMembers = 1 + (Array.isArray(reg.members) ? reg.members.length : 0);
    const participantList = (reg.all_participants || []).join('; ');
    const usnList = (reg.all_usns || []).join('; ');

    return [
      reg.reg_id || '',
      reg.event_name || '',
      reg.team_name || 'N/A (Individual)',
      reg.leader_name || '',
      reg.leader_usn || '',
      reg.leader_email || 'N/A',
      reg.leader_phone || 'N/A',
      totalMembers,
      `"${participantList.replace(/"/g, '""')}"`,
      `"${usnList.replace(/"/g, '""')}"`,
      reg.theme || 'N/A',
      reg.status || 'confirmed',
      reg.created_at || ''
    ];
  });

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};
