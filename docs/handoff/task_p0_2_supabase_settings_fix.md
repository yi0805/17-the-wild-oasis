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
- Authenticated destructive manual verification was intentionally deferred until non-production test data and an authorised account are available. The roadmap contains the exact manual scenarios.

## Risks / Notes

- The settings response behaviour and cabin rollback paths were not exercised against a live authorised Supabase session during this phase.
- If deleting an old owned cabin image after a successful replacement later fails, the successful cabin row/new image must remain; the orphan should be recorded for retry rather than compensated by deleting the cabin.
- This handoff relies on the roadmap and the implementation later captured by baseline Pull Request #1 because Git history contains no standalone Phase 0.2 commit.

## Next

Complete the pending authorised, non-production manual verification when safe, then follow the approved roadmap. Phase 0.3 is development/dead-code cleanup and must not begin without approval.
