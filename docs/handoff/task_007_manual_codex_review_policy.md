# Task

007 — manual Native Codex review policy

## Goal

Align the repository's documented Pull Request review workflow with the human's decision to disable automatic Native Codex review while preserving substantive actual-diff review and human-only merge authority.

## Changed

- Updated `AGENTS.md` so ChatGPT/human-directed substantive review of the actual GitHub diff is the default Pull Request review.
- Reframed Native Codex review as an optional, manually requested advisory safety net for materially high-risk or uncertain changes.
- Recorded examples where an independent second review may be useful, while explicitly avoiding a mechanical requirement for routine Pull Requests.
- Preserved Pull Request delivery, resolved GitHub review conversations, actual-diff review, and human final merge authority.

## Not Changed

- Automatic Native Codex review was previously part of the workflow; its external Codex account settings were intentionally disabled by the human because of review token/credit cost. Repository code did not and does not change those external settings.
- Native Codex review remains available for manual use when useful; its absence is no longer a merge blocker.
- Historical Task 002 and Task 003 handoffs remain unchanged as accurate records of the earlier policy.
- `ROADMAP.md` required no update because it did not contain a current automatic-Native-Codex requirement.
- No application code, dependencies, package files, CI, GitHub Actions, Supabase configuration, Phase 0.5 work, or Pull Request #7 were modified.

## Verification

- Reviewed the current `AGENTS.md`, `ROADMAP.md`, and historical Task 002/003 handoffs after updating from the latest `main`.
- Searched current-policy documentation for stale automatic-review claims; remaining automatic-review statements are confined to preserved historical handoffs.
- Confirmed the updated workflow requires Pull Request delivery, substantive actual-diff review, resolved GitHub review conversations, optional manual Native Codex escalation, and human final merge authority.
- `git diff --check` passed.

## Risks / Notes

- Manual Native Codex review is an advisory second layer, not a substitute for substantive review against the actual GitHub diff and current repository state.
- Material findings from a manually requested review still require assessment before a human merge decision.

## Next

Use ChatGPT/human-directed actual-diff review as the default for Pull Requests; request Native Codex review manually only when its additional independent review is justified.
