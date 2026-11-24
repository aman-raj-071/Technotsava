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

-- 7. STUDENT COORDINATORS TABLE (For coordinator lookups & certificates)
CREATE TABLE IF NOT EXISTS public.coordinators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usn VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100) DEFAULT 'Student Coordinator',
    team VARCHAR(100),
    semester VARCHAR(20),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.coordinators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select coordinators" ON public.coordinators;
CREATE POLICY "Allow select coordinators" ON public.coordinators FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all coordinators" ON public.coordinators;
CREATE POLICY "Allow all coordinators" ON public.coordinators FOR ALL USING (true);

-- Seed all Student Coordinators from TECHNOTSAVA 8.0 document
INSERT INTO public.coordinators (usn, name, role, team, semester, phone)
VALUES
    -- Main Coordinators
    ('1SJ24CS145', 'Sohan Gowda K', 'Main Coordinator', 'Main', '5th', '8050573782'),
    ('1SJ24CS124', 'Ruchitha L', 'Main Coordinator', 'Main', '5th', '6361800423'),
    ('1SJ24CS022', 'Brunda S', 'Main Coordinator', 'Main', '5th', '7899409898'),
    ('1SJ24CS061', 'Kruthika M G', 'Main Coordinator', 'Main', '5th', '9448549609'),
    ('1SJ25CS153', 'Tejas J V', 'Main Coordinator', 'Main', '3rd', '7259596177'),

    -- Ideathon
    ('1SJ24CS024', 'Chandushri V M', 'Team Lead', 'Ideathon', '5th', '9731005505'),
    ('1SJ24CS012', 'Anusha S', 'Student Coordinator', 'Ideathon', '5th', '9740066913'),
    ('1SJ25CS126', 'Sahithi K N', 'Student Coordinator', 'Ideathon', '3rd', '9113534148'),
    ('1SJ25CS125', 'Sahana M', 'Student Coordinator', 'Ideathon', '3rd', '7483795889'),
    ('1SJ25CS123', 'Sagar Metri', 'Student Coordinator', 'Ideathon', '3rd', '9972916216'),

    -- Digital Tech Hunt
    ('1SJ24CS035', 'Ganavi V', 'Team Lead', 'Digital Tech Hunt', '5th', '6362289292'),
    ('1SJ24CS025', 'D N Harshitha', 'Student Coordinator', 'Digital Tech Hunt', '5th', '8074297369'),
    ('1SJ25CS121', 'Sadhvika B R', 'Student Coordinator', 'Digital Tech Hunt', '3rd', '9353188329'),
    ('1SJ25CS135', 'Shashirekha G', 'Student Coordinator', 'Digital Tech Hunt', '3rd', '8088841231'),
    ('1SJ25CS140', 'Shrunga N', 'Student Coordinator', 'Digital Tech Hunt', '3rd', '6361413466'),
    ('1SJ25CS144', 'Sowmya V', 'Student Coordinator', 'Digital Tech Hunt', '3rd', '7411707921'),

    -- Tech Quiz
    ('1SJ24CS067', 'Likhitha A', 'Team Lead', 'Tech Quiz', '5th', '8088288313'),
    ('1SJ24CS072', 'Madhu P G', 'Student Coordinator', 'Tech Quiz', '5th', '8088592416'),
    ('1SJ24CS100', 'Poojitha R', 'Student Coordinator', 'Tech Quiz', '5th', '9164883811'),
    ('1SJ24CS088', 'Nanditha A', 'Student Coordinator', 'Tech Quiz', '5th', '8867042328'),
    ('1SJ24CS085', 'Namitha A', 'Student Coordinator', 'Tech Quiz', '5th', '8431691118'),
    ('1SJ24CS064', 'Kusuma B M', 'Student Coordinator', 'Tech Quiz', '5th', '8971770693'),

    -- Free Fire
    ('1SJ24CS176', 'Vivek P M', 'Team Lead', 'Free Fire', '5th', '9110429998'),
    ('YASHAS-A', 'Yashas A', 'Student Coordinator', 'Free Fire', '5th', '9980581709'),
    ('1SJ24CS127', 'Sai Gagan N K', 'Student Coordinator', 'Free Fire', '5th', '8073190199'),
    ('CHIRAYUSH-TM', 'Chirayush T M', 'Student Coordinator', 'Free Fire', '5th', '8088740884'),
    ('1SJ24CS158', 'Uday S Reddy', 'Student Coordinator', 'Free Fire', '5th', '8618450881'),
    ('1SJ24CS169', 'Vidit Raj', 'Student Coordinator', 'Free Fire', '5th', '6204093356'),

    -- Logo Mania
    ('1SJ24CS182', 'Yashwanth Gowda R', 'Team Lead', 'Logo Mania', '5th', '6366209220'),
    ('1SJ24CS184', 'Yogish Gowda S', 'Student Coordinator', 'Logo Mania', '5th', '9380048468'),
    ('1SJ24CS130', 'Sandeep N', 'Student Coordinator', 'Logo Mania', '5th', '9043930445'),
    ('1SJ24CS147', 'Sudeep R H', 'Student Coordinator', 'Logo Mania', '5th', '7975904497'),
    ('1SJ24CS128', 'Samith Gowda', 'Student Coordinator', 'Logo Mania', '3rd', '9663605727'),
    ('1SJ24CS138', 'Shodhan V Shetty', 'Student Coordinator', 'Logo Mania', '5th', '7975934723'),

    -- Videography
    ('1SJ25CS137', 'Shivanand Konnur', 'Student Coordinator', 'Videography', '3rd', '7975433513'),
    ('1SJ25CS117', 'Rohith C S', 'Student Coordinator', 'Videography', '3rd', '9535807566'),
    ('1SJ25CS167', 'Yashavanth H D', 'Student Coordinator', 'Videography', '3rd', '9741396012'),
    ('1SJ25CS118', 'Rohith S R', 'Student Coordinator', 'Videography', '3rd', '9113985775'),
    ('1SJ24CS003', 'Abhishek E', 'Student Coordinator', 'Videography', '5th', '9148730082'),

    -- Minute to Win-It
    ('1SJ25CS017', 'Ayiman Tarannum', 'Team Lead', 'Minute to Win-It', '3rd', '7892306242'),
    ('1SJ25CS011', 'Aman Raj', 'Student Coordinator', 'Minute to Win-It', '3rd', '9931897671'),
    ('1SJ25CS007', 'Afza Farheen A', 'Student Coordinator', 'Minute to Win-It', '3rd', '9535881626'),
    ('1SJ25CS014', 'Aniket', 'Student Coordinator', 'Minute to Win-It', '3rd', '8618444599'),
    ('1SJ25CS034', 'Chaithanya R', 'Student Coordinator', 'Minute to Win-It', '3rd', '9019568692'),

    -- Publishing Coordinators (20 Members)
    ('1SJ24CS181', 'Yashaswini M', 'Publishing Coordinator', 'Publishing', '5th', '9901419104'),
    ('1SJ24CS178', 'Vyshnavi P', 'Publishing Coordinator', 'Publishing', '5th', '9902575365'),
    ('1SJ24CS129', 'Sanchitha S', 'Publishing Coordinator', 'Publishing', '5th', '8296545766'),
    ('1SJ25CS045', 'Haripriya RM', 'Publishing Coordinator', 'Publishing', '3rd', '7892310376'),
    ('1SJ25CS026', 'Bhavana J', 'Publishing Coordinator', 'Publishing', '3rd', '9740815955'),
    ('1SJ25CS043', 'G.N Meghana', 'Publishing Coordinator', 'Publishing', '3rd', '8125530028'),
    ('1SJ24CS183', 'Yathish V', 'Publishing Coordinator', 'Publishing', '5th', '9036060954'),
    ('1SJ24CS103', 'Pratham S B', 'Publishing Coordinator', 'Publishing', '5th', '8431503878'),
    ('1SJ24CS132', 'Sanika R', 'Publishing Coordinator', 'Publishing', '5th', '9611424509'),
    ('1SJ24CS168', 'Vidhya N', 'Publishing Coordinator', 'Publishing', '5th', '8088835482'),
    ('1SJ24CS118', 'Riya Singh', 'Publishing Coordinator', 'Publishing', '5th', '7398298975'),
    ('1SJ24CS112', 'Rachamalla Kavya', 'Publishing Coordinator', 'Publishing', '5th', '8099910316'),
    ('1SJ24CS113', 'Ragi Rakshitha', 'Publishing Coordinator', 'Publishing', '5th', '93F98971916'),
    ('1SJ25CS148', 'Sumanth Reddy', 'Publishing Coordinator', 'Publishing', '3rd', '9686758669'),
    ('1SJ24CS141', 'Shreya M', 'Publishing Coordinator', 'Publishing', '5th', '8310983103'),
    ('1SJ25CS173', 'Reshika Kirana Kumar', 'Publishing Coordinator', 'Publishing', '3rd', '9353061063'),
    ('1SJ24CS009', 'Akshay S', 'Publishing Coordinator', 'Publishing', '5th', '7760233718'),
    ('1SJ24CS170', 'Vidya Shree D', 'Publishing Coordinator', 'Publishing', '5th', '9632463745'),
    ('1SJ24CS166', 'Varsha Tejamayi R', 'Publishing Coordinator', 'Publishing', '5th', '9900388439'),
    ('1SJ25CS061', 'Keerthi Kumar B J', 'Publishing Coordinator', 'Publishing', '3rd', '7019253329')
ON CONFLICT (usn) DO UPDATE
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    team = EXCLUDED.team,
    semester = EXCLUDED.semester,
    phone = EXCLUDED.phone;

-- Done! Your TECHNOTSAV 2026 database is ready!
