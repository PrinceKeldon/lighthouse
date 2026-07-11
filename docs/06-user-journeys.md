# 06 — User Journeys

Status: Draft v0.1 — not yet frozen
Depends on: 01-experience-manifesto.md (emotional journey table), 02-product-strategy.md, 04-ux-audit.md, 05-user-personas.md

---

## The Loop This Journey Is Built On

Locked in this round of CEO review:

**Receive → Read → Reflect (optional) → Remember → Return tomorrow**

The affirmation is the hero, matching what the category trained 10M people
to expect. Reflection is the quiet layer underneath it — never mandatory,
never homework. This replaces the entry-first framing in `04`'s "single
object vs. accumulating object" section: the *screen* still opens on an
affirmation, matching I Am's category cue exactly. What differs is what's
available one step beneath it.

---

## Day 1 — Minute 1

Applies to all three personas from `05`, tuned per person:

1. **App opens.** No theme-picker as the first screen. Instead, a single
   affirmation appears immediately — this satisfies the category
   expectation instantly (Layer 1: "yes, this is an affirmations app").
2. **A gentle second prompt follows**, not a form: *"What's one thing
   you've done, even once, that you're quietly proud of?"* — the broadened
   version from this review, chosen specifically so it works even on a bad
   day (The Quiet Rebuilder's case).
3. User answers in a sentence or two. This becomes their first entry,
quietly filed under a Strength the app suggests or they name themselves.
    No mention of "evidence," "strengths," or the underlying philosophy —
   the copy stays warm and plain.
4. **Emotional target (per `01`'s table): Safe, then Seen.** The user should
   feel like they got the thing they came for (an affirmation) *and*
   experienced something that felt personal, without being asked to
   understand why.

No explanation of what makes Lighthouse different is given here. Per the
CEO correction: users don't need to know the philosophy. They need to feel it.

---

## Days 2–6 — Building the Rhythm

Each day follows the same shape, and the shape is the whole retention
strategy:

- **Receive / Read** — a new affirmation, same as any app in the category.
- **Reflect (optional)** — a soft, skippable prompt tying today's affirmation
  to something real: *"Has there been a moment recently that reminds you
  this might already be true?"* Skipping it costs nothing — no streak
  break, no guilt copy, nothing withheld.
- **Remember** — periodically (not every day — over-frequency risks turning
  a magic moment into a mechanic), a resurfaced past entry appears instead
  of, or alongside, the day's affirmation: *"On this day, six weeks ago,
  you wrote: [entry]."* This is the single highest-leverage moment in the
  whole journey — it's the point where the product stops resembling I Am
  at all, without ever saying so.
- **Return tomorrow** — no streak counter, no "don't lose your progress"
  language. The Manifesto's existing "Returning Tomorrow: Welcome" /
  "Missing a Week: Accepted" emotional targets govern this entirely as-is;
  nothing about this journey changes them.

**Per persona:**
- *Quiet Rebuilder* — likely skips Reflect on the hardest days. That has to
  be completely fine, visually and emotionally. The app should never
  register this as absence.
- *Steady Achiever* — most likely to engage with Reflect regularly, treating
  it as part of an existing habit stack. By day 5–6 he has a small but real
  collection under a Strength without having consciously "worked" at it.
- *Returning Believer* — watching for the bad pattern the whole time.
  Days 2–6 are less about a specific delightful moment and more about the
  cumulative absence of red flags: no paywall surprise, no notification
  creep, no manufactured urgency.

---

## Day 7 — The Moment of Difference

This is the moment the CEO review names directly: *"This feels different.
I can't quite explain why, but it feels like it's actually helping me."*

What produces that feeling by day 7, concretely:

1. At least one **Remember** moment has landed — a resurfaced entry that
   felt personal rather than generic.
2. The user has, without being told to, accumulated a small handful of
   entries under one or two Strengths — visible if they go looking, invisible
   if they don't.
3. Nothing negative has happened yet — no paywall flip, no notification
   overreach, no guilt-inflected copy for a skipped day.

This is also, per `02`, roughly where a Founding Supporter or subscription
moment could land for a persona who's ready for it (most plausibly the
Returning Believer, who came in most skeptical and is now the one most
relieved). Per the Manifesto's emotional journey table, that moment should
land as **Confident**, not urgent — no countdown, no "before it's too late."

---

## Emotional Journey, Restated With Days Attached

| Day | Moment | Target Feeling (from `01`) |
|---|---|---|
| Day 1, minute 1 | First open, first affirmation | Safe → Seen |
| Day 1, end | First entry created | Hopeful |
| Day 2–6 | Daily loop, at least one skipped day | Welcome / Accepted |
| Day 2–6 | First "Remember" resurfacing | Understood |
| Day 7 | Cumulative trust, possible subscription moment | Confident |

---

## What This Journey Deliberately Does Not Do

- It does not explain the philosophy to the user at any point. Per the CEO
  correction, "evidence," "identity," and "Strengths" are internal design
  language, not onboarding copy.
- It does not introduce a streak, counter, or progress bar anywhere in the
  first week.
- It does not front-load configuration (theme selection, notification
  frequency, category preferences) before the user has experienced value —
  this was the specific critique of I Am's onboarding in `04`, and it still
  holds even under the revised, category-respecting positioning.

---

## Open Question for 07-information-architecture.md / 08-design-system.md

The in-app label for a Strength is still unresolved (noted in this round of
CEO review — "Truths" was proposed but not confirmed against the new
Layer 1/2/3 framing). This journey document is written using "Strength" as a
neutral placeholder; whichever label wins should read naturally inside the
Reflect and Remember copy shown above without changing the emotional
targets in the table.
