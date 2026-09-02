# Task

001 — development workflow setup

## Goal

Establish a persistent GitHub-based development workflow, add handoff structure, and retrospectively document Phase 0.1 and Phase 0.2 without modifying application behaviour.

## Changed

- Extended `AGENTS.md` with branch, verification, handoff, commit, Pull Request, role, and completion-report rules.
- Added `docs/handoff/task_p0_1_runtime_verification.md`.
- Added `docs/handoff/task_p0_2_supabase_settings_fix.md`.
- Added this workflow-setup handoff.

## Not Changed

- No application source, Supabase configuration, dependency, test, CI, deployment, or roadmap implementation change was made for this task.
- Existing uncommitted Phase 0.1/0.2 files were preserved and intentionally not staged by this task.

## Verification

- Inspected repository structure, `AGENTS.md`, `ROADMAP.md`, Git status, remotes, recent history, and existing branch convention.
- Ran `git fetch origin --prune` and `git pull --ff-only`; local `main` was already aligned with `origin/main` at `709c06c`.
- Reviewed the current working-tree diff and confirmed that Git history contains no dedicated Phase 0.1 or Phase 0.2 commit.

## Risks / Notes

- `AGENTS.md` and `ROADMAP.md` are locally excluded by `.git/info/exclude`; this task must force-add the intended `AGENTS.md` file so the persistent project rules are version-controlled.
- The working tree contains unrelated/uncommitted Phase 0.1/0.2 application changes and local generated browser-profile files. They must not be staged in this workflow commit.

## Next

Review the workflow Pull Request. After merge, use `task/<number>-<short-description>` branches and create one accurate handoff file for every meaningful implementation task.
