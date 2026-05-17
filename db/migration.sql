-- Michael's Corner — schema migration
-- Run this in Supabase SQL Editor (project: fhfempisopwsdkmvywbt — shared with jarvis-dashboard).
-- All tables prefixed `mc_` and scoped to user_id via RLS so they don't touch dashboard data.

-- Enable pgcrypto for gen_random_uuid (already on in Supabase by default, but safe to re-run)
create extension if not exists "pgcrypto";

-- ============================================================
-- mc_ideas
-- ============================================================
create table if not exists public.mc_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  language text not null default 'en',
  format text not null default 'long',
  notes text default '',
  status text not null default 'active',
  video_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists mc_ideas_user_idx on public.mc_ideas(user_id, created_at desc);

alter table public.mc_ideas enable row level security;
drop policy if exists "mc_ideas_owner_all" on public.mc_ideas;
create policy "mc_ideas_owner_all" on public.mc_ideas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- mc_videos
-- ============================================================
create table if not exists public.mc_videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default '',
  slug text default '',
  language text not null default 'en',
  format text not null default 'long',
  status text not null default 'idea',
  target_length text default '',
  publish_date date,
  hook_idea text default '',
  promise text default '',
  outline text default '',
  script text default '',
  b_roll text default '',
  cta text default '',
  thumbnail_concept text default '',
  cross_post_plan text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists mc_videos_user_idx on public.mc_videos(user_id, created_at desc);
create index if not exists mc_videos_user_status_idx on public.mc_videos(user_id, status);

alter table public.mc_videos enable row level security;
drop policy if exists "mc_videos_owner_all" on public.mc_videos;
create policy "mc_videos_owner_all" on public.mc_videos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- auto-update updated_at
create or replace function public.mc_set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists mc_videos_updated_at on public.mc_videos;
create trigger mc_videos_updated_at before update on public.mc_videos
  for each row execute function public.mc_set_updated_at();

-- ============================================================
-- mc_checklist_runs — one row per (video, platform)
-- state is a JSON object: { "Section name:0": true, "Section name:1": false, ... }
-- ============================================================
create table if not exists public.mc_checklist_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.mc_videos(id) on delete cascade,
  platform text not null,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (video_id, platform)
);
create index if not exists mc_checklist_user_idx on public.mc_checklist_runs(user_id);

alter table public.mc_checklist_runs enable row level security;
drop policy if exists "mc_checklist_owner_all" on public.mc_checklist_runs;
create policy "mc_checklist_owner_all" on public.mc_checklist_runs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop trigger if exists mc_checklist_updated_at on public.mc_checklist_runs;
create trigger mc_checklist_updated_at before update on public.mc_checklist_runs
  for each row execute function public.mc_set_updated_at();

-- ============================================================
-- mc_brand — singleton per user (kv as jsonb for flexibility)
-- ============================================================
create table if not exists public.mc_brand (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.mc_brand enable row level security;
drop policy if exists "mc_brand_owner_all" on public.mc_brand;
create policy "mc_brand_owner_all" on public.mc_brand
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop trigger if exists mc_brand_updated_at on public.mc_brand;
create trigger mc_brand_updated_at before update on public.mc_brand
  for each row execute function public.mc_set_updated_at();

-- Done. Verify with:
--   select table_name from information_schema.tables where table_schema='public' and table_name like 'mc_%';
