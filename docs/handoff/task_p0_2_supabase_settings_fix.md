# Task

Phase 0.2 — Supabase settings fix and mutation-safety changes (retrospective handoff)

## Goal

Correct the Supabase settings update response contract and address the identified cabin image mutation failure path without changing Supabase policies or adding a test framework.

## Changed

- `src/services/apiSettings.js` now calls `.select().single()` after updating the single settings row. Supabase updates return a minimal response unless a representation is requested; `.select()` makes the updated row available for `.single()` and for the caller.
- `src/services/apiCabins.js` uploads a replacement image before writing the cabin row. If upload fails, an existing cabin row is untouched. If the later database write fails, the newly uploaded object is removed as best-effort cleanup.

The original Phase 0.2 implementation had no dedicated commit. Its verified working-tree changes against commit `709c06c` were later captured in version control through baseline Pull Request #1; this handoff records that retrospective history.

## Not Changed

- No Supabase Auth, RLS, Storage policy, schema migration, dependency, test framework, CI, or UI-styling change was made.
- No authenticated mutation was executed against shared Supabase data.
- Prior cabin-image cleanup after a successful replacement edit was not implemented; it remains a documented follow-up because the service does not receive a safely identifiable previous object.

## Verification

- `ROADMAP.md` records that `npm run build` passed after the changes.
- `npm run lint` remained blocked by the existing `DarkModeContext.jsx` Fast Refresh warning; this was deferred to Phase 0.4.
- No automated tests existed or were added.
- Human-performed authenticated manual verification passed with an authorised account and non-production data. The Breakfast price persisted after refresh and was restored successfully. Blocking a `cabin-images` upload during an existing-cabin edit displayed `Cabin image could not be uploaded`; after refresh, the cabin and its baseline image remained and the attempted changes were absent. Allowing a new-image upload (HTTP 200) while blocking the subsequent `cabins` INSERT displayed `Cabin could not be saved`; the `cabin-images` cleanup request returned HTTP 200, and the attempted `test 1` cabin was absent after refresh.

## Risks / Notes

- The human, not Codex, performed the authenticated browser verification using DevTools Request Conditions against non-production test data.
- If deleting an old owned cabin image after a successful replacement later fails, the successful cabin row/new image must remain; the orphan should be recorded for retry rather than compensated by deleting the cabin.
- This handoff relies on the roadmap and the implementation later captured by baseline Pull Request #1 because Git history contains no standalone Phase 0.2 commit.

## Next

Phase 0.2 authenticated manual verification is complete. Follow the approved roadmap; Phase 0.3 is development/dead-code cleanup and must not begin without approval.
