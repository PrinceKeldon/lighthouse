# 14 — Lighthouse Plus Vision (Preserved, Not Scoped)

Status: Preserved vision — explicitly NOT part of Milestone 0 / MVP 0.1
or the current beta. Revisit after the beta phase, per `12-roadmap.md`
Phase 4 ("Deepen Trust") gating.
Depends on: `core-loop.md`, `00-charter.md`, ADR-002

---

## Why This Document Exists

Same reasoning as `13-explore-lighthouses-vision.md`: this is a genuinely
good, well-reasoned product direction, developed across a separate
conversation, that deserves to be preserved in full rather than half-
remembered later or built under pressure before the current beta has
actually told us anything. Nothing here is scoped, approved, or
scheduled — it's captured so the thinking survives between now and
whenever it's actually time to build it.

---

## Naming Correction, Carried Forward

**Not "AI Companion" — "Reflection Companion."**

The distinction matters: the goal isn't conversation, it's reflection.
Conversation is one tool that enables it, not the destination. An app
that makes "talk to our AI" the product risks becoming dependent on the
AI's ability to keep generating value, with the user leaving each session
with nothing that belongs to them. That's the opposite of what Lighthouse
is for.

## Proposed AI Principle (candidate for `00-charter.md`, not yet added)

> **AI exists to deepen self-understanding, never replace it.**

Or, more simply: *the AI should ask better questions than it gives
answers.*

Test for every future AI feature: does this help the user think more
deeply about themselves, or does it encourage them to outsource their
thinking to the AI? The former belongs. The latter doesn't, regardless of
how popular or technically impressive it is elsewhere.

**This is a genuinely good candidate for the actual Charter**, not just
this vision document — it costs nothing to adopt now since no AI features
are scheduled before Phase 4 regardless. Flagging it here rather than
adding it unprompted; whether it graduates from "preserved vision" to
"actual Charter principle" is a deliberate call to make explicitly, not
something to slip in as a side effect of logging this conversation.

## Example of the Mechanic (illustrative, not a spec)

Instead of the AI solving a stated problem ("I don't think I'm good
enough for this interview"), it invites exploration: *"What makes today
feel different from the other times you've doubted yourself?"* Over time,
it can notice patterns across a user's own entries and reflect them back
— *"You've mentioned interviews three times this month, each time also
describing careful preparation. Do preparation and self-doubt tend to
arrive together for you?"* — holding up a mirror, not standing in front
of it. Months later, it can show someone their own change: comparing what
they wrote then to what they're living now.

---

## MVP 0.2 → Renamed: Lighthouse Plus v1.0

Deliberate renaming logic worth preserving: version numbers describe
software; by the time someone subscribes, they're choosing to invest in a
relationship with a product they already trust, not buying "more
features." Every Plus feature should answer one question: *does this
help someone build a kinder, more enduring relationship with themselves,
using their own lived experience?*

## The Eight Pillars (in build-priority order, per the original review)

1. **Guided Reflection** — themed 7-day series (e.g. "Beginning Again,"
   "Learning Self-Compassion"), unlocking naturally through continued
   reflection, not streaks.
2. **Reflection History** — thoughtful resurfacing of a user's own past
   entries ("Six months ago you wrote…", "You've mentioned courage 17
   times this year"). No AI required for this pillar specifically.
3. **Strength Insights** — stories, not analytics. "Courage quietly
   appeared 12 times this month," not "48 journal entries." Human
   language throughout, matching `09-copy-guidelines.md`'s existing
   discipline.
4. **Remember+** — richer resurfacing than the current calendar-date
   mechanic (e.g. "This reminds us of another time you overcame
   uncertainty"), still entirely grounded in the user's own life.
5. **Collections** — user-curated affirmation sets ("When I Need Hope,"
   "Before Sleep") as emotional toolkits.
6. **Themes** — different emotional atmospheres (Morning, Evening, Warm,
   Minimal, Forest, Paper), not flashy customization.
7. **Export** — PDF/Markdown/plain text. Explicitly framed as a trust
   signal ("your memories belong to you"), not just a feature.
8. **AI Companion (last, deliberately)** — per the Reflection Companion
   principle above. Observes, doesn't lead.

## Letters to Tomorrow (standalone feature idea, not in current roadmap)

Write a letter to yourself today; choose when it returns — tomorrow, one
month, one year, a birthday, a specific future date. Not email, not a
notification — a quiet moment waiting inside the app. Potential future
integration with the Reflection Companion pillar: the AI could ask
whether you'd like to read a letter before a related conversation, then
ask how the person who wrote it compares to the person reading it now.
Genuinely novel within this category and well aligned with the Charter's
"remember, don't invent" philosophy — worth real consideration when
Phase 4 planning actually begins.

---

## Pricing Proposal — FLAGGED CONFLICT, Needs Reconciliation

This document's proposal:
- Free: daily affirmation, Remember, journal, Strengths, basic history
- Lighthouse Plus: guided series, Collections, reflection insights,
  export, themes, Remember+, AI companion (later)
- **€4.99/month or €39.99/year — no lifetime purchase**

**This directly conflicts with the currently-active ADR-002 v1.1**, which
sets $1.99/mo or $19/yr specifically *below* category norm as a Charter-
level trust statement, plus a one-time Founding Supporter lifetime tier
added specifically to solve day-1 runway without compromising the ongoing
promise. This new proposal is roughly 2.5x the existing price and
explicitly removes the lifetime option ADR-002 deliberately included.

**This is not resolved by this document.** Whichever price is right
should be decided deliberately, informed by real beta data on willingness
to pay, not by whichever conversation most recently proposed a number.
When Phase 4 planning actually begins, this needs its own review — likely
an ADR-002 v1.2 — not a silent adoption of either number.

---

## What Would Need to Happen Before Any of This Is Buildable

- The current beta validates the core loop (Phase 1 of `12-roadmap.md`).
- Phase 2 (trust infrastructure) and Phase 3 (distribution, including
  `13-explore-lighthouses-vision.md`) are far enough along that adding a
  paid tier's worth of new surface area doesn't compete with more
  foundational work.
- The pricing conflict above is explicitly resolved, not defaulted.
- A real decision on whether "AI exists to deepen self-understanding,
  never replace it" graduates into `00-charter.md` proper.
