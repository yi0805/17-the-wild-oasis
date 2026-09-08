# Task

021 — Phase 2.4f Today activity TypeScript boundary

## Goal

Migrate the active Today check-in/out display and action boundary to TypeScript while preserving valid arriving/departing behaviour and handling real nullable service data safely.

Branch: `task/021-phase-2-4f-today-activity-boundary`

Base main SHA: `697a0e19028ff8f4ce86b908329d499b8f73f9ce`

## Changed

- Renamed `TodayActivity`, `TodayItem`, and `CheckoutButton` to `.tsx`.
- Added `todayActivityTypes.ts`, deriving activity rows from `Awaited<ReturnType<typeof getStaysTodayActivity>>` and narrowing only `unconfirmed` and `checked-in` statuses.
- Null/undefined activities render the existing `No activities today` state; known statuses retain Arriving/Departing tags and their existing actions.
- Unknown status values render `Status unavailable` with no check-in or checkout action.
- Guest relation/name, flag URL, nationality, and nights are guarded with neutral fallbacks. The old nonexistent `country` flag context is corrected to generated `nationality`.
- `CheckoutButton` derives its booking ID from `updateBooking` and preserves the existing checkout mutation and disabled state.
- Added `TodayActivity.test.jsx`: arriving link/flag/nights, departing mutation, empty/null/undefined data, and unknown/missing display data. The suite is 8 files / 43 tests.

## Not Changed

- No services, hooks, generated types, generic UI, CheckinBooking, dashboard components outside Today activity, Supabase configuration, dependency, routing, or deployment changed.

## Verification

- Baseline on `697a0e19028ff8f4ce86b908329d499b8f73f9ce`: `npm ci`, lint, and typecheck passed.
- Final local checks passed: lint, typecheck, `npm test` (8 files / 43 tests), build, and `git diff --check`.
- `npm audit --omit=dev` retains the two known moderate React Router v6 advisories; its available Router v7 fix remains out of scope. The known Vite large-chunk advisory is unchanged.
- Final PR head and CI are recorded in the completion report after the final workflow completes.

## Risks / Notes

- Query filtering remains a runtime service concern; the UI independently guards the broader generated `string | null` status contract.

## Next

Review the remaining settings, authentication, and shared-UI TypeScript boundaries before defining the next Phase 2 task. Do not start Task 022 here.
