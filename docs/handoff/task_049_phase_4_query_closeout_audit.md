# Task

049 — Phase 4 query-state closeout audit

## Goal

Re-audit the merged active production graph after Tasks 038, 046, 047, and 048, and close the Phase 4 query-state roadmap item only if every active TanStack Query boundary has an explicit, truthful user-facing state contract.

Base `main` SHA: `54a247470843c4f35df15d08c9c6814bd17cacd4`.

## Merged-state audit

The active production graph contains eight TanStack Query hooks:

- `useBookings` → `BookingTable`: loading → query error → successful zero-row empty state → data. Covered by Task 038.
- `useCabins` → `CabinTable` and Dashboard: list loading/error/empty/data covered by Task 038; Dashboard aggregate loading/error/data covered by Task 047.
- `useBooking` → `BookingDetail` and `CheckinBooking`: loading → query error → legitimate missing booking → success. Covered by Task 046.
- `useSettings` → `UpdateSettingsForm` and `CheckinBooking`: loading → query error → success; failed settings queries no longer become blank editable values. Covered by Task 046.
- `useRecentBookings` → `DashboardLayout`: aggregate loading/error/success covered by Task 047.
- `useRecentStays` → `DashboardLayout`: aggregate loading/error/success covered by Task 047.
- `useTodayActivity` → `TodayActivity`: loading → query error → legitimate no-activity empty state → activity list. Covered by Task 047.
- `useUser` → `ProtectedRoute`: initial loading, confirmed authenticated, auth-query failure, confirmed signed-out redirect, and cached authenticated background-refetch failure are distinguished. Covered by Task 048.

Repository search also finds the historical tutorial `CabinTable-v1.jsx` direct query, but Task 031 established that `-v1`/`-v2` files are not imported by the active TypeScript production graph. `App.tsx` routes only through the active page/component graph, so historical residue is not a blocker for the production query-state objective.

## Closeout decision

The Phase 4 query-state item is supported as complete on merged `main`.

This is deliberately narrower than claiming every asynchronous interaction in the application has identical UX. Mutations continue to use their existing pending/toast/error contracts, and feature-level responsive polishing remains a separate Phase 4 item.

## Documentation changes

- Mark the Phase 4 important-query-state roadmap item complete and record Tasks 038/046/047/048 plus this merged-state audit as its evidence.
- Update the current resume-outcome wording so it no longer says broad async-state hardening remains unfinished.
- Add dated Task 046–049 roadmap records so the current Phase 4 history matches merged repository work.

## Not changed

- No runtime code, query keys, retries, services, Supabase configuration, RLS/Storage policies, router structure, dependencies, or UI styling changed.
- The responsive/accessibility roadmap item remains open. Task 049 does not claim Phase 4 as a whole is complete.
- Historical tutorial files are not deleted merely to make a search count cleaner.
- No `supabase db push`, dependency upgrade, React Router upgrade, or audit auto-fix is part of this task.

## Verification

Because this task is documentation-only, exact-head PR CI remains the authoritative regression gate and must still pass the repository-standard `npm ci`, lint, typecheck, tests, and build. Vercel Preview should also remain green before merge review.

## Next

After merge, perform an evidence-based feature-level responsive audit. Only implement a further responsive task if concrete narrow-screen defects are found; otherwise record the responsive decision rather than redesigning for roadmap completion.