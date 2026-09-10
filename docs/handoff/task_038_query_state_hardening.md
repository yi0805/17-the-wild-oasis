# Task

038 — Harden booking and cabin query states

## Branch

`task/038-query-state-hardening`

## Base main SHA

`1965a98e7887b3139576d6e1d9fc503038230169`

## Goal

Make booking and cabin list query loading, failure, empty, and data states distinct without changing their workflows.

## Changed

- `CabinTable` now prioritises loading, then query failure, then a successful zero-row result, before rendering cabin data.
- `BookingTable` now renders a generic query failure state between its existing loading and empty states.
- Added the small reusable, presentation-only `QueryError` UI. It gives users a clear recovery-oriented message without rendering raw query or Supabase error details.
- Added four behavioural state tests for each core list workflow. The cabin loading test uses undefined query data and a simultaneous error value to protect the intended state priority.
- The README test count now reflects 28 test files / 117 tests. The Phase 4 roadmap remains incomplete because this task covers only the two list workflows.

## Not Changed

- Booking filtering, sorting, pagination, menu actions, and deletion behavior.
- Cabin filtering, sorting, and mutations.
- Query configuration, services, Supabase, Auth, RLS, Storage, routes, dependencies, or general visual design.
- Other Phase 4 query states, accessibility/responsive work, upload validation, cabin-image cleanup, and bundle optimisation.

## Verification

- `npm ci`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 28 test files / 117 tests.
- `npm run build`: passed; the existing large initial-chunk warning remains (982.38 kB minified / 281.44 kB gzip).
- `git diff --check`: passed.
- `npm audit --omit=dev`: reports two moderate React Router v6 advisories. The available remediation is the intentionally deferred breaking `react-router-dom@7.18.3` upgrade; no audit fix was run.

## Risks / Notes

- The shared query-error state is generic by design. Detailed query diagnostics remain outside user-visible UI.
- This task does not establish a global query-state architecture or claim that all routes have hardened states.

## Next

Continue Phase 4 only through separately scoped work for other query workflows, accessibility/responsive improvements, uploads, cabin-image lifecycle safety, or measured performance improvements.
