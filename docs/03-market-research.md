# 03 — Market Research

Status: Draft v0.1 — not yet frozen
Depends on: 00-charter.md, 01-experience-manifesto.md

---

## Why This Document Exists

Before we write a line of strategy, we need to know what already exists — not to copy it, and not to dismiss it, but to understand exactly what problem is already being solved, how well, and where it's being solved *badly*.

Every gap we find here becomes either:
- a reason Lighthouse doesn't need to exist (be honest about this), or
- evidence for a specific strategic choice in `02-product-strategy.md`.

---

## Primary Competitor: I Am — Daily Affirmations (Monkey Taps)

**What it is.** A widget- and notification-first affirmations app. Users pick themes, and the app surfaces short affirmations on the home screen, lock screen, and via push notifications. It's text-first and passive — the product's value is in encountering affirmations frequently and with no effort, not in any guided or spoken practice.

**Scale.** This is the category leader. One tracking source estimates over 610,000 US ratings at a 4.85 average; Google Play shows 5M+ downloads with a 4.8 rating. Whatever we build, we're building it in a market I Am has already proven is large.

**What it gets right.**
- **Distribution mechanic.** Putting affirmations on the home screen and lock screen removed the need to remember to open an app at all — the positivity comes to the user. This is repeatedly cited as the reason it spread as widely as it did.
- **Emotional resonance, when it lands.** A meaningful share of reviews describe real impact during genuinely hard periods — illness, separation, grief, loneliness. The mechanic is simple, but for some users at some moments, it's clearly not shallow.
- **Low-friction customization.** Backgrounds, categories, notification frequency, and (in the "I am +" variant) AI-generated affirmations and voice playback give users a sense of ownership over a fairly simple core loop.

**Where it breaks — and where it breaks its own promise.**
- **Passive, not active.** The core mechanic is reading someone else's words. That builds exposure, not ownership — there's a real difference between being told something and building your own evidence for it.
- **Subscription trust erosion.** This is the pattern that matters most for us. Multiple reviews describe features being paywalled, "fixed," and then paywalled again, with users explicitly using the word *greed*. One long-time paying user described losing access to basic themes the moment they had to cancel during a hard financial stretch — the exact moment the app should have mattered most.
- **Notifications outliving consent.** Users report persistent notifications continuing even after the app is deleted — a direct violation of the kind of "we ask permission" behavior we wrote into the Experience Manifesto.
- **Repetition fatigue.** Even satisfied long-term users note the affirmations "get a little repetitive after a while" — the passive model has a ceiling.

**Direct line to our Charter:** the negative cluster of I Am's reviews is almost a checklist of Section 6 ("Things We Refuse To Do"). That's not incidental — it tells us the Charter is aimed at a real, already-felt failure mode in this category, not a hypothetical one.

---

## Adjacent Competitors

### ThinkUp / Selfpause (voice-recording affirmation apps)
Built on a different core mechanic: you record affirmations in your own voice, often layered with music, and play them back. This is a more active practice than I Am's model, and it's the category most explicitly positioned as "more effective, more effort." I Am's own "I am +" tier has started moving this direction with guided sessions and voice options — a signal that the market already senses passive reading has a ceiling.

**Relevance to us:** validates that "your own input, not just consumption" is a real axis of differentiation — but recording your voice is still evidence of a *statement*, not evidence of a *pattern*. There's room beyond even this.

### Aura (broad self-care platform)
A meditation-and-sleep-first platform that includes affirmations as one feature among many — guided meditations, breathwork, sleep stories. Reviews suggest that because affirmations aren't the sole focus, users looking for a dedicated affirmation practice find it comparatively limited.

**Relevance to us:** a caution more than a competitor. Breadth dilutes a specific promise. If Lighthouse tries to be everything, it risks becoming what Aura already is for this specific use case — fine, but not *the* answer to anything.

### Motivation — Daily Quotes
A pure motivational-quotes push-notification app. Simple, adjacent, not really a direct competitor — closer to a wallpaper-and-notification utility than a mindset practice. Worth noting only because it shows the low end of this market: content-as-notification-stream, no practice, no structure.

---

## The Gap We're Actually Looking At

Line up the category like this:

| App | Core Mechanic | What It Builds |
|---|---|---|
| I Am | Read affirmations others wrote | Exposure |
| ThinkUp / Selfpause | Record affirmations in your own voice | A statement |
| Aura | Affirmations inside a broader wellness bundle | Breadth |
| **Lighthouse (hypothesis)** | ? | **Evidence** |

Nobody in this category is helping someone accumulate *proof* of who they are over time. Everyone is delivering or capturing a statement — a nice sentence, said by someone else or by you, once. Nobody is treating identity as something built cumulatively from a person's own history of small, real moments.

That's the white space. It's also the sharpest test for `02-product-strategy.md`: if our strategy doesn't clearly do something none of these four rows do, we haven't earned the right to exist next to I Am's 5M downloads.

---

## Open Questions for 02-product-strategy.md

1. What does "evidence" actually mean as a data structure — not as poetry? What is a Lighthouse "entry," concretely?
2. Do we compete on distribution (widgets/notifications, I Am's proven strength) or deliberately *not* — given Section 6 of the Manifesto already flags notification anxiety as a refusal?
3. What is our monetization model, given that subscription trust erosion is the single most common complaint against the category leader? This isn't a UX question — it's a Charter-level decision (see ADR-002 precedent).
4. Is there a defensible reason someone who already has I Am also needs Lighthouse — or are we asking people to replace it?

---

## Sources

- I am – Daily Affirmations, App Store (Apple) — reviews and app description
- I am – Daily Affirmations, Google Play — reviews and app description
- MWM.ai app analysis of I am – Daily Affirmations
- Selfpause editorial review, "I Am Affirmations App Review 2026"
- The Vision Board, "Reviewing the Top 9 Affirmation Apps"
- I am Blog, "The Best Affirmations Apps"
- JustUseApp, "I am Reviews (2026)"

*(Full URLs to be added to `research/competitors/i-am/` per the repo structure — raw review exports and screenshots belong there, not in this document. This file stays synthesis; the folder stays evidence.)*
