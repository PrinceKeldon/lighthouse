# 11 — MVP Scope

Status: Draft v0.1 — not yet frozen
Depends on: 02-product-strategy.md, 07-information-architecture.md, 08-design-system.md, research/core-loop.md

---

## What Milestone 0 Has to Prove

Restating the original framing from Sprint 0, because it should govern
every line below: the goal isn't to ship every feature. The goal is to
answer one question — **can we help someone remember that they matter?**

Everything in this document is filtered through whether it's necessary to
test that question, or whether it's a good idea that can wait.

---

## In Scope

- **Today screen** — Affirmation display, optional Reflect prompt, Remember
  moment surfacing. This is the entire core loop from `core-loop.md`, and
  it has to work end to end or nothing else matters.
- **Strengths screen** — list view, detail view, empty state, manual entry
  creation (both from Today's Reflect prompt and directly from this screen,
  per `07`'s two-paths-one-object rule).
- **Settings** — account basics, notification toggle (off by default, low
  ceiling if enabled), Support Lighthouse (subscription + Founding
  Supporter tier per ADR-002).
- **Remember mechanic, simple version** — "on this day" resurfacing only:
  a past Entry from the same calendar date in a prior week/month/year, if
  one exists. No smarter pattern-matching or relevance scoring at this
  stage.
- **Core content library** — enough affirmations to avoid obvious repetition
  within a normal usage window (needs a real number from `10-technical-
  architecture.md` or content ops, not guessed here).

## Explicitly Out of Scope for Milestone 0

- **Home/lock-screen widget.** This is the one real trade-off worth stating
  plainly: `03` identified I Am's widget as its single biggest distribution
  advantage, so leaving it out is not costless. But it's genuine platform
  engineering (WidgetKit and equivalent), and Milestone 0's job is to prove
  the *loop* works, not to prove we can match I Am's distribution muscle on
  day one. Ship the loop, prove "Remember" lands, then build the widget to
  amplify something we've already confirmed works — not before.
- **Smart/predictive Remember selection** (e.g., surfacing entries based on
  detected patterns rather than calendar date). Real logic, real
  complexity, and untestable until there's enough real entry data to make
  "smart" mean anything. Calendar-based resurfacing is enough to validate
  whether the *mechanic* — not the *sophistication* — is what's landing.
- **Social or sharing features of any kind.** Nothing in the Charter or the
  personas asks for this, and every wellness-app failure mode around
  performative sharing is exactly what `01`'s "never performative" rule
  guards against. Not a phase-2 maybe — a deliberate non-goal unless a
  future document makes an explicit case for it.
- **Multiple Strength templates / suggested categories at onboarding.**
  `06`'s Day 1 flow already avoids configuration-first onboarding; adding a
  curated Strengths picker would quietly reintroduce it.
- **Export/backup, deeper reflection tooling.** These are the ADR-002
  "subscription unlocks depth" features by design — they can wait until
  there's a paying cohort to build them for.

---

## Platform Scope

Not resolved in this document — belongs properly in
`10-technical-architecture.md`, which doesn't exist yet. Flagging as the
next real gap after this one: single platform first (and which one) vs.
simultaneous iOS/Android has real cost and timeline implications that
shouldn't be decided as a side note here.

---

## Definition of Done for Milestone 0 — "Remember"

Ship-ready when:
1. A new user can complete Day 1 from `06` — receive an affirmation, create
   a first Strength entry — without any configuration screen first.
2. The app can run the daily loop for at least a few weeks of real use
   without a streak, counter, or guilt-inflected copy appearing anywhere.
3. At least one calendar-based Remember moment can occur and does not
   compete visually with the day's Affirmation (per `08`'s component spec).
4. Subscription is reachable and functional, framed per ADR-002, with zero
   interstitial paywall interruptions anywhere in the Today or Strengths flow.
5. Nothing in the shipped app requires a user to understand or see the
   words "evidence," "identity," "Layer 1/2/3," or "Strength" (as internal
   philosophy, not the UI label itself) to have the experience land — the
   Layer 3 test from `02`.

If all five hold, Milestone 0 has done its job: answering whether someone
can be helped to remember that they matter, without the product ever
needing to say so.
