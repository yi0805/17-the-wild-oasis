# Task

028 — Dashboard analytics TypeScript boundary

Branch: `task/028-dashboard-typescript`

Base main SHA: `813fabedc14a220c9caa40dbabbfd70c13b42c44`

## Goal

Migrate the active dashboard analytics and display boundary to TypeScript while preserving dashboard behaviour and using existing typed service contracts as the data source of truth.

## Changed

- Files: `ROADMAP.md`; `src/pages/Dashboard.tsx`; `src/features/dashboard/DashboardBox.tsx`, `DashboardFilter.tsx`, `DashboardLayout.tsx`, `DurationChart.tsx`, `SalesChart.tsx`, `Stat.tsx`, and `Stats.tsx`; `src/features/dashboard/DashboardLayout.test.jsx`; `src/features/dashboard/Stats.test.jsx`; and this handoff.
- Renamed `DashboardBox`, `DashboardFilter`, `DashboardLayout`, `DurationChart`, `SalesChart`, `Stat`, `Stats`, and the Dashboard page from JSX to TSX.
- Dashboard chart and statistics props derive from `Awaited<ReturnType<typeof getBookingsAfterDate>>` and `Awaited<ReturnType<typeof getStaysAfterDate>>`; cabin data continues to come through the existing typed `useCabins` hook.
- Typed narrow UI-only chart points, duration buckets, sales colour structures, Stat props, and the styled icon colour variant. No duplicate database/domain model was added.
- Preserved booking count, sales, check-in, and occupancy calculations. Nullable `totalPrice`, `extrasPrice`, and `numGuests` now explicitly use `?? 0`, matching the prior JavaScript numeric-coercion result. Null `numNights` is excluded from duration bucketing.
- Preserved all existing duration bucket ordering and semantics, date range, sales datasets, labels, and dark/light chart colours. Recharts' runtime-supported `"30%"` legend width retains a narrow local type accommodation because its installed public prop type accepts only a number.
- DashboardLayout keeps the normal loading Spinner and passes the same business data to Stats, TodayActivity, DurationChart, and SalesChart. It throws a clear error if required data is absent after loading, rather than masking a failed result as empty analytics.
- Added `Stats.test.jsx` and `DashboardLayout.test.jsx`: three focused behaviours cover metrics/null semantics and the layout loading/ready boundary.
- Added the Task 028 roadmap record.

## Not Changed

- Dashboard data hooks, services, generated database types, DarkModeContext, TodayActivity, shared UI components, App routing, dependencies, Supabase/Auth/RLS/Storage configuration, and migrations were not changed.
- No hosted Supabase or authenticated browser verification was performed.

## Verification

- `npm ci` passed, with existing transitive dependency deprecation warnings.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 18 test files / 96 tests.
- `npm run build` passed. The existing large-chunk warning remains (973.40 kB minified / 279.25 kB gzip).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The only offered fix is the intentionally deferred breaking `react-router-dom` 7.18.3 upgrade.

## Risks / Notes

- The dashboard query hooks do not expose a dedicated query-error UI. The minimal unavailable-data throw makes that pre-existing state explicit without fabricating business data or expanding this task into a general error-state redesign.
- The Recharts legend percentage width is preserved at runtime with a narrow type accommodation; no Recharts version or chart configuration was changed.

## Next

Continue the approved incremental TypeScript migration with the next active UI boundary, keeping derived service contracts and explicit nullable database handling.
