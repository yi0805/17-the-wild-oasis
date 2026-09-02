# Task

001 — development workflow setup

## Goal

Establish a persistent GitHub-based development workflow, add handoff structure, and retrospectively document Phase 0.1 and Phase 0.2 without modifying application behaviour.

## Changed

- Extended `AGENTS.md` with branch, verification, handoff, commit, Pull Request, role, and completion-report rules.
- Added `ROADMAP.md` as version-controlled persistent project planning knowledge.
- Added `docs/handoff/task_p0_1_runtime_verification.md`.
- Added `docs/handoff/task_p0_2_supabase_settings_fix.md`.
- Added this workflow-setup handoff.
- Captured previously completed Phase 0.1 files: `.gitignore`, `.env.example`, `src/services/supabase.js`, `src/main.jsx`, and `src/features/authentication/LoginForm.jsx`.
- Captured previously completed Phase 0.2 files: `src/services/apiSettings.js` and `src/services/apiCabins.js`.
- Removed local `.git/info/exclude` entries for `AGENTS.md` and `ROADMAP.md`; the local metadata file itself is not committed.

## Not Changed

- No new Phase 0.1/0.2 behaviour was implemented, and no Phase 0.3 work was started.
- No Supabase policy, dependency, test, CI, deployment, or unrelated application change was made.

## Verification

- Inspected repository structure, `AGENTS.md`, `ROADMAP.md`, Git status, remotes, recent history, and existing branch convention.
- Ran `git fetch origin --prune` and `git pull --ff-only`; local `main` was already aligned with `origin/main` at `709c06c`.
- Reviewed the current working-tree diff and confirmed that Git history contains no dedicated Phase 0.1 or Phase 0.2 commit.
- Inspected each captured Phase 0.1/0.2 file against `main`; `.env.example` contains placeholders only and local `.env.local`/browser runtime files were excluded from staging.
- Ran `npm run build` successfully.
- Ran `npm run lint`; it failed only on the existing `react-refresh/only-export-components` warning in `src/context/DarkModeContext.jsx` because the script enforces `--max-warnings 0`.

## Risks / Notes

- The original Phase 0.1/0.2 implementation history has no standalone commits; the baseline Pull Request captures it retrospectively and the two phase handoffs preserve that fact.
- Local `.env.local` and `.chrome-runtime-check/` remain local-only and are ignored; they must not be committed.

## Next

Review baseline Pull Request #1. After merge, use `task/<number>-<short-description>` branches and create one accurate handoff file for every meaningful implementation task.
