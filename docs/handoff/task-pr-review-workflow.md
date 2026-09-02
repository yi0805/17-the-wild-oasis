# Task: automated PR review workflow

## Goal

Add a GitHub Actions workflow that posts a concise, evidence-based Codex review whenever a pull request to `main` is opened or updated.

## Changed

- Added `.github/workflows/codex-pr-review.yml`.
  - Triggers on `opened`, `synchronize`, and `reopened` PR events targeting `main`.
  - Reviews from the trusted base revision, fetches the PR head separately, and collects PR metadata plus current checks.
  - Runs Codex with read-only repository access.
  - Publishes or updates one PR comment; it does not merge or submit a GitHub approval.
- Added `.github/codex/prompts/pr-review.md`.
  - Restricts review to material issues and requires the agreed response format.
  - Treats PR-provided content as untrusted and requires comparison against actual diff, `AGENTS.md`, relevant roadmap scope, CI evidence, and handoff.

## Not Changed

- No application code, dependencies, branch protection, or repository secrets.
- No merge automation.

## Verification

- Reviewed the workflow against the official `openai/codex-action@v1` inputs and the repository's existing `AGENTS.md`/handoff convention.
- Runtime execution requires the repository Actions secret `OPENAI_API_KEY`, which cannot be created from source control.

## Risks / Notes

- The workflow will fail until `OPENAI_API_KEY` is configured as a repository Actions secret.
- The review is advisory and posts a comment only; the human retains merge authority.

## Next

1. Add `OPENAI_API_KEY` in GitHub repository Settings → Secrets and variables → Actions.
2. Open a small PR to confirm the workflow posts and then updates its single review comment.
