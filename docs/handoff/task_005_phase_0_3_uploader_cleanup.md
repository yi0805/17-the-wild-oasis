# Task

005 — Phase 0.3 development/dead-code cleanup

## Goal

Remove the unused destructive tutorial uploader from application source while retaining the non-executable fixture data for possible future safe development/test seeding tooling.

## Changed

- Deleted `src/data/Uploader.jsx`, which contained broad Supabase delete-and-seed operations for bookings, guests, and cabins.
- Marked the Phase 0.3 uploader-cleanup item complete in `ROADMAP.md`.
- Recorded that `data-bookings.js`, `data-cabins.js`, and `data-guests.js` remain intentionally as non-executable development/test fixtures and that no replacement seed mechanism was introduced.

## Not Changed

- Retained `src/data/data-bookings.js`, `src/data/data-cabins.js`, and `src/data/data-guests.js`; the fixture files do not independently execute Supabase mutations.
- Did not add an uploader, development route, environment-gated UI, executable seed script, or `npm run seed` command.
- Did not change Supabase configuration, policies, data, dependencies, ESLint configuration, CI, TypeScript, authentication, cabin mutation logic, or Phase 0.4.

## Verification

- Before deletion, searched the repository (excluding `.git`, `node_modules`, and `dist`) for `Uploader`, `src/data/Uploader.jsx`, `data-bookings`, `data-cabins`, and `data-guests`. The only matches were the uploader itself, its three fixture imports, and the existing roadmap note; no application import, route, or render consumer existed.
- Searched all three retained fixture files for `supabase`, `.from(`, `.insert(`, `.delete(`, and `.update(`. `data-cabins.js` only imports `supabaseUrl` to derive public image URLs; no fixture executes Supabase writes.
- No Supabase operation was run and no Supabase data was mutated during this task.
- `npm run build` passed. It reported the known `react-refresh/only-export-components` warning and Vite's existing large-chunk advisory.
- `npm run lint` failed only because the known `react-refresh/only-export-components` warning in `src/context/DarkModeContext.jsx` is treated as an error by the zero-warning limit.
- `git diff --check` passed.

## Risks / Notes

- A future seed workflow requires separate design after the Supabase environment and security baseline is established. It must be dev/test-only and must not expose destructive reset behaviour in the production UI.
- The known `react-refresh/only-export-components` lint warning is deferred to Phase 0.4.

## Next

Phase 0.4 — Lint and dependency baseline. Do not begin it as part of this task.
