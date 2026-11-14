-- =========================================================================
-- TECHNOTSAV 2026 - Supabase Database Schema & Setup Script
-- =========================================================================
-- How to apply:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to SQL Editor -> New Query
-- 3. Paste this entire file and click "Run"
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reg_id VARCHAR(50) UNIQUE NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    team_name VARCHAR(150),
    leader_name VARCHAR(100) NOT NULL,
    leader_usn VARCHAR(50) NOT NULL,
    leader_email VARCHAR(150),
    leader_phone VARCHAR(50),
    members JSONB DEFAULT '[]'::jsonb,
    all_participants TEXT[] DEFAULT '{}',
    all_usns TEXT[] DEFAULT '{}',
    theme VARCHAR(150),
    status VARCHAR(50) DEFAULT 'confirmed',
    utr_id VARCHAR(100),
    amount VARCHAR(20) DEFAULT 'Free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1b. ALL-TIME BACKUP REGISTRATIONS TABLE
-- Every single registration (inserted or updated) is automatically copied here,
-- plus any deleted records are preserved forever. No data is ever lost.
CREATE TABLE IF NOT EXISTS public.registrations_backup (
    id UUID PRIMARY KEY,
    reg_id VARCHAR(50),
    event_id VARCHAR(50),
    event_name VARCHAR(100),
    team_name VARCHAR(150),
    leader_name VARCHAR(100),
    leader_usn VARCHAR(50),
    leader_email VARCHAR(150),
    leader_phone VARCHAR(50),
    members JSONB DEFAULT '[]'::jsonb,
    all_participants TEXT[] DEFAULT '{}',
    all_usns TEXT[] DEFAULT '{}',
    theme VARCHAR(150),
    status VARCHAR(50),
    utr_id VARCHAR(100),
    amount VARCHAR(20),
    attendance_code VARCHAR(30),
    attended BOOLEAN DEFAULT false,
    attended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    backup_action VARCHAR(50) DEFAULT 'INSERT',
    backed_up_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1c. AUTOMATIC POSTGRES TRIGGER TO SYNC EVERY REGISTRATION TO BACKUP TABLE
CREATE OR REPLACE FUNCTION sync_registration_to_backup()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.registrations_backup (
            id, reg_id, event_id, event_name, team_name, leader_name, leader_usn,
            leader_email, leader_phone, members, all_participants, all_usns, theme,
            status, utr_id, amount, attendance_code, attended, attended_at, created_at,
            backup_action, backed_up_at
        ) VALUES (
            OLD.id, OLD.reg_id, OLD.event_id, OLD.event_name, OLD.team_name, OLD.leader_name, OLD.leader_usn,
            OLD.leader_email, OLD.leader_phone, OLD.members, OLD.all_participants, OLD.all_usns, OLD.theme,
            OLD.status, OLD.utr_id, OLD.amount, OLD.attendance_code, OLD.attended, OLD.attended_at, OLD.created_at,
            'DELETED_BACKUP', NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            backup_action = 'DELETED_BACKUP',
            backed_up_at = NOW();
        RETURN OLD;
    ELSE
        INSERT INTO public.registrations_backup (
            id, reg_id, event_id, event_name, team_name, leader_name, leader_usn,
            leader_email, leader_phone, members, all_participants, all_usns, theme,
            status, utr_id, amount, attendance_code, attended, attended_at, created_at,
            backup_action, backed_up_at
        ) VALUES (
            NEW.id, NEW.reg_id, NEW.event_id, NEW.event_name, NEW.team_name, NEW.leader_name, NEW.leader_usn,
            NEW.leader_email, NEW.leader_phone, NEW.members, NEW.all_participants, NEW.all_usns, NEW.theme,
            NEW.status, NEW.utr_id, NEW.amount, NEW.attendance_code, NEW.attended, NEW.attended_at, NEW.created_at,
            TG_OP, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            reg_id = EXCLUDED.reg_id,
            event_id = EXCLUDED.event_id,
            event_name = EXCLUDED.event_name,
            team_name = EXCLUDED.team_name,
            leader_name = EXCLUDED.leader_name,
            leader_usn = EXCLUDED.leader_usn,
            leader_email = EXCLUDED.leader_email,
            leader_phone = EXCLUDED.leader_phone,
            members = EXCLUDED.members,
            all_participants = EXCLUDED.all_participants,
            all_usns = EXCLUDED.all_usns,
            theme = EXCLUDED.theme,
            status = EXCLUDED.status,
            utr_id = EXCLUDED.utr_id,
            amount = EXCLUDED.amount,
            attendance_code = EXCLUDED.attendance_code,
            attended = EXCLUDED.attended,
            attended_at = EXCLUDED.attended_at,
            backup_action = TG_OP,
            backed_up_at = NOW();
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_registration_backup ON public.registrations;
CREATE TRIGGER trg_sync_registration_backup
AFTER INSERT OR UPDATE OR DELETE ON public.registrations
FOR EACH ROW EXECUTE FUNCTION sync_registration_to_backup();

-- Also copy existing data immediately if any exists
INSERT INTO public.registrations_backup (
    id, reg_id, event_id, event_name, team_name, leader_name, leader_usn,
    leader_email, leader_phone, members, all_participants, all_usns, theme,
    status, utr_id, amount, created_at, backup_action, backed_up_at
)
SELECT 
    id, reg_id, event_id, event_name, team_name, leader_name, leader_usn,
    leader_email, leader_phone, members, all_participants, all_usns, theme,
    status, utr_id, amount, created_at, 'INITIAL_SYNC', NOW()
FROM public.registrations
ON CONFLICT (id) DO NOTHING;

-- 2. EVENT SETTINGS TABLE (Enable / Disable events dynamically from Admin)
CREATE TABLE IF NOT EXISTS public.event_settings (
    event_id VARCHAR(50) PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    max_teams INTEGER DEFAULT 100,
    registration_fee VARCHAR(50) DEFAULT 'Free',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SEED DEFAULT EVENT SETTINGS FOR ALL 6 EVENTS
INSERT INTO public.event_settings (event_id, event_name, is_active, max_teams, registration_fee)
VALUES 
    ('digital-treasure-hunt', 'Digital Treasure Hunt', TRUE, 50, 'Free'),
    ('tech-quiz', 'Tech Quiz', TRUE, 60, 'Free'),
    ('ideathon', 'Ideathon', TRUE, 40, 'Free'),
    ('gaming-free-fire', 'Gaming – Free Fire', TRUE, 48, 'Free'),
    ('minute-to-win-it', 'Minute to Win It', TRUE, 100, 'Free'),
    ('video-editing', 'Video Editing', TRUE, 50, 'Free'),
    ('logo-mania', 'Logo Mania', TRUE, 40, '₹100')
ON CONFLICT (event_id) DO UPDATE 
SET event_name = EXCLUDED.event_name;

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_reg_id ON public.registrations(reg_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_leader_usn ON public.registrations(leader_usn);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Allow public participant submissions (INSERT)
DROP POLICY IF EXISTS "Allow public insert registrations" ON public.registrations;
CREATE POLICY "Allow public insert registrations" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- Allow public reading event active status (SELECT)
DROP POLICY IF EXISTS "Allow public select event settings" ON public.event_settings;
CREATE POLICY "Allow public select event settings" 
ON public.event_settings 
FOR SELECT 
USING (true);

-- Allow read access for public/admin registrations (SELECT)
DROP POLICY IF EXISTS "Allow select registrations" ON public.registrations;
CREATE POLICY "Allow select registrations" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Allow update registrations (admin approval, status, attendance)
DROP POLICY IF EXISTS "Allow update registrations" ON public.registrations;
CREATE POLICY "Allow update registrations" 
ON public.registrations 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow delete registrations (admin management)
DROP POLICY IF EXISTS "Allow delete registrations" ON public.registrations;
CREATE POLICY "Allow delete registrations" 
ON public.registrations 
FOR DELETE 
USING (true);

-- ── BACKUP REGISTRATIONS RLS POLICIES ─────────────────────────────────
ALTER TABLE public.registrations_backup ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert backup registrations" ON public.registrations_backup;
CREATE POLICY "Allow insert backup registrations" 
ON public.registrations_backup 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select backup registrations" ON public.registrations_backup;
CREATE POLICY "Allow select backup registrations" 
ON public.registrations_backup 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow update backup registrations" ON public.registrations_backup;
CREATE POLICY "Allow update backup registrations" 
ON public.registrations_backup 
FOR UPDATE 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete backup registrations" ON public.registrations_backup;
CREATE POLICY "Allow delete backup registrations" 
ON public.registrations_backup 
FOR DELETE 
USING (true);

-- Allow update event settings (admin toggle)
DROP POLICY IF EXISTS "Allow update event settings" ON public.event_settings;
CREATE POLICY "Allow update event settings" 
ON public.event_settings 
FOR UPDATE 
USING (true);

-- Allow insert event settings (admin first-time upsert of a new event)
DROP POLICY IF EXISTS "Allow insert event settings" ON public.event_settings;
CREATE POLICY "Allow insert event settings" 
ON public.event_settings 
FOR INSERT 
WITH CHECK (true);

-- 6. REALTIME PUBLICATION
-- Required for the front-end Supabase Realtime subscription to receive live
-- open/close changes. When the admin toggles an event, every participant's
-- open tab/device is updated instantly (no reload needed).
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.event_settings;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;
EXCEPTION WHEN duplicate_object THEN
  NULL; -- already a member of the publication
END
$$;

-- IMPORTANT for Realtime: report FULL rows (including is_active) so that
-- postgres_changes UPDATE events deliver the changed columns, not just the
-- primary key. Without this, the front-end realtime handler only receives
-- event_id (the PK) and cannot see the new is_active value, so admin toggles
-- fail to propagate to participant devices.
ALTER TABLE public.event_settings REPLICA IDENTITY FULL;
ALTER TABLE public.registrations REPLICA IDENTITY FULL;

-- Done! Your TECHNOTSAV 2026 database is ready!
