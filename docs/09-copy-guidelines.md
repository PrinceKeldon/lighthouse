# 09 — Copy Guidelines

Status: v0.1 — first pass, earned from actually writing `affirmations.json`
rather than speculated in advance
Depends on: 01-experience-manifesto.md §4 (Voice)

---

## The One Rule That Matters Most

**No copy should promise something we cannot know.**

This is the content-layer version of ADR-004's honesty constraint on
security copy — the same discipline showing up at a different layer of
the product. If it isn't verifiable or a philosophical stance we actually
hold, it doesn't go in the app.

- ❌ *"Someone, somewhere, is grateful you exist the way you are."* —
  lovely, but an assumption about another person's feelings we cannot
  actually know.
- ✅ *"Your worth was never something you had to prove."* — a
  philosophical stance, stated as one.
- ✅ *"You've gotten through every one of your hardest days so far."* —
  objectively true by definition; if the reader is here to read it, it's
  necessarily true.

Test before shipping any line: is this true, or a stance we're willing to
own as ours — or does it quietly ask the reader to believe something about
the world we have no way of backing up?

---

## Sentence-Level Variety

Individually strong lines can still create a flat, predictable rhythm in
sequence. Four sentence shapes to rotate between, not just one:

1. **Permission** — "You don't have to..." / "You're allowed to..."
   Useful, but shouldn't dominate. If more than half of any batch uses
   this shape, rewrite some into the other three.
2. **Observation / reflective statement** — "Small victories have carried
   entire seasons of your life." States something true about the reader
   rather than granting them permission.
3. **Question** — "What if today didn't need fixing?" Invites without
   asserting; use sparingly, it's the shape most easily overused into
   sounding like a prompt rather than an affirmation.
4. **Grounded fact** — "You've gotten through every one of your hardest
   days so far." Anchored in something objectively true, not sentiment.

---

## Categories

Beyond confidence and self-compassion (the obvious ones), two categories
worth deliberately writing for:

- **Gratitude** — not gratitude for circumstance, gratitude for existence
  itself. *"There is something quietly remarkable about simply being
  alive today."* Ties directly to the Charter's core belief.
- **Hope** — distinct from optimism. Hope doesn't claim things will be
  good; it claims tomorrow is still worth showing up for. *"Tomorrow is
  still worth meeting."*

---

## Voice Reminders (from 01, restated for quick reference while writing)

Warm, gentle, grounded, hopeful, quiet, present. Never preachy, never
exaggerated, never performative, never overly cheerful when someone may be
hurting. If a line could be shouted on a motivational poster with an
exclamation point, it's the wrong line for Lighthouse.

---

## Content Metadata (schema, not selection logic)

`affirmations.json` entries carry `tone`, `time_of_day`, and `energy`
fields for future use. Per `12-roadmap.md`'s Phase 3 gating: tagging
content with this metadata now is cheap and worth doing consistently as
new entries are written, but building selection logic that actually uses
it (morning-aware, energy-matched delivery) stays out of scope until the
core loop is validated. Don't let rich metadata quietly justify smarter
logic arriving early — that's the same mistake ADR-004 already caught
once, in a different part of the codebase.

---

## Open Item

This document is a first pass, written from ~48 entries. Revisit and
expand once there's a larger library and, ideally, real beta feedback on
which lines actually landed versus which felt flat in practice.