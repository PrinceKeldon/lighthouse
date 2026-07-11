# 02 — Product Strategy

Status: Draft v0.1 — not yet frozen
Depends on: 00-charter.md, 01-experience-manifesto.md, 03-market-research.md, 04-ux-audit.md

Note on ordering: this document was written after `03`, `04`, `05`, and `06`
rather than before them, per the original document order. That turned out
to be the right sequence in practice — this strategy is largely the
synthesis of decisions those documents (and the CEO review that followed
them) already forced us to make. Nothing here is new thinking; it's the
frozen version of conclusions reached along the way.

---

## The Decision This Document Exists to Protect

Early on, we drifted toward defining Lighthouse as a new category — an
"evidence app," distinct from affirmations apps entirely. That was reversed,
deliberately, and this document exists to make sure the reversal sticks the
next time the temptation resurfaces (it will).

**We are not creating a new category. We are entering the largest validated
category in this space and earning our place in it.**

Apple didn't invent the MP3 player. Google didn't invent search. Notion
didn't invent note-taking. Lighthouse doesn't invent affirmations. We make
the best version of a thing 10M+ people have already told the market they want.

---

## Market Category

**Daily Affirmations & Positive Mindset.**

**Existing leader:** I Am — 5M+ downloads on Google Play alone, ratings
in the high 4s, the dominant reference point anyone in this category will
compare us to whether we invite the comparison or not. See `03` for full
teardown.

**Why we respect this number rather than route around it:** 10M+ downloads
across the category is not noise, it's validated demand. It has already
done the market education we would otherwise have to pay for. People
already search for "affirmations," "self love," "confidence," "daily
motivation" — not for anything we would internally invent to describe
Lighthouse. Fighting that would mean spending years re-educating a market
that's already decided what it's looking for.

---

## User Intent

People in this category are not shopping for features. They're shopping
for a feeling:

confidence · hope · motivation · self-love · encouragement · calm ·
emotional support · daily positivity

Every persona in `05-user-personas.md` maps to this list, not to any
internal product vocabulary. That's intentional and should stay that way
through every future document.

---

## Our Position

**The most trusted affirmations app.**

Not "the AI affirmation app." Not "the evidence app." Not "the identity
app." Those are internal design language — useful for us, meaningless (or
actively confusing) as a pitch to someone deciding between us and I Am in
an app store search.

Externally, we are the affirmations app people recommend because it
genuinely helps.

---

## The Three Layers

This is the framework that resolved the original strategy drift, and it
should govern every future product decision:

| Layer | What it is | Example | Who sees it |
|---|---|---|---|
| **1. Market Positioning** | What users think they're downloading | "A daily affirmations app" | Everyone, from the App Store listing onward |
| **2. Product Experience** | What they actually experience | Read → Reflect (optional) → Remember, instead of Read → Swipe → Repeat | Every active user, felt not explained |
| **3. Internal Philosophy** | Why we build it this way | The Charter; "evidence," "identity," "Trait" as design vocabulary | Nobody outside this repo |

Layer 1 already has product-market fit — proven by I Am's download numbers.
We don't touch it. Layer 2 is where Lighthouse wins. Layer 3 is invisible
by design; it explains our decisions to *us*, not to users.

**Working rule:** any time a document (or a feature idea) starts trying to
move Layer 1 — renaming the category, explaining the philosophy in
marketing copy, positioning against affirmations rather than within them —
that's the drift to catch and correct.

---

## Differentiation

Entirely a Layer 2 phenomenon. None of this changes what category we're
in; all of it changes what using the product feels like after day one:

- Better onboarding — first minute creates something the user owns, instead
  of configuring preferences before experiencing any value (`06`, Day 1).
- Better personalization — content drawn from the user's own life, so it
  never hits the repetition ceiling I Am's long-term users report (`03`).
- Better trust — no paywall flips, no notifications that outlive deletion,
  no manufactured urgency at the subscription moment (`04`, ADR-002).
- Better daily loop — Receive → Read → Reflect (optional) → Remember →
  Return tomorrow, instead of Read → Swipe → Repeat (`06`).
- Better empty states — possibility, not deficit; no streaks, no guilt (`04`).

**Product principle:** every interaction should reinforce today's
affirmation rather than distract from it. The affirmation stays the hero;
reflection, memory, and personalization exist to make it land more deeply,
never to compete with it for attention.

---

## Competitive Advantage — Precisely Stated

We are not competing on affirmations alone. We are competing on the
complete experience surrounding them: onboarding, trust, personalization,
transparency, emotional tone, daily ritual, reflection, reliability.

The analogy that holds up best: Dropbox was downloaded for file syncing and
retained for becoming people's external memory — a shift the product earned
through experience, never through marketing language. Lighthouse follows
the same shape. Downloaded for affirmations. Retained because the
affirmations start to feel believable.

---

## Company Principles Locked From This Round

- **Market familiar. Product remarkable.**
- **Enter through expectation. Stay through experience.**

Both should be treated with the same weight as the Charter's existing
principles — they now govern positioning decisions the way the Charter
governs experience decisions.

---

## Monetization Summary

Full decision and reasoning live in `ADR-002-subscriptions.md`. Restated
briefly here because it's load-bearing for strategy, not just pricing:

- $1.99/month or $19/year — below category norm, deliberately.
- Core practice never paywalled; subscription unlocks depth, not access.
- One-time Founding Supporter tier (~$49–79) solves day-1 runway without
  compromising the ongoing promise.
- No ads. The trust-erosion pattern in I Am's reviews (`03`) is the
  single biggest opening we have, and ad-targeting on private personal
  data would quietly recreate it.

---

## What This Document Does Not Decide

- The in-app label for a Trait ("Truths" or otherwise) — belongs to
  `08-design-system.md` / `09-copy-guidelines.md`, and is explicitly a
  Layer 2/3 decision, not a Layer 1 one. It should never appear in
  marketing copy regardless of what's chosen.
- Exact onboarding prompt wording — flagged in `06` as something to refine
  through testing, not to freeze here.
- Notification behavior specifics beyond the ceiling already set in `04`
  (ambient/widget over interruptive/push by default).

---

## Immediate Next Step

`research/core-loop.md` — the one-pager the CEO review assigned before
wireframing begins. It should answer, in human terms, why someone opens
Lighthouse tomorrow. Everything in `07-information-architecture.md` onward
should be traceable back to that answer.
