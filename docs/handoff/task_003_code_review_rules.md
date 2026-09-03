# Task

003 — code review rules

## Goal

Add persistent repository-level Pull Request review standards so future ChatGPT and Codex review sessions can rely on `AGENTS.md`.

## Changed

- Added a concise `Code Review Rules` section to `AGENTS.md` beside the native Codex Pull Request workflow.
- Documented the actual GitHub Pull Request diff and repository state as the review source of truth, with the handoff as supporting context that must be verified against the real change.
- Documented material review categories, Supabase/file-mutation safety checks, Blocking/Non-blocking findings, and the required substantive-review result format.

## Not Changed

- No application code, dependencies, tests, CI, GitHub Actions, Supabase configuration, deployment configuration, or ROADMAP status changed.
- No custom Codex review GitHub Action or API-key integration was created or restored.
- Phase 0.3 was not started.

## Verification

- Confirmed the branch was created from the latest `main` after `git fetch origin --prune` and `git pull --ff-only`.
- Reviewed the added rules against the existing delivery and native Codex review workflow; GitHub remains the source of truth and human-only merge authority remains explicit.
- Confirmed the rules distinguish Blocking from Non-blocking findings and require review of the actual GitHub diff and repository state rather than relying only on a handoff.
- Confirmed `ROADMAP.md` did not require a factual correction for this documentation-only task.

## Risks / Notes

- The review rules provide repository guidance only; native Codex automatic review remains configured outside the repository through Codex GitHub code-review settings.
- The rules deliberately prioritise material safety and approved scope over style-only or speculative review comments.

## Next

Open the completed Task 003 Pull Request targeting `main` for native Codex review, then have the human review findings and retain the final merge decision.
