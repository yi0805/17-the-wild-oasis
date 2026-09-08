# Task

020 — Phase 2.4e Check-in workflow TypeScript boundary

## Goal

Migrate the active `CheckinBooking` workflow to TypeScript while preserving its valid check-in payloads and making nullable booking/settings preconditions explicit.

Branch: `task/020-phase-2-4e-checkin-workflow-boundary`

Base main SHA: `b5514d2219c95109fa16d0b24ffa1731a52ee441`

## Changed

- Renamed `CheckinBooking.jsx` to `CheckinBooking.tsx`.
- Derived booking, settings, and update contracts from `getBooking`, `getSettings`, and `updateBooking`; no handwritten database model was added.
- Added an existing `Empty` state after loading when no booking is available, before any booking destructuring occurs.
- Breakfast calculations now require finite settings breakfast price, nights, guests, and original total price. The derived view model carries only validated numeric values for display and mutation.
- The breakfast option appears only when `hasBreakfast === false` and a valid calculation exists. `true` and `null` do not expose it.
- The check-in handler independently returns without mutating if the selected-breakfast branch lacks a valid calculation, preventing null, coerced-zero, or `NaN` payload values.
- Missing total price uses `—`; missing guest relation/name uses `the guest`. No check-in confirmation displays fabricated currency, `undefined`, or `null`.
- Payment confirmation still initializes from `booking.isPaid ?? false`, and selecting breakfast still resets confirmation.
- Valid normal mutations remain `{ status: "checked-in", isPaid: true }` without breakfast and the existing `hasBreakfast`, `extrasPrice`, and recalculated `totalPrice` payload with breakfast.
- Updated the test fixture to use generated `guests.nationality` instead of nonexistent `guests.country`, and added four targeted nullable-workflow tests.

## Not Changed

- No service runtime logic, `useChecking` mutation behaviour, generated database type, dependency, generic UI component, page, Supabase configuration/schema, Auth, RLS, Storage, migration, deployment, or router configuration changed.
- Today activity, checkout, booking detail/table, settings forms, authentication, dashboard, and unrelated feature boundaries remain out of scope.

## Verification

- Baseline on `b5514d2219c95109fa16d0b24ffa1731a52ee441`: `npm ci`, lint, and typecheck passed before implementation.
- Final local checks passed: `npm run lint`, `npm run typecheck`, `npm test` (7 files / 36 tests), `npm run build`, and `git diff --check`.
- `npm audit --omit=dev` retains the known two moderate React Router v6 advisories. The available fix is the out-of-scope breaking Router v7 upgrade, so no audit change was made.
- The known Vite large-chunk advisory remains unchanged.
- Final PR head and GitHub Actions run are recorded in the completion report after the workflow completes.

## Risks / Notes

- This boundary deliberately does not add direct-URL status authorization; the existing product route remains unchanged. Status hardening is a later product concern.
- Generic JavaScript UI remains unchanged. Small feature-local styled wrappers provide only the existing custom `Row` and `Button` props required by TSX.

## Next

Review the remaining high-value TypeScript boundaries, such as settings, authentication, selected shared UI, or the remaining check-in/out display components, before defining the next Phase 2 task. Do not start Task 021 as part of this work.
