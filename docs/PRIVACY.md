# Lighthouse Privacy Policy — Draft v0.1

**This is a first draft for legal review, not a final document. Do not
publish or link this from the live app until reviewed by an actual
lawyer.** Data protection and privacy law varies by jurisdiction (GDPR,
CCPA, and others may apply depending on where users are located), and
getting this wrong has real regulatory and trust consequences that a
first draft can't responsibly resolve alone.

---

## What This Policy Has To Get Right

Per ADR-004's honesty constraint: this policy must accurately describe
the current security baseline (Supabase Auth, Row Level Security, TLS in
transit, infrastructure-level encryption at rest) without implying
protections that don't exist yet (field-level encryption, an inability
for Lighthouse itself to access entry content). That distinction is the
single most important thing to get right in this document — more
important than completeness on any other section.

---

## Draft Content

### What We Collect

- **Account information:** email address, authentication credentials
  (handled by Supabase Auth, not stored by us directly as plaintext
  passwords).
- **Content you create:** your affirmation reflections, entries, and the
  Strengths you build over time. This is the most personal data
  Lighthouse holds, and it's treated accordingly throughout this policy.
- **Basic usage data:** which screens are used, general app performance —
  not the content of what you write. (Per `10-technical-architecture.md`:
  no analytics tool we use is permitted to ingest entry content or
  Strength names.)
- **Subscription status:** whether you're on the free tier or Lighthouse
  Plus, handled through Apple/Google's in-app purchase systems — we do
  not directly process or store payment card information.

### How We Protect It

- All data in transit is encrypted (TLS).
- Data at rest is protected by our database provider's infrastructure-
  level encryption, Row Level Security (ensuring only your account can
  query your own data through the app), and access controls limiting who
  at Lighthouse can reach production data directly.
- **[Accurate as of MVP; must be honest, not aspirational]** Entry
  content is not currently protected by field-level encryption — meaning
  that, distinct from other users (who cannot access your data) and the
  outside world (protected by the safeguards above), Lighthouse's own
  systems and authorized personnel could technically access entry content
  if required for support, security, or legal purposes. We are actively
  working toward stronger, field-level protection and will update this
  policy when that ships.

### What We Never Do

- We do not sell your data.
- We do not use advertising, and we do not share your data with
  advertisers.
- We do not use your entry content to train AI models without separate,
  explicit consent (if this ever changes, it will be opt-in, not a policy
  update buried in fine print).
- We do not share your entries with other users, under any circumstance.

### Your Control

- You can delete your account and associated data at any time from
  Settings. [Confirm actual deletion mechanics — hard delete vs.
  soft-delete-then-purge window — before this goes live; needs an
  engineering answer, not a legal-only one.]
- You can request an export of your data. [Not yet built — Phase 4 per
  `12-roadmap.md`. Do not claim this is currently available.]

### Changes to This Policy

We'll notify you in-app of material changes, particularly any change to
how entry content is protected or accessed — not just post a silent
update.

### Contact

[support@keldontech.online]

---

## Open Items Before This Can Ship

1. Real legal review — jurisdiction-specific requirements (GDPR/CCPA/etc.)
   not addressed here.
2. Confirm actual account-deletion mechanics with engineering before
   claiming a specific behavior.
3. Do not include the "export" bullet as available until Phase 4 actually
   ships it.
4. Revisit and update the encryption section the moment Phase 2 (ADR-003's
   deferred architecture) actually ships — this is the one section of this
   document guaranteed to go stale on a known future date, not an
   unknown one.
