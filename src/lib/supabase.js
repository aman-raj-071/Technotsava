// =========================================================================
// TECHNOTSAV 2026 - Supabase Client
// =========================================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Returns true when both env vars are present and look like real values.
 */
export const isSupabaseConfigured = () =>
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20 &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key');

if (!isSupabaseConfigured()) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing / placeholder. ' +
    'Running in localStorage-only mode.'
  );
}

/**
 * Singleton Supabase client.
 * Always defined — callers guard with isSupabaseConfigured() before use.
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    })
  : null;

// ── Startup connectivity ping ─────────────────────────────────────────────
// Runs once when the app loads; result visible in browser DevTools console.
if (supabase) {
  supabase
    .from('event_settings')
    .select('event_id', { count: 'exact', head: true })
    .then(({ error, count }) => {
      if (error) {
        console.error('[Supabase] ❌ Connection FAILED:', error.message, error.code);
      } else {
        console.log(`[Supabase] ✅ Connected — event_settings rows: ${count}`);
      }
    });
}
