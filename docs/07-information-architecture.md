# 07 — Information Architecture

Status: Draft v0.1 — not yet frozen
Depends on: 02-product-strategy.md, 04-ux-audit.md, 05-user-personas.md, 06-user-journeys.md, research/core-loop.md

---

## Purpose

`core-loop.md` answered *why* someone returns tomorrow, in human terms.
This document turns that into structure: what objects exist, what screens
exist, and how someone actually moves between them. Still no visual design
— that's `08`. This is the skeleton.

---

## Core Objects

Two content types exist in the app, and keeping them distinct is the
single most important architectural decision here — conflating them would
quietly turn Lighthouse back into I Am.

### 1. Affirmation
The category-expected content. Short, written by us (or curated), delivered
on a rotation. This is Layer 1 — what makes the app legible as "an
affirmations app" the moment it opens.

```
Affirmation {
  id
  text
  theme_tags[]     // used only to keep rotation sensible, never shown
                    // as a configuration step to the user
}
```

### 2. Entry (and Strength)
The Layer 2/3 object, unchanged from the schema drafted earlier in this
project:

```
Entry {
  id, created_at, text, strength_tags[], prompt_id (nullable), weight, private: true
}

Strength {
  id, name, entries[], first_evidence_at
}
```

**Architectural rule:** Affirmation and Entry never merge into a single
feed. An Entry can be *created in response to* an Affirmation (the Reflect
step), but they remain separate objects with separate lifecycles. This
keeps the "affirmation as hero" principle intact structurally, not just
stylistically — it would be easy to accidentally build a single unified
"card stream" that quietly erases the distinction `02` spent so much effort
establishing.

---

## Screen Map

Four primary surfaces, plus the widget. No tab bar with five-plus items —
per `01`'s "quiet, present, never performative" voice, the structure itself
should feel unhurried.

```
┌─────────────────────────────────────────┐
│  Today          (default / home)         │
│  Strengths         (the accumulating record)│
│  Settings       (account, notifications, │
│                  subscription)           │
└─────────────────────────────────────────┘
        +
   Home/Lock-screen Widget (reads Strengths, write-only surface not required)
```

Three tabs, not five. Nothing about "browse affirmations by category" gets
its own tab — that's the I Am configuration-first pattern `04` flagged as
the thing to avoid.

### Screen 1 — Today
Maps directly to the loop's Receive → Read → Reflect → Remember steps.

- Default view on open: today's Affirmation.
- Below it, collapsed by default: the optional Reflect prompt.
- On days the "Remember" mechanic triggers (not daily — see `core-loop.md`),
  it replaces or sits above the affirmation, framed as arriving *instead
  of* competing with it — never both fighting for attention at once.
- No infinite scroll, no "next affirmation" swipe deck. One affirmation,
  one day. This is a deliberate structural break from I Am's swipeable-card
  model — it removes the passive-consumption ceiling `03` identified, by
  design rather than by content limits.

### Screen 2 — Strengths
The accumulating record. This is where `05`/`06`'s "byproduct, not chore"
principle has to hold up structurally:

- List of Strengths, each showing its entry count quietly (small, not a
  progress bar, not a streak-style counter — see `04`'s empty-state rules).
- Tapping in shows entries chronologically, plain text, no gamified layout.
- Empty Strengths render with the possibility-framed copy locked in `04`
  ("A quiet place for moments that remind you...").
- New Entry creation is reachable from here *and* from the Today screen's
  Reflect prompt — two paths into the same object, never two different
  objects.

### Screen 3 — Settings
Standard, but two items get special architectural attention given ADR-002
and the Charter:

- **Notifications** — off by default beyond a sane, low ceiling (per `04`);
  no dial that goes up to I Am's reported 8–10x/day range.
- **Subscription** — framed as "Support Lighthouse," not "Upgrade" or
  "Unlock." The screen itself is architecture, not just copy: it should not
  be reachable via an interstitial paywall interrupting the Today or
  Strengths flow. It's a destination the user visits on purpose, not a wall
  put in front of them.

### Widget
Reads from Strengths (the user's own resurfaced entries), not from the
Affirmation feed. Pull-based — updates when the user opens the app, no
background refresh cadence to manage or to accidentally turn into a
notification-adjacent nag. This was the distribution call made back during
the UX audit discussion; restating it here as the architectural spec, not
just the principle.

---

## Navigation Rules

1. **Today is always the landing screen.** No "continue where you left off"
   logic that reopens Strengths — the category expectation (open app, get an
   affirmation) has to be honored on every single open, not just day one.
2. **Reflect never blocks Read.** The affirmation is fully visible and
   complete on its own before any reflect prompt is shown — someone who
   wants to read and leave should be able to in one glance, zero taps
   beyond opening the app.
3. **No cross-navigation forced by notifications.** If we ever add an
   opt-in notification, it should land on Today, not deep-link into a
   specific Strength — keeps the "ambient, not interruptive" rule structurally
   enforced rather than dependent on someone remembering not to violate it later.

---

## What's Explicitly Out of Scope Here

- Visual layout, spacing, color, typography — `08-design-system.md`.
- The in-app label for "Strength" (still unresolved) — also `08`, alongside
  `09-copy-guidelines.md`.
- Whether Remember-moment frequency is fixed, random, or triggered by
  specific conditions (e.g., only after 2+ weeks of entries exist) — this
  needs its own small spec, probably folded into `08` or a future
  `10-technical-architecture.md` section, since it has real backend logic
  behind it (what counts as a "meaningful" resurfaced entry vs. a random one).

---

## Open Questions for 08-design-system.md / 11-mvp-scope.md

1. Does Milestone 0 ("Remember") need the Widget at launch, or can it ship
   Today + Strengths + Settings only, with the widget as a fast-follow? Given
   `03` flagged the widget as I Am's single biggest distribution advantage,
   this is a real scope trade-off, not a minor one.
2. Strength naming — deferred twice now, has to land in `08`.
3. Does the Remember mechanic need real logic at MVP, or can Milestone 0
   ship with a simpler version (e.g., "on this day" only, no smarter
   selection) and treat true pattern-surfacing as a post-MVP layer?
