# Daemons

This directory holds **daemons** — repo-defined operating roles that give recurring
operational debt an explicit owner instead of handling it ad hoc. Each daemon runs
bounded maintenance work triggered by events or a schedule.

Each daemon is one subdirectory with a `DAEMON.md`, plus any reference files it reads:

```
.agents/daemons/<daemon-id>/DAEMON.md
.agents/daemons/<daemon-id>/references/...
```

These files are role policies only. No workflow in this repo activates a daemon, so a
policy file here does not enable its role. The `references/lanes/` layout below is this
repo's convention, and this file is its only source of truth.

## Repo conventions

- Keep `<daemon-id>` and the frontmatter `id` in sync with each other.
- No CI validates these files. Verify changes by hand, and keep the daemon list below
  current in the same change.
- Keep each daemon to a single, well-bounded role. Split unrelated concerns into
  separate daemons rather than overloading one. Several review dimensions of one
  role are not separate concerns — express them as lanes of that daemon (below)
  rather than as sibling daemons that each activate on the same event.
- A daemon whose role has distinct review dimensions keeps each in its own file
  under `<daemon-id>/references/lanes/`. Every lane requires `## Use this lane when`
  (the use/skip conditions that gate it) and `## What this lane should catch` (each
  finding as **Report when** / **Evidence** / optional **Do not report**); further
  lane-specific sections are fine. Give every lane a skip condition — a lane that
  runs on every activation gates nothing. Keep lane-specific calibration in the
  lane and shared review policy in `DAEMON.md`: a lane that restates daemon policy
  is where the two drift out of agreement.
- Prefer the smallest safe change, and state explicit limits (open-PR caps,
  commits-per-activation, one concern per PR) so activations stay bounded.
- Most of this SDK is generated. This directory is hand-maintained: the generator
  re-applies it on every build, as it does the repo-root `AGENTS.md`. If a build
  ever drops it, restore it here rather than moving daemons elsewhere.

## Current daemons

- `pr-review/` — reviews pull requests under repo-authored policy, across the lanes
  in `pr-review/references/lanes/`.
