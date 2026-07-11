# 08 — Design System

Status: Draft v0.1 — not yet frozen
Depends on: 00-charter.md, 01-experience-manifesto.md, 07-information-architecture.md

---

## CEO Decision #005 — Naming, Finally Resolved

**Trait → Strength.**

"Add to your Strengths." "Your Strengths." "A new Strength." This closes
the naming question deferred in `05`, `06`, and `07`.

Why it works where "Truths" didn't: "Truths" made a claim (this is
objectively true), which sits oddly next to a Charter built on humility and
never overstating what we know about someone. "Strength" makes no claim —
it just names the container. It's also legible on its own if it ever
surfaces publicly (App Store screenshots, a review, a screenshot someone
shares), unlike "Truths," which would need explaining. That matters given
`02`'s Layer 1 rule: nothing internal should require a user to learn our
vocabulary to understand what they're looking at.

**Action item:** `05-user-personas.md`, `06-user-journeys.md`, and
`07-information-architecture.md` all use "Trait" as a placeholder. They
need a pass to update the term before Foundation v1.0 freezes — noting this
here rather than doing a silent retroactive edit, per the "documents are
immutable history, we version them" rule from Sprint 0.

---

## Design Principles (derived directly from the Manifesto)

The Manifesto already specified the personality in `01`: warm, gentle,
grounded, hopeful, quiet, present. Translated into design terms:

| Manifesto voice | Design consequence |
|---|---|
| Warm | Off-white/parchment backgrounds, not clinical white or dark-mode-by-default. No cold blues as a primary surface color. |
| Gentle | Soft transitions, nothing that snaps or pops. No confetti, no celebratory bursts on entry creation — the Charter already refuses gamification, and animation is where that's easiest to accidentally violate. |
| Grounded | Generous whitespace, low visual noise. One thing on screen at a time (see `07`'s "Reflect never competes with Read" rule, now stated visually). |
| Hopeful | Warm accent color used sparingly, for moments of real significance (a new Strength created, a Remember moment) — not applied uniformly, or it stops meaning anything. |
| Quiet | No badges, streak flames, progress rings, or numeric emphasis anywhere. Entry counts, where shown at all, are small and unstyled. |
| Present | No skeleton loaders dressed up as "personality" (spinning mascots, cute loading jokes). Loading states are brief and plain. |

**The test for every screen:** if you removed all color and just read the
layout out loud, would it still sound calm? If a screen needs bright color
or animation to *feel* calm, the layout is doing the wrong job.

---

## Typography

Two-voice system, matching the Affirmation/Entry object split from `07`:

- **Affirmation voice** — a warm, slightly editorial serif. This is the
  one place in the app allowed to feel a little more considered/crafted,
  because it's the category-expected hero moment (`02`'s Layer 1 rule).
- **Interface voice** — a clean, quiet sans-serif for everything else:
  navigation, Strengths, settings, entry text. Keeps the rest of the app
  out of the way of the affirmation rather than competing with it.

(Specific typeface selection — e.g., whether to share lineage with the
Architecture of You workbook's system for brand coherence across the
"identity through evidence" body of work, or choose something distinct for
a mobile/notification context — is a decision to make with actual type
specimens in front of us, not abstractly here. Flagging the option, not
resolving it.)

---

## Color

Warm-neutral base, not stark white or dark:

- **Base:** parchment/warm off-white (light mode), warm charcoal — not
  pure black — for dark mode.
- **Accent (sparing use only):** a single warm, muted tone — amber or
  clay-adjacent — reserved for Strength creation and Remember moments.
  Everything else stays neutral so the accent still means something when
  it appears.
- **Explicitly avoided:** saturated "motivational poster" gradients,
  multiple competing accent colors, red/orange urgency colors anywhere
  near the subscription screen (`07` already ruled out urgency copy there;
  this extends the rule to color).

---

## Core Components

### Affirmation Card
Full-width, serif type, generous padding, nothing else competing on the
screen at first glance. The Reflect prompt sits below, visually quieter
(smaller type, muted color) so it reads as optional rather than as a
second mandatory field.

### Strength (list item + detail)
List item: name, entry count in small quiet type, no progress indicator.
Detail view: chronological plain-text entries, dated simply. No card
borders or shadows around individual entries — they should read like lines
in a notebook, not like isolated achievement tiles.

### Empty Strength State
Exact copy already locked in `04`: *"A quiet place for moments that remind
you you were patient. When one arrives, it'll feel right at home."*
Visually: no illustration of an empty box, no dotted-line placeholder that
reads as "missing." Plain text, centered, generous whitespace — the empty
state should look intentional, not broken.

### Remember Moment
Visually distinct enough to feel like an arrival, not a routine element —
this is the component most worth spending real design effort on, since
`core-loop.md` names it as the single highest-leverage moment in the
product. Suggest: full-bleed treatment, the accent color used here
specifically, a slight pause before it's dismissable (not skippable in
half a second) so it registers as significant.

### Subscription / "Support Lighthouse"
No countdown, no red, no crossed-out "was/now" pricing theater. Warm,
plain, closer in tone to a thank-you note than a sales page — matching the
"patron, not customer" framing from ADR-002 structurally, not just in copy.

---

## Motion

Soft fades and gentle vertical settles only. No bounce, no elastic
overshoot, no celebratory particle effects anywhere — these read as
gamification even when the copy around them doesn't, and the Charter
already refuses gamification outright.

---

## Open Item Carried to 09-copy-guidelines.md

Voice principles above are structural (color, motion, layout). The actual
sentence-level writing rules — how "warm but never performative" translates
into specific phrasing patterns — belongs in `09`, not here.
