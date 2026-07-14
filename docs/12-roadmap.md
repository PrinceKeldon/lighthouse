# 12 — Roadmap

Status: v1.0
Depends on: 11-mvp-scope.md, ADR-002 (v1.1), ADR-003, ADR-004

---

## How This Roadmap Works

Not a feature roadmap — a decision roadmap. Each phase exists to answer a
business question before earning the right to solve the next one. Every
phase name follows the same thread the UX audit uncovered as the actual
competitive ground Lighthouse is playing on: trust.

---

## Phase 1 — Earn Trust

**Question this phase answers:** does the core loop from `core-loop.md`
actually make someone want to come back tomorrow?

Work:
- Founder dogfooding, evaluated against `01`'s emotional journey table,
  not just "did it crash"
- Small closed beta, matched to `05`'s personas
- IAP purchase flow completed (currently stubbed — needed before beta
  subscribers can actually experience the Plus moment)

**Evidence, not vanity metrics:**
- Founder uses Lighthouse daily for 14+ days
- Closed beta users voluntarily return multiple times within the first week
- At least some users create entries without being prompted

**Trigger to exit this phase:** the loop demonstrably produces return
visits without prompting, across more than just the founder's own usage —
an observed result, not a date on a calendar.

---

## Phase 2 — Protect Trust

**Question this phase answers:** is the app ready for people who found it
in the App Store, not people who were personally invited?

Work:
- Field-level encryption (ADR-003's architecture, revisited with real
  operational requirements rather than speculative ones)
- Backup policy, formally specified (flagged as open in ADR-003's layered
  security section)
- Key rotation cadence and audit logging (same flag)
- Privacy Policy updated to reflect the new baseline once encryption
  actually ships — not before

**Trigger to enter this phase:** ADR-004's explicit gate — before any
public App Store / Play Store release beyond closed beta. Non-negotiable,
already decided.

---

## Phase 3 — Grow Trust

**Question this phase answers:** now that the loop is validated, how does
it reach more people?

Work:
- Home/lock-screen widget. The widget is one of the most visible
  engagement surfaces in the category and should be revisited once the
  core loop has been validated.
- Revisit ADR-002 v1.1's tentative "widget is Plus-only" placement — worth
  genuinely reconsidering whether gating our strongest acquisition surface
  behind payment undercuts its own purpose, now that there's real usage
  data to reason from instead of speculation.
- Smart/predictive Remember selection (beyond calendar-date matching) —
  only meaningful once there's enough real entry data across real users
  to make "smart" mean something.
- **Explore Lighthouses** (see `13-explore-lighthouses-vision.md`) —
  the card-based, living-Strengths reimagining of the Strengths screen.
  A genuinely strong direction, deliberately not built during Milestone 0
  or the initial beta, since it changes IA, content strategy, and the
  paid tier simultaneously — exactly the kind of surface area that should
  wait until the simpler loop is proven on its own.

**Trigger to enter this phase:** Phase 1 validated the loop, Phase 2 made
the app safe for strangers. Growth work before either of those is
premature per `core-loop.md`'s own test: does this make the loop
stronger, or just make the top of the funnel louder without anything to
retain underneath it.

---

## Phase 4 — Deepen Trust

Everything ADR-002 v1.1 named as Plus-tier value, not yet built:

- Additional affirmation packs
- Guided reflection series
- Cross-device backup (distinct from Phase 2's backup *policy* — this is
  the user-facing restore feature)
- Rich history insights
- Export
- Themes
- Future AI companion features — introduced last, deliberately. AI is
  introduced only after Lighthouse has earned enough user trust that AI
  enhances an existing relationship rather than attempts to create one.

**See `14-lighthouse-plus-vision.md`** for a fully developed elaboration
of this phase — eight pillars, a "Reflection Companion" (not "AI
Companion") framing, and a "Letters to Tomorrow" feature idea. That
document also flags a real, unresolved pricing conflict with ADR-002 v1.1
that needs deliberate reconciliation before this phase begins, not a
default toward whichever number was proposed most recently.

**Trigger to enter this phase:** a real subscriber base exists to build
these for. Building Plus-tier depth before anyone has converted to Plus
is solving a problem nobody's paying to have solved yet.

---

## Release Gate

Before any external user beyond closed beta touches Lighthouse, all of
the following must be true — not a suggestion list, a checklist nobody
accidentally skips:

- [ ] Privacy Policy (legally reviewed, not just drafted)
- [ ] Terms of Service
- [ ] Support email / contact channel
- [ ] Account restore flow, tested
- [ ] Account deletion flow, tested — not just described in the policy
- [ ] Error reporting in place
- [ ] Working subscription purchase flow (not stubbed)

---

## Explicitly Not on This Roadmap

- Social feeds
- Public profiles
- Likes
- Comments
- Sharing for engagement
- Streaks
- Badges
- Leaderboards
- Artificial urgency
- Endless notifications

Sometimes what a company refuses to build says more than what it does build.

---

## Success

This roadmap is complete not when every planned feature ships, but when
Lighthouse consistently helps people begin and end their day with a
greater sense of worth than when they started. Features may change. The
Charter does not.
