-- ADR-004 follow-up: clean up leftover ADR-003 encryption artifacts and
-- establish the actual MVP schema in version control, since the previous
-- migration (20260711000000_setup_encryption.sql) was never removed and
-- no schema.sql was ever committed for entries/strengths/subscriptions.
--
-- Written to be idempotent and safe to run against either a fresh
-- database or the current live one, regardless of its exact present state.

-- ─────────────────────────────────────────────
-- 1. Remove the ADR-003 encryption trigger and functions.
--    This trigger (on_auth_user_created) was the confirmed root cause
--    of the earlier signup 500 error. It was reportedly dropped by hand
--    against the live database, but never removed from migration
--    history — meaning it would be silently recreated on any fresh
--    migration replay. Removing it here, in version control, is the
--    actual fix.
-- ─────────────────────────────────────────────
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.provision_user_dek();
drop function if exists public.encrypt_entry_text(uuid, text);
drop function if exists public.decrypt_entry_text(uuid, text);
drop table if exists public.user_encryption_keys;

-- ─────────────────────────────────────────────
-- 2. Strengths table (create if not already present).
-- ─────────────────────────────────────────────
create table if not exists public.strengths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  first_evidence_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.strengths enable row level security;

drop policy if exists "Users manage their own strengths" on public.strengths;
create policy "Users manage their own strengths"
  on public.strengths
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 3. Entries table (create if not already present).
--    Per ADR-004: plaintext `text` column, not `text_encrypted`.
--    Field-level encryption is deferred to Phase 2 (ADR-003, revisited).
-- ─────────────────────────────────────────────
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  strength_tags uuid[] default '{}',
  prompt_id text,
  weight smallint,
  created_at timestamptz not null default now()
);

-- If the table already existed with the old column name, migrate it.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entries'
      and column_name = 'text_encrypted'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entries'
      and column_name = 'text'
  ) then
    alter table public.entries rename column text_encrypted to text;
  end if;
end $$;

alter table public.entries enable row level security;

drop policy if exists "Users manage their own entries" on public.entries;
create policy "Users manage their own entries"
  on public.entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists entries_user_created_at_idx
  on public.entries (user_id, created_at);

-- ─────────────────────────────────────────────
-- 4. Subscriptions table (create if not already present).
-- ─────────────────────────────────────────────
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'plus', 'founding_supporter')),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "Users view their own subscription status" on public.subscriptions;
create policy "Users view their own subscription status"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 5. Remember mechanic — calendar-date matching RPC (per 10 & 11).
--    Recreated here since it depends on public.entries and needs to be
--    in version control alongside the table it queries.
-- ─────────────────────────────────────────────
create or replace function public.get_remember_entry(u_id uuid)
returns text as $$
declare
  matched_text text;
begin
  select text into matched_text
  from public.entries
  where user_id = u_id
    and extract(month from created_at) = extract(month from now())
    and extract(day from created_at) = extract(day from now())
    and created_at < now() - interval '1 day'
  order by random()
  limit 1;

  return matched_text;
end;
$$ language plpgsql security definer;
