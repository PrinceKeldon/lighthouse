# ADR-003 — Data Encryption Architecture

Status: Superseded by ADR-004-mvp-security-baseline.md. The architecture
decision below remains sound and is the plan for Phase 2 — it was the
*sequencing* (implementing it inside Sprint 0/Milestone 0) that was
wrong, not the design. Preserved in full per the Charter's immutable-
history rule.

## Decision

Entry text is encrypted at rest using server-managed envelope encryption
(Supabase Vault / pgsodium), not a user-held recovery phrase.

Concretely: Entry text is encrypted with a per-user Data Encryption Key
(DEK); the DEK itself is encrypted by a server-managed master key and
never exposed to the client in plaintext. Database access (casual
browsing, a breach of the data layer alone) never exposes plaintext Entry
content. Normal account recovery (password reset, new device) still
restores access to Entries — there is no scenario where a forgotten
credential permanently destroys a user's data.

## Reason

`10-technical-architecture.md` required ciphertext at rest for Entry text.
It did not require a zero-knowledge model where Lighthouse itself cannot
recover the data under any circumstance — that's a stronger, different
guarantee with a much harsher failure mode, and the wrong one for this
product's audience.

Run against the Lighthouse Test (`00-charter.md`):

- A user-held recovery phrase means a lost phrase is a permanent, total
  loss of everything someone has written about themselves — exactly the
  kind of catastrophic, anxiety-inducing failure mode the Charter commits
  us to avoiding, and one our personas (`05`) — none of them crypto-native
  — are especially unlikely to handle safely.
- It also reintroduces a configuration step into Day 1 onboarding, directly
  contradicting `06-user-journeys.md`'s "no theme-picker, straight to
  first Entry" design.

Server-managed envelope encryption still satisfies the real requirement —
no plaintext Entry content sits exposed in the database — without putting
irrecoverable, permanent loss of deeply personal content on a user who
forgets a phrase during a hard week.

## Layered Security, Not a Single Control

This ADR covers one pillar — encryption at rest for Entry text. It should
not be read as the complete privacy/security story. The broader model
Lighthouse relies on includes:

- **Row Level Security** — already enforced in `app/schema.sql` on
  `entries`, `strengths`, and `subscriptions`; no user can query another
  user's rows regardless of application-layer bugs.
- **Secure authentication** — via Supabase Auth, not a custom-built system.
- **TLS in transit** — all client-server traffic encrypted, standard and
  non-negotiable, independent of this ADR's at-rest decision.
- **Least-privilege access** — service-role keys with database write
  access (e.g., the `subscriptions` table update path noted in
  `schema.sql`) restricted to server-side functions, never exposed
  client-side.
- **Backups** — needed for the account-recovery guarantee this ADR
  promises ("no forgotten credential permanently destroys a user's data")
  to actually hold; backup policy itself is not yet specified and should
  get its own line item before launch, not be assumed as a side effect of
  this decision.
- **Audit logging and key rotation cadence** — not yet specified. Flagging
  here as open items rather than letting their absence be implied by this
  ADR's silence.

Encryption at rest reduces the impact of one specific failure mode (a
breach of the data layer alone exposing plaintext). It does not substitute
for any of the above, and future work on the still-open items shouldn't be
treated as already covered because this ADR exists.

User-held recovery phrase deriving a Key Encryption Key via PBKDF2,
decoupling data access entirely from the Supabase auth password
(zero-knowledge model).

## Rejected Because

Technically sound, but mismatched to the product's actual audience and
threat model. Trades a marginal security improvement (Lighthouse itself
cannot access Entry content) for a severe, foreseeable harm (permanent
loss of personal evidence on a lost phrase) that conflicts directly with
the Charter's anxiety-reduction and trust principles. May be worth
revisiting as an opt-in "Advanced Privacy" mode for users who specifically
want it — but not as the default, mandatory Day-1 experience.
