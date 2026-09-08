# Task

019 — Phase 2.4d Booking detail/display TypeScript boundary

## Goal

Migrate the active individual-booking detail and display boundary to TypeScript while deriving its contract from the existing typed `getBooking()` service result. Preserve complete booking behaviour and represent schema-valid missing data safely and honestly.

Branch: `task/019-phase-2-4d-booking-detail-display-boundary`

Base main SHA: `686fec5e69d95ec032ef84784a805099cc009200`

## Changed

- Renamed `BookingDetail.jsx` and `BookingDataBox.jsx` to `.tsx`.
- `BookingDataBox` derives its booking prop from `Awaited<ReturnType<typeof getBooking>>`; no handwritten booking database contract was added.
- Dates are formatted only after a runtime validity check. Missing or invalid start/end/created dates render `—` rather than throwing or inventing a date.
- Nullable nights, guests, cabin/guest joins and price fields render neutral values. Currency formatting and the breakfast breakdown require finite numeric values.
- `hasBreakfast` and `isPaid` retain three distinct states: true, false, and unknown. Unknown payment uses a neutral visual state and never claims that payment is outstanding.
- Flag rendering requires a non-empty URL. Its accessible context now uses the generated `guests.nationality` field, with a neutral `Guest flag` fallback.
- The typed migration exposed a correctness defect in the old JSX: it destructured nonexistent `guests.country`. The component now uses the actual generated `nationality` field and does not invent a country value.
- Only `unconfirmed`, `checked-in`, and `checked-out` use the existing tag labels/colors. Null or unknown status displays `Status unavailable` and exposes neither Check in nor Check out.
- Added `BookingDetailDisplay.test.jsx` with complete detail rendering, nullable/invalid display data, and null/unknown-status action coverage.

## Not Changed

- No booking service runtime logic, typed service contract, generated database type, Supabase schema/configuration, Auth, RLS, Storage, migration, dependency, generic UI component, page, or unrelated hook changed.
- Check-in/out components, booking table components, settings, authentication, dashboard, deployment, and router configuration remain out of scope.
- Existing valid status tags, date/duration wording, booking ID actions, delete flow, back navigation, and check-in/check-out behaviour remain unchanged for complete known-status bookings.

## Verification

- Baseline on `686fec5e69d95ec032ef84784a805099cc009200`: `npm ci`, lint, and typecheck passed before implementation.
- Final local checks passed: `npm run lint`, `npm run typecheck`, `npm test` (7 files / 32 tests), `npm run build`, and `git diff --check`.
- `npm audit --omit=dev` retains the known two moderate React Router v6 advisories. The available remediation is the out-of-scope breaking Router v7 upgrade, so no audit fix was applied.
- The existing Vite large-chunk advisory remains unchanged.
- Final GitHub Actions run and final PR head are recorded in the completion report after the final PR workflow completes.

## Risks / Notes

- The detail query's direct service-derived type makes nullable database fields and missing joined records visible at the presentation boundary. Runtime guards are intentionally limited to date/number/status values that can otherwise make rendering unsafe or misleading.
- Generic JavaScript UI components remain unchanged. `BookingDetail` uses narrow feature-local styled wrappers only for their existing custom props and modal-injected close prop.

## Next

Review the remaining high-value TypeScript boundaries, such as settings, authentication, and selected shared UI, before defining the next Phase 2 task. Do not start Task 020 as part of this work.
