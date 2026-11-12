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
    attendance_code VARCHAR(30),
    attended BOOLEAN DEFAULT false,
    attended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
    ('video-editing', 'Video Editing', TRUE, 50, 'Free')
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
CREATE POLICY "Allow public insert registrations" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- Allow public reading event active status (SELECT)
CREATE POLICY "Allow public select event settings" 
ON public.event_settings 
FOR SELECT 
USING (true);

-- Allow read access for public/admin registrations (SELECT)
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
CREATE POLICY "Allow delete registrations" 
ON public.registrations 
FOR DELETE 
USING (true);

-- Allow update event settings (admin toggle)
CREATE POLICY "Allow update event settings" 
ON public.event_settings 
FOR UPDATE 
USING (true);

-- Allow insert event settings (admin first-time upsert of a new event)
CREATE POLICY "Allow insert event settings" 
ON public.event_settings 
FOR INSERT 
WITH CHECK (true);

-- Done! Your TECHNOTSAV 2026 database is ready!
