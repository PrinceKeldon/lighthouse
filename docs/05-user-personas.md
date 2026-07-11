# 05 — User Personas

Status: Draft v0.1 — not yet frozen
Depends on: 00-charter.md, 01-experience-manifesto.md, 02-product-strategy.md (positioning), 03-market-research.md

---

## Grounding Note

These personas are deliberately built from the demand I Am has already
validated — not from a hypothetical "evidence app" audience. Per the
positioning decision in `02`: people search for affirmations, self-love,
confidence, and daily motivation. They are not searching for what we
internally call Lighthouse. These personas represent that real, existing
10M-download audience — and each one shows where the *experience* (Layer 2)
quietly exceeds what the category (Layer 1) trained them to expect.

---

## Persona 1 — The Quiet Rebuilder

**Who she is.** Mid-to-late 20s, going through something — a breakup, a
layoff, a move, a hard diagnosis, doesn't matter which. Downloaded an
affirmations app the way someone might buy a candle: a small, low-cost
attempt to feel less alone in a hard stretch.

**What she searched for.** "confidence," "self love," "daily affirmations
for hard times."

**What she expects.** A nice sentence, once or twice a day. Low commitment.
She is not looking for a project. If Lighthouse asks too much of her on a
bad day, she deletes it.

**Where I Am lets her down.** The words are true, but not *hers*. On her
hardest days, a stranger's optimism can feel like it's being performed at
her rather than with her.

**Where Lighthouse earns her trust.** The first-minute prompt has to be
gentle enough to work even on her worst day — this is exactly the founder's
correction to the original onboarding line. "What's one thing you've done,
even once, that you're quietly proud of?" doesn't require her to have had a
good week. It lets old, small, half-forgotten proof count. That single
design choice is the difference between her feeling excluded by the app on
day one and feeling met by it.

**Retention moment.** Week two, a resurfaced memory — "On this day, six
weeks ago, you wrote..." — lands during a moment she wasn't expecting it.
That's not a feature to her. It just feels like the app remembered her.

---

## Persona 2 — The Steady Achiever

**Who he is.** Early-to-mid 30s, doing well by most external measures —
career, relationships look fine from the outside — but privately runs a
harsh internal commentary. Affirmations aren't crisis management for him;
they're maintenance, the same category as a gym habit or a morning routine.

**What he searched for.** "daily motivation," "confidence app," "positive
mindset."

**What he expects.** Something quick, low-friction, fits into an existing
routine (coffee, affirmation, calendar). He's tried two or three apps
already and treats them as somewhat interchangeable.

**Where I Am lets him down.** After a few months, the content repeats. He
knows it's a finite library being reshuffled, and once he notices that, the
words stop landing — they read as content, not truth.

**Where Lighthouse earns his trust.** He never runs out of material,
because the material is his own life, not a shared library. The optional
reflection step — "has there been a moment recently that reminds you this
might already be true?" — fits naturally into a habit he already treats
seriously. He's the persona most likely to engage with reflection often,
not just occasionally.

**Retention moment.** Around week three or four, he notices a Strength with
eight or nine entries under it and realizes he built that without trying —
it wasn't a task he did, it accumulated as a byproduct of a habit he was
already doing anyway.

---

## Persona 3 — The Returning Believer

**Who she is.** Late 30s to 40s. Has used I Am or something like it before,
possibly more than once, possibly deleted and redownloaded it. Believes in
the *idea* of affirmations more than she currently trusts any specific app
to deliver on it — often because of exactly the trust-erosion pattern
identified in `03` and `04` (paywall flips, notification fatigue).

**What she searched for.** "affirmations that actually work," "best
affirmation app 2026," or came via a recommendation, not a cold search.

**What she expects.** To be disappointed, mildly. She is the most skeptical
persona and the hardest one to win, but also the one most likely to become
a Founding Supporter if we do win her — she's not new to the category, she
knows what "different" would actually look like.

**Where I Am lets her down.** This is the persona `03`'s review-mining is
mostly describing — she's the one who describes the paywall reappearing,
notifications outliving deletion, and starts to wonder what the app is
optimizing for.

**Where Lighthouse earns her trust.** Not from any single feature — from
the accumulation of things that *don't* happen: no paywall flip, no
lingering notifications, no manufactured urgency at the subscription
moment. Trust, for her, is proven by absence of the bad pattern more than
presence of a good one.

**Retention moment.** The moment she notices the app hasn't done the thing
she was braced for it to do. Somewhere around the subscription prompt,
which is patron-framed rather than access-gated (ADR-002), she relaxes.
That relaxation is the actual conversion event, more than any feature.

---

## What These Three Have in Common

All three enter for the same reason 10M people entered I Am: they want to
feel a specific way — hopeful, confident, less alone, steadier. None of
them are shopping for "an evidence app." The job of `06-user-journeys.md`
is to map, day by day, how each of them gets that familiar feeling on day
one and a *deeper* version of it by day seven — without ever needing the
word "evidence" to appear on screen.
