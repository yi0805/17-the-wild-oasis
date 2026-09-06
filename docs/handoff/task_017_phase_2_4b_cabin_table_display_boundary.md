# Task

017 — Phase 2.4b Cabin table/display TypeScript boundary

## Goal

Migrate the active cabin table/display boundary to TypeScript while honestly handling nullable generated cabin rows, runtime URL inputs, and client-side query data.

Branch: `task/017-phase-2-4b-cabin-table-display-boundary`

Base main SHA: `b53c392fe598e239f77448cb6d194e0bd5b42798`

## Changed

- Renamed `CabinRow.jsx`, `CabinTable.jsx`, and `CabinTableOperations.jsx` to `.tsx`.
- Added `cabinTableOptions.ts`, which exports the shared filter/sort option values, narrow contracts, and runtime parsers. It derives `Cabin` from `Tables<"cabins">`.
- CabinRow explicitly displays `—` for nullable name, capacity, price, and neutral discount values. A non-empty image URL renders the existing image; otherwise the local `No image` placeholder replaces the image element.
- Duplication is guarded by a real `isDuplicableCabin` predicate. It requires a string name, non-empty string image, numeric capacity, price, and discount, plus a string description. Incomplete rows omit Duplicate while Edit and Delete remain available.
- Filter URL values narrow to `all | with-discount | no-discount`, with malformed values falling back to `all`. Sort URL values narrow to name, regular-price, and capacity fields with ascending/descending direction, falling back to `name-asc`.
- Sorting uses an explicit nullable comparator: non-null values sort normally, equal values return zero, and null values remain last for both directions. It sorts `[...filteredCabins]`, never the query array or an alias of it.
- Added `CabinTable.test.jsx` with nullable display/duplicate suppression, malformed sort fallback, and null-last source-array-preserving sort coverage.

## Not Changed

- No service, query/mutation hook, generated database type, Supabase configuration, dependency, generic UI component, page, or tutorial `-v1/-v2` cabin file changed.
- Existing cabin image Storage, cleanup, and mutation semantics remain in `apiCabins.ts`.

## Verification

- Baseline and final local `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` passed. Tests are 5 files / 23 tests.
- `npm audit --omit=dev` retains the known two moderate production React Router v6 advisories; no breaking Router v7 audit fix was applied.
- Final GitHub Actions run ID/URL and final PR-head SHA are recorded after the pull-request workflow completes. It must pass Checkout, Node setup, dependency installation, lint, typecheck, 5 test files / 23 tests, and build.

## Risks / Notes

- Null-last ordering and copy-before-sort are intentional correctness improvements for schema-valid nullable rows and TanStack Query cache safety. Non-null sorting and normal filter behaviour remain unchanged.
- Generic Table, Menus, Modal, Filter, and SortBy remain JavaScript. Narrow feature-local wrappers satisfy their existing custom prop contracts without changing the shared layer.
- The existing Vite large-chunk advisory remains unchanged.

## Next

Review the remaining feature/UI boundaries, including bookings, settings, authentication, and shared UI, before defining the next Phase 2 task. Do not start it as part of Task 017.
