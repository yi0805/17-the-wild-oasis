# Task

047 — Harden dashboard and today-activity query states

## Goal

Prevent Dashboard data failures and Today Activity failures from being presented as missing data or generic render failures, while preserving the existing analytics, mutation, routing, and Supabase boundaries.

Base `main` SHA: `6adba5138dbc11a9559e38ae2137ea312cb8fed3`.

## Changed

- `useRecentBookings` now exposes the TanStack Query `error` value alongside its existing loading/data contract.
- `useRecentStays` now exposes the TanStack Query `error` value while preserving its existing confirmed-stay filtering and date-window behaviour.
- `DashboardLayout` now applies explicit loading → query error → successful data precedence across recent bookings, recent stays, and cabins. It reuses the shared `QueryError` instead of allowing rejected dashboard queries to fall through to the generic missing-data exception.
- `useTodayActivity` now exposes its query error.
- `TodayActivity` now renders an explicit query failure before the existing legitimate `No activities today` state, and its spinner has an accessible status label.
- Added focused behavioural regressions for dashboard loading/error precedence and for Today Activity query failure versus legitimate empty data.

## State Priority

For the changed workflows, query-state precedence is now explicit:

1. loading;
2. query error;
3. legitimate empty data where the workflow supports it;
4. successful content.

`DashboardLayout` still keeps its existing defensive invariant for an unexpected non-loading, non-error, missing-data state. Successful empty arrays remain valid dashboard data.

## Not Changed

- No service functions, Supabase queries, query keys, retry policy, mutations, date-range calculation, charts, navigation, authentication, responsive layout, dependencies, or backend policies changed.
- The authenticated-user query boundary remains separate work: a rejected current-user query is still outside this task.
- This task does not claim all application query states are globally standardised, so the Phase 4 query-state roadmap item remains incomplete.
- No `supabase db push`, dependency upgrade, React Router upgrade, or audit auto-fix is part of this task.

## Verification

The exact-head pull-request CI is the authoritative execution environment. It must pass:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Also confirm the Vercel Preview succeeds and review the final PR diff for scope consistency before merge review.

## Next

Review the Task 047 pull request and exact-head checks. Do not merge automatically.
