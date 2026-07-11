# 10 — Technical Architecture

Status: Draft v0.1 — not yet frozen
Depends on: 07-information-architecture.md (object model, screen map),
08-design-system.md, 11-mvp-scope.md (Milestone 0 definition of done)

---

## Guiding Constraints (not engineering preferences — Charter-derived)

Before any stack decision, three things from earlier documents constrain
the technical choices more than they would for a typical app:

1. **Entries and Strengths are private, sensitive-by-nature data.** People
   are writing real things about themselves, often during hard moments.
   This isn't "just user content" from an infrastructure standpoint — it
   changes the bar for encryption, third-party SDKs, and analytics.
2. **No ads, no ad-adjacent data pipelines** (ADR-002). This rules out a
   whole category of "free" infrastructure (ad SDKs, most free-tier
   analytics that resell behavioral data) on principle, not just cost.
3. **Small team, lean budget, low subscription price by design.** The
   $1.99/mo pricing decision in ADR-002 only works long-term if
   infrastructure costs stay proportionally low. This pushes toward managed
   services over building/hosting everything ourselves at MVP stage.

---

## Platform Decision

**Cross-platform (React Native), single codebase, iOS + Android at launch.**

Reasoning: `03`'s market research is explicit that I Am's 5M+ downloads
span both platforms, and the whole strategy in `02` is "meet the market
where its validated demand already is." Choosing iOS-only to make widget
development easier later would optimize for a feature `11` explicitly
deferred out of Milestone 0. Cross-platform gets both app stores covered
with one team, one codebase, matching the lean-team constraint above.

Alternative considered: native iOS first (simpler widget path later,
generally smoother native feel). Rejected for MVP specifically because
`11`'s definition of done doesn't include the widget, so the argument for
going native-first loses its strongest justification. Worth revisiting
once the widget becomes an actual near-term roadmap item — React Native's
widget story is real but has more friction than fully native.

---

## Data Architecture

Restating the object model from `07`, now with storage implications:

```
Entry {
  id, created_at, text, strength_tags[], prompt_id (nullable), 
  weight, private: true (always — not a per-entry user setting at MVP)
}

Strength {
  id, name, entries[], first_evidence_at
}
```

**Storage split:**
- **Entries and Strengths** — user-generated, sensitive. Stored
  server-side (for cross-device access and backup, which `11` lists as a
  future subscription-tier feature), encrypted at rest, scoped per-user
  with no cross-user querying capability at the database level. Local
  on-device cache for offline read access.
- **Affirmations (content library)** — not sensitive, not user-specific.
  Bundled with the app at MVP rather than fetched from a server. Simpler,
  faster, works offline by default, and avoids standing up content
  infrastructure before there's any evidence it's needed. A server-fetched
  library is a reasonable fast-follow once content needs to be updated
  without an app release.

---

## Backend / Infrastructure

**Recommendation: a managed backend-as-a-service (e.g., Supabase or
Firebase) rather than custom-built infrastructure for MVP.**

Reasoning: matches the "lean team, low subscription price" constraint
directly — authentication, database, and basic hosting come largely
solved, which matters more here than at a typical startup because the
unit economics in ADR-002 were built assuming low overhead. Custom
infrastructure is a reasonable Series-later decision, not a Milestone 0 one.

**Non-negotiable regardless of provider chosen:**
- Field-level encryption for Entry text specifically, not just
  transport-level (HTTPS) encryption — this is the one place I'd spend
  extra engineering effort even at MVP, given constraint #1 above.
- No third-party analytics SDK that ingests Entry content or Strength
  names. Product analytics (screens viewed, feature usage) is fine and
  useful; anything that could see *what someone wrote* is not.

---

## Remember Mechanic — Implementation

Per `11`, Milestone 0 ships the simple version only: calendar-date
matching against a user's own past entries. This is a straightforward
query (entries where `created_at` matches today's month/day in a prior
year, or falls within a "N weeks ago" window if no same-date entry
exists) — no ML, no scoring model, no external dependency. Can run
server-side or client-side against the local cache; either is fine at this
scale. Worth deferring the smarter/predictive version entirely until
there's enough real usage data to make "smart" mean something, per `11`.

---

## Notifications

Per `04`'s ceiling and `07`'s "notifications land on Today, never
deep-link into a specific Strength" rule: implemented as standard local/push
notifications, opt-in, no default schedule enabled at install. No
frequency dial exposed beyond a low ceiling — this is as much a technical
  constraint (don't build the high-frequency scheduling UI at all) as a
policy one, since a feature that doesn't exist can't be crept up later
under growth pressure.

---

## Subscription / Payments

Standard platform in-app purchase (App Store / Google Play billing) for
the $1.99/mo, $19/yr recurring tiers and the one-time Founding Supporter
tier from ADR-002. No separate payment processor needed at MVP — adds
complexity (and a second compliance surface) without a clear MVP-stage
benefit, given both tiers fit cleanly into standard IAP products.

---

## What's Deferred Past Milestone 0

- Widget backend/sync considerations (`11` already deferred the feature
  itself; this is the technical footnote confirming there's no MVP
  architecture work needed for it yet).
- Server-fetched, updatable affirmation content library.
- Export/backup tooling (ADR-002's subscription-depth feature).
- Any predictive/smart Remember logic.
- Cross-device real-time sync beyond basic backup/restore — not required
  for Milestone 0's definition of done in `11`.

---

## CEO Decision #006 — Backend Provider

**Supabase, confirmed.**

Reasoning: lower cognitive and operational overhead than self-managed
infrastructure while operational costs stay near zero until there's a real
user base — matching the lean-team, low-subscription-price constraint this
document opened with. Postgres underneath means standard SQL, no
proprietary query language to build around, and a clean migration path if
Lighthouse ever outgrows it — portability matters for a company that
intends to own its data relationship with users rather than lock itself
into a vendor's model of it. That last point also matters philosophically:
Supabase's model — open-source core, exportable Postgres data, no
proprietary lock-in — fits Lighthouse's own emphasis on trust and
ownership of user data more naturally than a fully closed platform would.

## Encryption vs. the Remember Query — Resolved

These don't actually conflict, once split correctly:

- **`Entry.text`** — encrypted at the application layer before it's ever
  written to the database. Supabase/Postgres stores only ciphertext for
  this field. Decryption happens client-side after fetch, using a
  per-user key never stored alongside the data itself.
- **`created_at`, `strength_tags[]`** — stored as plain, queryable
  metadata. Nothing sensitive is exposed by knowing *that* an entry exists
  on a given date or under a given Strength — the sensitive part is
  *what it says*, which is exactly the part that's encrypted.

The Remember mechanic's date-matching query filters entirely on
`created_at`, so it never needs to touch the encrypted field to find a
match — it finds the row, then the app decrypts the text after fetching
  it. No conflict, no performance cost, no compromise on either requirement.

**Still worth a short technical spike before freezing:** confirming key
management specifics (per-user key derivation, what happens to
decryptability if a user resets their password) — a real but narrow
question now, not an open-ended one.
