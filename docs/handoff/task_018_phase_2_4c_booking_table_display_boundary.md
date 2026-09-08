# Task

018 — Phase 2.4c Booking table/display TypeScript boundary

## Goal

Migrate the active booking list/table display boundary to TypeScript and make its typed service data and URL contracts explicit.

Branch: `task/018-phase-2-4c-booking-table-display-boundary`

Base main SHA: `87f2adb7f62d92808e1abf8bde42a1738f6f2b53`

## Changed

- Renamed `BookingRow.jsx`, `BookingTable.jsx`, and `BookingTableOperations.jsx` to `.tsx`.
- Added `bookingTableOptions.ts`, deriving the booking-list row from `Awaited<ReturnType<typeof getBookings>>`, shared URL option values, service-compatible filter/sort contracts, status guard, and exact runtime parsers.
- `useBookings.ts` now consumes the shared parsers before constructing its existing service filter and sort options. Malformed status URL input becomes the existing all-bookings filter; malformed, unsupported, or extra-segment sort input becomes the existing `startDate-desc` default.
- BookingRow handles nullable start/end dates, night count, price, status, and joined cabin/guest records with neutral `—` display fallbacks. It formats only valid date strings and finite prices.
- The generated booking status remains `string | null`; only the three UI statuses render Tags and expose their existing status-specific actions. Detail and deletion retain the non-null generated booking ID path.
- Added `BookingTable.test.jsx` with valid URL contract/checkout visibility, malformed sort fallback, malformed status fallback, and nullable booking/join display coverage.

## Not Changed

- No booking service, generated database type, Supabase configuration, dependency, generic UI component, page, check-in/out component, or unrelated hook changed.
- Existing pagination, query keys, prefetching, navigation destinations, mutation calls, toast behaviour, labels, layout, and valid filter/sort options remain intact.

## Verification

- Baseline and final local `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` passed. Tests are 6 files / 28 tests.
- `npm audit --omit=dev` retains the known two moderate production React Router v6 advisories; no breaking Router v7 audit fix was applied.
- Final GitHub Actions run ID/URL and final PR-head SHA are recorded after the pull-request workflow completes. It must pass Checkout, Node setup, dependency installation, lint, typecheck, 6 test files / 28 tests, and build.

## Risks / Notes

- The TypeScript-derived list result exposed nullable scalar fields and nullable joined records. Neutral fallbacks prevent invalid date/price formatting and suppress status-dependent actions when status is missing or unknown; normal valid booking rows retain the existing UI behaviour.
- Generic Table, Menus, Modal, Filter, SortBy, Pagination, and Tag remain JavaScript. Narrow feature-local wrappers satisfy their existing custom props without changing the shared layer.
- The existing Vite large-chunk advisory remains unchanged.

## Next

Review the remaining high-value TypeScript boundaries, including booking detail, settings, authentication, and shared UI, before defining the next Phase 2 task. Do not start it as part of Task 018.
