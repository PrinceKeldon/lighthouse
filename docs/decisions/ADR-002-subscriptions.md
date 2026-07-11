# ADR-002 — Monetization Model

Status: v1.1 — supersedes v1.0's single-tier framing with an explicit
Free / Lighthouse Plus structure. Per the Charter's immutable-history rule,
this is a version, not a silent rewrite — v1.0's reasoning is preserved
below where it still holds.

## Decision

Lighthouse launches with a free tier and a paid tier on Day 1. The free
tier is complete enough for someone to build a meaningful daily practice.
The paid tier deepens that practice — it never gates it.

**Free, forever:**
- Daily affirmation
- Daily reflection
- Personal evidence (Entries)
- Strengths
- Basic reminders

This is the product. It is never taken away, reduced, or re-gated after
the fact — the exact pattern that produces I Am's angriest reviews.

**Lighthouse Plus** ($1.99/month or $19/year — unchanged from v1.0,
deliberately below category norm):
- Additional affirmation packs
- Guided reflection series
- Cross-device backup
- Rich history insights
- Export
- Future AI companion features
- Themes
- *(Widget: tentatively Plus, flagged for reconsideration in
  `12-roadmap.md` — see Reasoning below)*

**Founding Supporter** (~$49–79, one-time): lifetime Lighthouse Plus
access. Solves day-1 runway independent of recurring conversion, unchanged
in purpose from v1.0.

**No free trials.** Premium is introduced honestly during onboarding —
never hidden, never sprung on the user later — with no trial period, no
countdown, no "only today," no surprise renewal.

## Reason

Two things converge here: v1.0's original Charter-conflict reasoning
(exploiting vulnerability, confusing pricing) still holds and is preserved
below. New reasoning added in this version:

- `03-market-research.md`'s review analysis found billing and paywall
  behavior — not affirmation content — as the dominant source of I Am's
  negative reviews. Free trials are structurally the mechanism most likely
  to reproduce that exact complaint (surprise renewal, forgotten
  cancellation). Removing them removes a failure mode we have direct
  evidence for, not a hypothetical one.
- The psychological framing matters: a user who has already been helped by
  the free tier, then offered Plus, thinks "this has already helped me."
  A user hitting a paywall before receiving value thinks "this won't help
  me unless I pay." Only the first is compatible with the Charter's trust
  principle.
- **New Charter-level principle, added to `00-charter.md`:** *Revenue
  should be the consequence of trust, not the prerequisite for it.*

**Open item, not resolved by this ADR:** gating the widget behind Plus
tentatively works today only because the widget is already deferred past
MVP (`11`). Before it's actually built, revisit whether gating our single
strongest acquisition mechanic (per `03`) behind the paywall undercuts its
own purpose — flagged for `12-roadmap.md`.

v1.0's original reasoning, preserved: Section 6 of the Experience
Manifesto commits us to refusing to exploit vulnerability for engagement.
Entries in this product are private evidence about who someone is, often
written during hard moments. Ad targeting requires reading that signal to
sell something against it — a different relationship to the data than the
one we're promising. I Am's most common complaint isn't the price — it's
the feeling of being squeezed (paywalls reappearing, notifications
outliving deletion). Ads are a quieter version of the same erosion.

## Alternative Considered (v1.0)

Freemium with relevant/targeted advertising as a secondary revenue stream
alongside subscription.

## Alternative Considered (v1.1)

Free trial period (7 or 14 days) before Plus billing begins, standard SaaS
pattern.

## Rejected Because

**Advertising (v1.0):** conflicts with the Charter's refusal to exploit
vulnerability for engagement, and undermines the trust gap identified as
our differentiation in `03-market-research.md`.

**Free trials (v1.1):** trades a short-term conversion lift for the exact
billing-trust failure mode `03` already identified as I Am's top complaint
category. B2B SaaS pricing advice — where free trials are near-universal —
assumes a different ethical context (does this save the company money)
than Lighthouse's (does this help someone who may already be emotionally
vulnerable). We can learn pricing discipline from SaaS practice without
inheriting every growth tactic that comes with it.
