# TECHNOTSAV 2026 – College Technology Fest Website

> **Think. Create. Compete. Celebrate.**
> A modern, premium, responsive national-level college technology fest web application engineered with **React**, **Tailwind CSS**, and **Supabase Database**.

Inspired by modern tech fest interfaces (e.g. *srujanacu.in*), **TECHNOTSAV 2026** delivers a cyber-themed experience with deep electric blues, neon purples, glowing cyan highlights, interactive particle constellations, and strict event-specific registration validation.

---

## 🌟 Key Highlights & Architecture

- **6 Flagship Competitions**:
  1. **Digital Treasure Hunt** (2–4 participants, dynamic add/remove, min 2)
  2. **Tech Quiz** (Exactly 2 participants, both compulsory)
  3. **Ideathon** (2–4 participants, interactive selectable theme cards)
  4. **Gaming – Free Fire** (2–4 participants, mobile battle royale squad)
  5. **Minute to Win It** (Individual agility challenge, strictly no team details)
  6. **Video Editing** (2–4 participants, creative cinematic production)
- **Automatic Event Identification**: Clicking any event card or "Register Now" opens its dedicated registration page with the exact corresponding form rules without asking the participant to re-select.
- **Strict Validation Rules**: Enforces mandatory fields, RFC email format, 10-digit phone numbers, college USN format, team size constraints, and duplicate submission locks.
- **Instant Official Pass Generation**: Unique Registration ID (e.g. `TECH26-DTH-7842`), verified check-in badge, digital QR code representation, and 1-click printable ticket receipt.
- **Dual-Mode Database Layer**:
  - **Live Supabase Mode**: Connects directly to Supabase cloud PostgreSQL using provided credentials in `.env`.
  - **Local Persistence Failover**: Seamlessly saves and manages registrations in local storage if offline or before database keys are entered, guaranteeing 100% functionality out of the box!
- **Protected Admin Dashboard**:
  - Secure Passcode Authentication (Default: `admin2026`).
  - Total and event-wise registration counters with quota progress.
  - Real-time search across Team Name, Leader Name, Participant Names, USNs, and Registration IDs.
  - Event filter tabs.
  - Modal to inspect complete participant breakdowns.
  - Real-time toggle switch to **Open or Close Registrations** for any event.
  - One-click **CSV / Excel Data Export**.
  - Delete registration with confirmation.
- **Editable Fest Placeholders**: College name, fest date, campus venue, registration fees, coordinators, and schedule are kept strictly configurable without inventing unprovided details.

---

## 📁 Project Directory Structure

```text
technotsav-2026/
├── index.html                 # Main Vite HTML shell with Google Fonts & Meta tags
├── preview.html               # Standalone self-contained distribution for instant browser testing
├── server.js                  # Zero-dependency local Node.js HTTP server (ESM)
├── package.json               # Modern dependencies (React 18, Vite 5, Tailwind CSS, Supabase)
├── vite.config.js             # Vite build and dev server configuration
├── tailwind.config.js         # Custom cyber colors, glows, animations, and typography
├── postcss.config.js          # PostCSS autoprefixer pipeline
├── supabase-schema.sql        # Full Supabase PostgreSQL schema with RLS & tables
├── vercel.json                # Vercel single-page application routing rules
├── .env.example               # Environment template for Supabase credentials & Admin passcode
├── .env                       # Local active environment variables
└── src/
    ├── main.jsx               # Application entry point
    ├── App.jsx                # SPA router, view switching, and deep hash linking
    ├── index.css              # Cyber grid, glassmorphic panels, neon glow variables
    ├── data/
    │   ├── eventsData.js      # Definitions, categories, rules, and constraints for all 6 events
    │   └── festConfig.js      # Central editable placeholders (College, Dates, Venue, Schedule, Contacts)
    ├── lib/
    │   ├── supabase.js        # Supabase JavaScript client initializer
    │   └── db.js              # Dual-mode database service (Supabase Cloud + Local Storage)
    ├── pages/
    │   └── RegistrationPage.jsx # Event-specific registration forms & dynamic member controls
    └── components/
        ├── Navbar.jsx         # Sticky glassmorphic header with quick jump links & mobile drawer
        ├── Hero.jsx           # Cyber-themed landing, branding logo, tagline, and editable chips
        ├── About.jsx          # Purpose, stats counter (1500+ Innovators, 50+ Colleges) & 3 pillars
        ├── EventsSection.jsx  # 6 interactive cards with hover effects & rules modals
        ├── ScheduleSection.jsx# Day 1 & Day 2 interactive editable schedule timeline
        ├── ContactSection.jsx # Faculty & Student coordinators contact cards & FAQs
        ├── Footer.jsx         # Fest footer with social links & admin portal shortcut
        ├── CyberParticles.jsx # High-performance HTML5 canvas particle constellation
        ├── RegistrationSuccess.jsx # Official printable ticket & QR verification card
        └── AdminDashboard.jsx # Full management suite, search, filters, toggles, CSV export
```

---

## 🚀 How to Run the Website

You have multiple convenient options to run and test TECHNOTSAV 2026:

### Option A: Instant Local Server (Zero Setup Required)

Run the included Node HTTP server:
```powershell
node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

### Option B: React + Vite Development Server

If you have Node.js and npm installed on your machine:
```powershell
# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Option C: Direct Browser Opening

Double-click `preview.html` to open the fully interactive application directly in Google Chrome, Microsoft Edge, Brave, or Firefox.

---

## 🗄️ Supabase Cloud Database Setup

To sync all registrations to a live cloud database on Supabase:

1. Create a free account at [supabase.com](https://supabase.com).
2. Click **New Project** and name it `technotsav-2026`.
3. In the left navigation, open **SQL Editor** -> Click **New Query**.
4. Open the `supabase-schema.sql` file from this project, copy its contents, paste them into the query editor, and click **Run**.
   - This automatically creates the `registrations` table, `event_settings` table, performance indices, seed events, and Row Level Security (RLS) policies.
5. In your Supabase Dashboard, go to **Project Settings** -> **API**.
6. Copy your **Project URL** and **anon public Key**.
7. Open the `.env` file in this project and paste your keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   VITE_ADMIN_PASSCODE=admin2026
   ```
8. Restart your dev server. The app will immediately detect live Supabase and sync all submissions to the cloud!

---

## 🛡️ Admin Dashboard Portal

- **URL**: Navigate to `/admin` or click **Admin Portal** in the navigation bar.
- **Default Passcode**: `admin2026` (configurable via `VITE_ADMIN_PASSCODE` in `.env`).
- **Features**:
  - View total attendee count and event-specific registration volumes.
  - Search instantaneously by **Team Name**, **Participant Name**, **USN**, or **Registration ID**.
  - Filter registrations by specific event.
  - Toggle registrations **Open** or **Closed** for each individual event in real-time.
  - Inspect complete team rosters, USNs, and phone numbers in the details modal.
  - One-click **Export CSV** download formatted for Microsoft Excel and Google Sheets.
  - Delete incorrect or duplicate registrations.

---

## 🌐 Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. Log in to [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
3. Import the `technotsav-2026` repository.
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
   - `VITE_ADMIN_PASSCODE` = your chosen admin passcode
5. Click **Deploy**. Vercel will build and publish your fest website with global CDN caching and SSL certificates enabled!

---

## 📝 Customizing Editable Fest Details

All placeholders are neatly organized in `src/data/festConfig.js`. Update the file to customize:
- College / University Name
- Organizing Department
- Fest Dates and Venue
- Registration Fees
- Faculty Advisors & Student Conveners contact details
- Timeline schedule milestones
# cse
