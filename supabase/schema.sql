-- ============================================================
-- Daily — Supabase schema
-- Run this in your Supabase dashboard → SQL Editor → New query.
-- It stores one JSON document per user (their whole app state)
-- and locks each row to its owner with Row Level Security.
-- ============================================================

create table if not exists public.app_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

-- Each user can only read/insert/update their own row.
drop policy if exists "app_state_select_own" on public.app_state;
create policy "app_state_select_own"
  on public.app_state for select
  using (auth.uid() = user_id);

drop policy if exists "app_state_insert_own" on public.app_state;
create policy "app_state_insert_own"
  on public.app_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "app_state_update_own" on public.app_state;
create policy "app_state_update_own"
  on public.app_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- After running this:
-- 1. Authentication → Providers → enable Google, paste your
--    Google OAuth Client ID + Secret (from Google Cloud Console).
-- 2. Authentication → URL Configuration → add your app URL(s)
--    (e.g. http://localhost:8080 and your hosted URL) to
--    "Site URL" and "Redirect URLs".
-- 3. Project Settings → API → copy the Project URL and the
--    anon public key into js/config.js.
-- ============================================================
