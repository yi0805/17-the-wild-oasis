# Task

004 — Phase 0.2 authenticated manual verification record

## Goal

Record the completed Phase 0.2 authenticated manual verification and the approved external GitHub branch-ruleset documentation update without changing application behaviour.

## Changed

- Marked the final Phase 0.2 authenticated manual-verification checkbox complete in `ROADMAP.md`.
- Recorded the human-provided PASS results for settings persistence/restoration, blocked existing-cabin image upload, and blocked new-cabin database creation with Storage cleanup.
- Updated the retrospective Phase 0.2 handoff to replace its deferred-verification statement with the completed results.
- Recorded the externally configured Active GitHub `Protect main` ruleset in `AGENTS.md`, including Pull Request delivery, resolved conversations, Squash-only merge, deletion/force-push protection, zero required approvals, and deferred status checks.

## Not Changed

- No application code, dependencies, tests, CI, GitHub Actions, Supabase configuration/policies, deployment configuration, or mutation behaviour changed.
- The human manually configured the GitHub ruleset outside the repository; Codex did not create or modify it.
- The successful-replacement old-image cleanup issue remains unresolved and scheduled for future work.
- Phase 0.3 was not started.

## Verification

- The human performed the verification using an authorised account, non-production data, and browser DevTools Request Conditions.
- Settings persistence/restoration passed; a blocked `cabin-images` edit upload left the existing cabin and baseline image unchanged; and a blocked `cabins` INSERT after a successful image upload removed the new object with no `test 1` cabin created.
- Confirmed Phase 0.2 is fully checked off, Phase 0.3 remains unchecked, and the unresolved prior-image cleanup decision remains documented.
- Confirmed `AGENTS.md` distinguishes GitHub-enforced branch rules from workflow conventions and external native Codex settings.

## Risks / Notes

- This task records human-performed browser evidence; Codex did not execute the authenticated browser verification.
- Automated regression coverage for the verified behaviours remains scheduled for Phase 1.
- The ruleset does not replace the human's obligation to wait for and assess native Codex review before the final merge decision.

## Next

Do not begin Phase 0.3 without approval. Continue with the approved roadmap when authorised.
