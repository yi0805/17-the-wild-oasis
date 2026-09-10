# Task

029 — Shared interactive UI TypeScript boundary

Branch: `task/029-shared-interactive-ui-typescript`

Base main SHA: `cf7517c4df0a6f823d0b62ae45e416fe11605bc2`

## Goal

Migrate the active shared interaction primitives to strict TypeScript while preserving their existing public APIs and observable behaviour.

## Changed

- Files: `ROADMAP.md`; `src/hooks/useOutsideClick.ts`; `src/ui/Checkbox.tsx`, `ConfirmDelete.tsx`, `Filter.tsx`, `Menus.tsx`, `Modal.tsx`, `Pagination.tsx`, `Select.tsx`, `SortBy.tsx`, `Table.tsx`, and `TableOperations.tsx`; `src/ui/Modal.test.jsx`, `Menus.test.jsx`, `Filter.test.jsx`, `Pagination.test.jsx`, `Table.test.jsx`, `SortBy.test.jsx`, and `ConfirmDelete.test.jsx`; and this handoff.
- Renamed the eleven approved shared interaction files from JavaScript/JSX to TypeScript/TSX. No consumers were changed.
- Preserved the Modal, Menus, and Table compound APIs. Their contexts are typed as `undefined` outside providers and guarded by internal hooks, so misuse does not receive fabricated default callbacks/state.
- Modal cloneElement children use narrow ReactElement prop contracts for its existing `onClick` and injected `onCloseModal` relationships. No assertion was needed.
- `useOutsideClick` now returns a generic `RefObject<T | null>` for HTMLElement targets and narrows `EventTarget` with `instanceof Node`; Modal and Menus use concrete DOM element refs. Menu IDs remain `string | number`, and Toggle uses `event.currentTarget` for the existing position calculation.
- Table Body remains generic over readonly data and its render callback. `columns`, menu position, active filter state, and Select's visual type are transient styled props where internal props could otherwise reach DOM nodes.
- Filter, SortBy, and Pagination retain URL state behaviour while explicitly writing string URLSearchParams values. Pagination accurately accepts the existing hook's `number | null | undefined` count and treats an absent count as zero, matching the hook's existing page-count treatment.
- Checkbox, ConfirmDelete, and Select use native DOM event/attribute types; ConfirmDelete retains Modal-injected optional `onCloseModal`.
- Added nine focused behaviours across seven shared-UI test files: Modal, Menus, Filter, Pagination, Table, SortBy, and ConfirmDelete. Existing CheckinBooking coverage continues to exercise Checkbox behaviour.
- Added the Task 029 roadmap record. Phase 2 is explicitly not marked complete.

## Not Changed

- Consumers, services, feature data hooks, generated database types, routing, pages, DarkMode, Button/Heading and other presentational UI, dependencies, Supabase/Auth/RLS/Storage configuration, and migrations were not changed.
- Legacy/versioned files, including `Modal-v1.jsx`, were not changed.
- No hosted Supabase or authenticated browser verification was performed.

## Verification

- `npm ci` passed, with existing transitive dependency deprecation warnings.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 25 test files / 105 tests.
- `npm run build` passed. The existing large-chunk warning remains (973.90 kB minified / 279.40 kB gzip).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The only offered remediation is the intentionally deferred breaking `react-router-dom` 7.18.3 upgrade.

## Risks / Notes

- No cloneElement casts were required. The narrow child contracts match existing Modal consumers that accept Modal's injected callbacks.
- No public API was redesigned. The pagination absent-count fallback is the explicit equivalent of the existing `useBookings` page-count calculation and avoids a TypeScript-only undefined arithmetic path.
- Phase 2 is NOT complete. Remaining application-shell and presentational JavaScript requires a later reassessment after this PR is merged.

## Next

After merge, reassess the remaining active application-shell and presentational JavaScript boundaries before defining the final Phase 2 completion task.
