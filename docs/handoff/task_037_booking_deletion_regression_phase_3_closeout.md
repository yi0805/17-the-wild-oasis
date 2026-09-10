# Task

037 — Booking deletion regression coverage and Phase 3 closeout

## Branch

`task/037-booking-deletion-regression`

## Base main SHA

`01c72654ffbdbae866a9dc66e7089322844426ec`

## Goal

Add the missing focused booking-deletion regression and close Phase 3 only after the full verification evidence passes.

## Previous evidence gap

Task 036's substantive review found that implementation wiring and generic `ConfirmDelete` coverage did not prove the booking-specific flow from UI confirmation to the booking deletion boundary.

## Test boundary chosen

Extended `src/features/bookings/BookingTable.test.jsx`, which already renders the real booking table, row, menu, modal, confirmation, and `useDeleteBooking` composition while mocking only the booking service boundary.

## Regression added

The new behavioural test renders fictional booking ID `42`, opens its action menu, selects `Delete booking`, observes the booking-specific confirmation heading, confirms deletion, and waits for the mocked booking service to receive exactly `deleteBooking(42)`.

## Exact behaviour verified

The test connects the visible booking-row delete flow to the deletion mutation boundary: `Delete booking` → `Delete booking` confirmation → `Delete` → booking service called once with ID `42`.

## Changed

- `src/features/bookings/BookingTable.test.jsx`
- `ROADMAP.md`
- `README.md`
- This handoff

## Not Changed

- No production application source, booking implementation, hooks, services, shared UI components, routes, dependencies, CI workflow, Supabase configuration, hosted data, or deployment configuration changed.
- Task 036 handoff remains unchanged historical evidence of the prior gap.
- No hosted Supabase data or production data was read or mutated.

## Verification

- Focused booking-table test: passed, 5 tests including the new booking-deletion regression.
- `npm ci`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 28 test files / 109 tests.
- `npm run build`: passed; the existing large initial-chunk warning remains.
- `git diff --check`: passed.
- `npm audit --omit=dev`: the two documented moderate React Router v6 advisories remain; the offered remediation is the intentionally deferred breaking `react-router-dom@7.18.3` upgrade.

## Phase 3 closeout evidence

Task 036's merged secret, deployment-config, documentation, README, Vercel-route, and Supabase-authorization evidence is unchanged. This task supplies the only missing focused workflow evidence, so the composite Final Verification item and final Phase 3 review are checked after the complete local suite passes.

## Remaining known limitations

- Phase 4 async-state, accessibility, responsive, upload-validation, owned cabin-image cleanup, and bundle-optimization work remains deferred.
- The breaking React Router v7 upgrade and Supabase CLI migration-history reconciliation remain deferred.

## Next

Phase 3 is complete. Start Phase 4 only through a separately scoped task; do not infer authorization from this regression task to alter hosted services or production behavior.
