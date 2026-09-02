# Task

002 — native Codex review workflow

## Goal

Document the repository's externally configured native Codex GitHub code-review workflow without changing application behaviour or repository automation.

## Changed

- Updated `AGENTS.md` so task Pull Requests are created only after implementation, verification, handoff, commit, and push are complete.
- Documented that opening a Pull Request triggers native Codex automatic review configured outside the repository, that findings are posted to GitHub, and that human merge authority remains final.
- Documented conservative re-review behaviour: pushes do not imply another automatic review, and a human may manually request one after resolving a blocking finding.
- Documented that no GitHub Actions/API review bot, `OPENAI_API_KEY`, API-billed `openai/codex-action`, or `chatgpt-review` label is required or permitted.

## Not Changed

- No application code, dependencies, GitHub Actions workflows, Supabase configuration, tests, CI, deployment configuration, or ROADMAP phase status changed.
- No custom Codex review workflow or API integration was created or restored.
- Phase 0.3 was not started.

## Verification

- Confirmed the branch was created from the current `main` after `git fetch origin --prune` and `git pull --ff-only`.
- Reviewed `AGENTS.md` and confirmed it no longer instructs a human to manually send every Pull Request to ChatGPT for review.
- Confirmed the workflow preserves GitHub as the source of truth, Codex implementation responsibility, handoff requirements, verification requirements, scope controls, and human-only merge authority.
- Confirmed `ROADMAP.md` did not require a factual correction for this workflow-only update.

## Risks / Notes

- Native Codex automatic review is configured externally through Codex GitHub code-review settings; repository code does not enable it.
- The external configuration currently triggers review on Pull Request open. Further pushes are not assumed to trigger re-review; the human may request another native Codex review when needed.
- The prior experimental GitHub Actions/API review Pull Request was closed without merge and its branch was deleted; it must not be recreated.

## Next

Open the completed Task 002 Pull Request targeting `main` to trigger the first native Codex automatic review, then have the human review any findings and retain the final merge decision.
