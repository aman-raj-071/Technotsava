# Backups

Automatic data-safety layer for TECHNOTSAV 2026 registrations.

## How it works

Every deletion in the Admin Dashboard is **archived before it is removed** —
the record is never permanently lost. On top of that, the admin can download a
full snapshot at any time.

### 1. Automatic archive (in-app)
Every deletion is **archived before it is removed** — the record is never
permanently lost. The archived copy lives in the browser's **localStorage**:
- Deployed site (`index.html`): key `technotsav_2026_archived`
- Modular `src/` app: key `technotsav_2026_backup_registrations`

The archived record is append-only and is never touched again after deletion.

### 2. Manual full backup (in-app)
- The Admin Dashboard has a **Backup** button (amber) next to "Export CSV".
- It downloads a JSON file `TECHNOTSAV_2026_Backup_YYYY-MM-DD.json`
  containing:
  - `registrations` — everything currently in the main list (live)
  - `archived_deleted` — every deleted/archived record
  - `counts` — live count + archived count
  - `exported_at` — timestamp

### 3. This folder
This folder is where you can drop **downloaded backup JSON files** (and any
server-side exports) so the project history always has a copy outside the
browser. Suggested naming: `TECHNOTSAV_2026_Backup_2026-04-08.json`.

## Recommendations
- Download a **Backup** JSON after each fest day (or whenever you delete records)
  and store it here.
- Keep these files in version control or a separate drive so data survives
  even if browser storage is cleared.
- The archive is per-browser; do not rely on it as the only copy — use the
  manual Backup download for durable storage.

### 4. Database backup folder (Supabase)
The `src/` app also persists every archived record to the **Supabase
`archived_registrations` table** — a permanent backup in the cloud that
survives cleared browsers, lost laptops, and re-deploys.

- On **delete**, the record is inserted (upsert) into
  `archived_registrations` **and** mirrored to localStorage.
- The table stores the full row (`reg_id`, `leader_name`, `members`,
  `registration_fee`, `total_members`, `archived_at`, …).
- Apply `supabase-schema.sql` (section 1b + RLS policies) to create the
  table on your Supabase project.
- `syncBackupsFromDB()` pulls DB archives into the local cache so the Backup
  download always reflects everything in the database.

So every deletion now has **three** copies: the database archive, the browser
localStorage archive, and the downloadable JSON — you will never lose data.
