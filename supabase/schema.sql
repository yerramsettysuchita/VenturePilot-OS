-- ============================================================
-- VenturePilot OS — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- WAITLIST TABLE
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null unique,
  founder_type text,
  stage text,
  biggest_challenge text,
  startup_idea text,
  team_size text,
  status text default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'invited'))
);

-- VENTURE SESSIONS TABLE
create table if not exists venture_sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  session_id text not null unique,
  founder_email text,
  startup_idea text not null,
  founder_context jsonb default '{}',
  status text default 'researching'
    check (status in ('researching', 'simulating', 'scoring', 'executing', 'adapting'))
);

-- VENTURE PATHS TABLE
create table if not exists venture_paths (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  session_id text not null references venture_sessions(session_id) on delete cascade,
  path_label text not null,
  path_name text not null,
  path_type text not null,
  description text not null,
  total_score numeric(4,2) not null,
  scores jsonb not null default '{}',
  is_recommended boolean default false,
  reasoning text,
  why_won text,
  why_others_lost jsonb default '[]'
);

-- ASSUMPTIONS TABLE
create table if not exists assumptions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  session_id text not null,
  assumption_text text not null,
  health_score numeric(4,2) default 8.0,
  status text default 'stable'
    check (status in ('stable', 'watch', 'at_risk', 'breached')),
  last_checked_at timestamp with time zone default now(),
  alert_message text,
  evidence jsonb default '[]'
);

-- ANALYTICS EVENTS TABLE
create table if not exists analytics_events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_type text not null,
  session_id text,
  properties jsonb default '{}'
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table waitlist enable row level security;
alter table venture_sessions enable row level security;
alter table venture_paths enable row level security;
alter table assumptions enable row level security;
alter table analytics_events enable row level security;

-- WAITLIST POLICIES
create policy "Allow public insert on waitlist"
  on waitlist for insert to anon with check (true);

create policy "Allow service role all on waitlist"
  on waitlist for all to service_role using (true) with check (true);

-- VENTURE SESSIONS POLICIES
create policy "Allow public insert on venture_sessions"
  on venture_sessions for insert to anon with check (true);

create policy "Allow public select on venture_sessions"
  on venture_sessions for select to anon using (true);

create policy "Allow service role all on venture_sessions"
  on venture_sessions for all to service_role using (true) with check (true);

-- VENTURE PATHS POLICIES
create policy "Allow public insert on venture_paths"
  on venture_paths for insert to anon with check (true);

create policy "Allow public select on venture_paths"
  on venture_paths for select to anon using (true);

-- ASSUMPTIONS POLICIES
create policy "Allow public insert on assumptions"
  on assumptions for insert to anon with check (true);

create policy "Allow public select on assumptions"
  on assumptions for select to anon using (true);

create policy "Allow service role all on assumptions"
  on assumptions for all to service_role using (true) with check (true);

-- ANALYTICS POLICIES
create policy "Allow public insert on analytics_events"
  on analytics_events for insert to anon with check (true);

create policy "Allow service role all on analytics_events"
  on analytics_events for all to service_role using (true) with check (true);

-- ============================================================
-- Enable Realtime for Venture Twin live updates
-- ============================================================
alter publication supabase_realtime add table assumptions;
alter publication supabase_realtime add table venture_sessions;
