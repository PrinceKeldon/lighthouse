# ADR-004 — MVP Security Baseline (Encryption Deferred to Phase 2)

Status: Decided

## Decision

Field-level encryption of Entry text (ADR-003) is removed from Sprint 0 /
Milestone 0 scope. Lighthouse ships its first working build on Supabase's
standard security baseline:

- Supabase Auth
- Row Level Security (already implemented in `app/schema.sql`)
- TLS in transit
- Supabase's managed-Postgres encryption at rest (infrastructure-level,
  not field-level — real, but not the same guarantee ADR-003 described)
- Database backups
- A privacy policy that accurately describes this baseline — see
  Honesty Constraint below

ADR-003's architecture (server-managed envelope encryption via
Supabase Vault/pgsodium) is not abandoned — it's the Phase 2 plan,
revisited once there's a validated product to protect.

## Reason

Milestone 0's actual existential risk is whether the daily loop
(`core-loop.md`) makes anyone want to come back tomorrow — not whether
Entry text is encrypted at the field level. Several implementation cycles
were spent on pgsodium/pgcrypto signature issues and an unrelated
`auth.admin.createUser` error, none of which move that core question
forward. Continuing to debug infrastructure that zero users will notice,
while the experience 100% of users will notice remains unbuilt, is the
wrong trade-off for a scoped MVP.

Supabase's default security posture (Auth, RLS, TLS, managed-Postgres
encryption at rest, backups) is a legitimate baseline — not "no security."
The gap it leaves, specifically, is protection against a compromised
service-role key or a Supabase-side breach exposing plaintext Entry
content. That gap is real and worth closing — just not before the product
has proven anyone needs it closed.

## Honesty Constraint

This baseline must never be described, in-app or in a privacy policy, in
language that implies field-level or zero-knowledge protection ("we can't
read your entries," "fully private," "encrypted end-to-end"). It's
accurate to say entries are private from other users and protected in
transit and at the infrastructure level. It is not accurate to say
Lighthouse itself cannot access them. Charter principle: we never
manipulate, and that includes never overstating a protection we haven't
actually built yet.

## Trigger for Revisiting (Phase 2)

Not "whenever it feels ready" — a concrete gate: **before any public app
store release beyond a private/closed beta.** Field-level encryption
should be in place before Entry content from a broad, non-founder-known
user base is at stake, even though it's acceptable to defer during
internal and closed-beta validation of the core loop.

When revisited, evaluate Supabase Vault/pgsodium (ADR-003's original
plan), pgcrypto, application-level encryption, or an external KMS based on
real operational requirements at that point — not speculatively, as
ADR-003 attempted.

## Immediate Follow-up Action

Rename `entries.text_encrypted` to `entries.text` (or `content`) in
`app/schema.sql` and any code referencing it. The current name implies a
guarantee that isn't true yet — cheap to fix now, a real trust bug if left
as-is and discovered later (by a developer, an auditor, or in an incident
postmortem).

## Alternative Considered

Continue debugging the pgsodium/Vault implementation from ADR-003 until
working, before proceeding with core loop logic wiring.

## Rejected Because

No evidence the core loop resonates with anyone yet, which is the
actual unproven assumption behind the entire company. Infrastructure
correctness for a feature with an already-sound architectural decision
(ADR-003) is not the highest-leverage use of scoped MVP time. Per the
Charter: "Build with care. Ship with courage." Courage, here, means
shipping the baseline and coming back to this once it's earned its
priority.
