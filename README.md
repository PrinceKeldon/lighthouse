# Lighthouse

The most trusted daily wellbeing companion.

Lighthouse exists to remind people that their worth isn't something they
earn — it's something they already have.

We believe technology should reduce anxiety, not create it. Every design
decision, every feature, and every interaction should help someone
remember that they matter.

This repository contains the product, research, design, and engineering
work behind Lighthouse.

## Start Here

If you're new to this repository, read `docs/00-charter.md` first — it's
the foundation everything else is built on. From there, the numbered docs
in `docs/` tell the story in order: why Lighthouse exists, how it should
feel, how it competes, and how it's built.

## Structure

```
docs/           — the why, the how, the decisions (read 00 first)
docs/decisions/ — ADRs: specific, individually-decided trade-offs
research/       — competitive research and the core loop analysis
app/            — the React Native (Expo) application
```

## Status

Milestone 0 — "Remember" — is complete and tagged (`milestone-0-v1.0`,
`v0.1.0-milestone-0`). The core loop — daily affirmation, optional
reflection, Strengths that accumulate from real entries, and the Remember
mechanic — is live against a real backend, not mocked.

See `docs/12-roadmap.md` for what comes next and why each phase is gated
on the one before it.

## Working on This Repo

Read `CONTRIBUTING.md` before opening a pull request. The short version:
every feature begins with a human need, not a technical capability, and
every significant decision gets written down.

## License

See `LICENSE`.