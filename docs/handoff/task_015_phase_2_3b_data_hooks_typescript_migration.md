# Task

015 — Phase 2.3b TanStack Query/data-hook TypeScript migration

## Goal

Migrate the feature data/query/mutation hooks to strict TypeScript while preserving their TanStack Query behaviour and consuming Task 014 typed service contracts.

Branch: `task/015-phase-2-3b-data-hooks-typescript-migration`

Base main SHA: `da0166312fed648406c895bdc626ef5f193a44d3`

## Changed

- Renamed 18 feature hooks from `.js` to `.ts`: authentication (`useLogin`, `useLogout`, `useUpdateUser`, `useUser`); bookings (`useBooking`, `useBookings`, `useDeleteBooking`); cabins (`useCabins`, `useCreateCabin`, `useDeleteCabin`, `useEditCabin`); check-in/out (`useChecking`, `useCheckout`, `useTodayActivity`); dashboard (`useRecentBookings`, `useRecentStays`); and settings (`useSettings`, `useUpdateSetting`).
- Mutation variables derive from service signatures with `Parameters<>`; mutation results use `Awaited<ReturnType<>>` only where they clarify the mutation contract. This covers login/current-user updates, booking/cabin deletion, cabin create/edit, settings updates, check-in breakfast fields, and checkout IDs.
- `useBookings` parses URL sort input with runtime narrowing to `startDate | totalPrice` and `asc | desc`, falling back to the existing `startDate-desc` default. It retains status filtering and uses `(count ?? 0)` only for internal page-count calculation.
- `useBooking` preserves the raw route value in its query key and converts it with `Number()` for the typed numeric service ID.
- Query keys, prefetching, cache invalidations, navigation, toast copy, loading-state names, date-search behaviour, and service query/mutation functions are retained.
- The installed TanStack Query v4 runtime ignores the legacy unsupported `{ active: true }` filter, resulting in all-query invalidation. The two hooks now call `invalidateQueries()` directly, which preserves that actual runtime behaviour and satisfies strict types.

## Not Changed

- No React component, page, generic hook, context, test, service, generated database contract, schema, migration, environment file, dependency, credential, or Supabase configuration changed.
- Existing tests remained JS/JSX and needed no edits.

## Verification

- `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` passed. Tests remain 4 files / 19 tests.
- `npm audit --omit=dev` reports the existing two moderate React Router v6 advisories; no breaking Router v7 upgrade or audit fix was applied.
- The implementation CI run [34026367859](https://github.com/yi0805/17-the-wild-oasis/actions/runs/34026367859) passed on `a1886c3368ba6cfd99d4f84057f363bbe160703f`; its `quality` job completed Checkout, Node setup, dependency installation, lint, typecheck, 4 test files / 19 tests, and build successfully. The documentation-only follow-up is verified on the replacement final PR head in the completion report.

## Risks / Notes

- React components/pages and the three generic hooks deliberately remain JavaScript migration residue. The broader Phase 2 application migration checklist remains incomplete.
- The existing Vite large-chunk advisory remains unchanged.

## Next

Inspect the remaining JavaScript feature/UI boundaries before defining Task 016 — Phase 2.4 high-value React feature boundary migration. Do not begin it as part of Task 015.
