-- Lighthouse — Supabase schema, Milestone 0
-- Matches docs/07-information-architecture.md object model and
-- docs/10-technical-architecture.md (as updated by ADR-004)

-- ─────────────────────────────────────────────
-- Strengths
-- ─────────────────────────────────────────────
create table strengths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  first_evidence_at timestamptz,
  created_at timestamptz not null default now()
);

alter table strengths enable row level security;

create policy "Users manage their own strengths"
  on strengths
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Entries
-- ─────────────────────────────────────────────
create table entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,        -- plaintext for Milestone 0; envelope encryption deferred to Phase 2 (ADR-004)
  strength_tags uuid[] default '{}',   -- references strengths.id, not FK-enforced
                                         -- (array of nullable-tag design, per 07)
  prompt_id text,                      -- nullable; which onboarding/reflect
                                         -- prompt produced this, if any
  weight smallint,                     -- optional, user-set significance
  created_at timestamptz not null default now()
);

alter table entries enable row level security;

create policy "Users manage their own entries"
  on entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index to support the Remember mechanic's date-matching query
create index entries_user_created_at_idx
  on entries (user_id, created_at);

-- ─────────────────────────────────────────────
-- Subscription status
-- ─────────────────────────────────────────────
create table subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'plus', 'founding_supporter')),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "Users view their own subscription status"
  on subscriptions
  for select
  using (auth.uid() = user_id);
