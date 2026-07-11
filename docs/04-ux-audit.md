# 04 — UX Audit: Reverse-Engineering I Am

Status: Draft v0.1 — not yet frozen
Depends on: 00-charter.md, 01-experience-manifesto.md, 03-market-research.md

---

## Purpose

`03` told us *what* I Am gets right and wrong at a strategic level. This
document goes one layer deeper: the actual flows and mechanics, screen by
screen, so we know precisely what to keep, what to avoid, and what to build
differently on purpose rather than by accident.

Note: this audit is built from public reviews, store listings, and third-party
teardowns — not a hands-on session with the app yet. Screenshots and a proper
click-through belong in `research/competitors/i-am/screenshots/` before this
document freezes. Treat this as a strong first pass, not the final version.

---

## Core Loop (as best reconstructed)

1. **Onboarding** — user selects themes/intentions (confidence, anxiety,
   self-love, etc.) that determine which affirmations they'll see.
2. **Home screen** — a single affirmation card, swipeable to the next one,
   with a background image/theme.
3. **Notifications** — scheduled pushes deliver an affirmation directly,
   independent of opening the app. Frequency is user-configurable (users
   report choosing anywhere from 1x/day to 8–10x/day).
4. **Widgets** — home-screen and lock-screen widgets rotate affirmations
   without requiring the app to be opened at all. This is the standout
   mechanic and the one most credited with the app's reach.
5. **Journal** — a lightweight space to write down thoughts, mentioned
   positively but seemingly secondary to the core card/widget loop.
6. **Paywall** — hit early and often for themes, categories, and (per
   several reviews) unpredictably: features that were free become paywalled,
   sometimes get "fixed," then get paywalled again.

---

## What Works (keep the *principle*, not necessarily the mechanic)

| Mechanic | Why it works | Lighthouse equivalent |
|---|---|---|
| Home/lock-screen widget | Removes the need to open the app; positivity is ambient | Widget shows *your own* logged evidence, not a rotating stream — pull-based, no refresh pressure |
| Deep customization (themes, backgrounds) | Gives users a sense of ownership over a simple core object | Ownership comes from the fact that the *content* is theirs (their own entries), not just the skin |
| Simple onboarding (pick a few themes) | Low friction to first value | Onboarding should ask for the person's first piece of evidence, not a theme preference — get them into the real mechanic on day one |
| Journal feature | Users cite it as valuable even as a secondary feature | This isn't secondary for us — it *is* the primary mechanic, reframed as evidence-logging rather than open journaling |

---

## What Breaks (avoid deliberately, not by accident)

| Friction point | Evidence | Charter clause it violates | Our answer |
|---|---|---|---|
| Notifications persist after uninstall | Multiple review reports | "We ask permission" (Manifesto §5) | Notifications must be fully revocable, and we do not chase the user after they leave |
| Paywall flips (free feature → paywalled → "fixed" → paywalled again) | Repeated reviews describing exactly this pattern, with users citing greed | "We refuse to confuse pricing" (Manifesto §6) | ADR-002: core practice is never paywalled, period — not "currently free," permanently free |
| High-frequency notification options (up to 8–10x/day) | Reported as a user-selected setting, but the existence of the option nudges toward over-consumption | "We refuse to optimize for addiction" (Manifesto §6) | No notification-frequency dial that goes past a sane ceiling; ambient (widget) over interruptive (push) by default |
| Repetition fatigue | Long-term users note affirmations "get repetitive" | N/A — structural limit of a finite content library | Structurally avoided: since content is user-authored evidence, it never repeats — it's their own life, which keeps producing new entries |
| Generic "Welcome back!" after absence | Not directly evidenced in reviews, but standard for the category and explicitly named as an anti-pattern in `01-experience-manifesto.md` | "Returning after 47 days" example, Manifesto §3 | Already specified: *"It's good to see you again. We've been here whenever you were ready."* |

---

## The One Structural Difference That Matters Most

Every I Am screen — home card, widget, notification, even the journal — is
built around a **single object refreshed on a timer**: whichever affirmation
is currently showing. The interaction model is *consume, dismiss, next.*

Lighthouse's primary screen should be built around an **accumulating object**:
a Strength, with a growing list of entries underneath it. The interaction model
is *add, look back, notice the pattern.* That's not a styling choice — it's
the whole product decision from `03-market-research.md` made literal in the
UI. If the home screen still feels like "a card with words on it," we've
accidentally rebuilt I Am with better branding.

---

## Open Questions for 05-user-personas.md / 06-user-journeys.md

1. What does day-1, minute-1 look like if there's no theme-picker to lean on
   for instant value? What's the fastest path to a user's *first* entry?
2. How do we handle the empty state for a brand-new Strength without it feeling
   like a failure state (ties back to the no-streaks, no-guilt commitment)?
3. Is there a moment, analogous to I Am's swipe-to-next-affirmation, that
   gives Lighthouse the same "one thumb, ten seconds, satisfying" quality —
   without falling back to passive consumption?

---

## Sources

Same source set as `03-market-research.md` (I Am App Store/Google Play
listings and reviews, MWM.ai analysis, Selfpause and Vision Board editorial
reviews, JustUseApp aggregate review analysis).
