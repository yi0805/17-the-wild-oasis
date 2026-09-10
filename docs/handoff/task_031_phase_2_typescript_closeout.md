# Task

031 — Phase 2 TypeScript closeout

Branch: `task/031-phase-2-typescript-closeout`

Base main SHA: `21943e0cadcd28347b9eefb75db0aa8d697206bd`

## Goal

Complete the active production TypeScript migration, remove temporary mixed-JavaScript compiler support when the production graph permits it, and close Phase 2 truthfully.

## Changed

- Renamed active runtime files from JSX to TSX: `src/App.tsx`, `src/main.tsx`, `src/pages/Account.tsx`, `Booking.tsx`, `Bookings.tsx`, `Cabins.tsx`, `Checkin.tsx`, `Login.tsx`, `PageNotFound.tsx`, `Settings.tsx`, and `src/features/cabins/AddCabin.tsx`.
- Updated `index.html` to load `/src/main.tsx`.
- `main.tsx` imports App extensionlessly and validates the `#root` element before `createRoot`; missing markup now produces a clear startup error rather than a non-null assertion. Strict mode, ErrorBoundary, Supabase configuration-error rendering, ErrorFallback, and `window.location.replace("/")` reset behavior are unchanged.
- `App.tsx` retains DarkModeProvider, QueryClient/QueryClientProvider, ReactQueryDevtools, GlobalStyle, BrowserRouter, ProtectedRoute/AppLayout composition, the index redirect, every existing route path, and Toaster configuration.
- Page wrappers and AddCabin retain their existing composition. The inert invalid native `size="large"` attribute was removed from PageNotFound's raw button; navigation behavior and visible content are unchanged. The unused Cabins `useState` import was also removed after TSX linting surfaced it.
- Removed temporary `allowJs: true` and `checkJs: false` from `tsconfig.json` after verifying that the active production graph is TS/TSX only.
- Updated the Phase 2 roadmap checklist: database-derived domain/UI contracts and the final runtime migration are complete. Runtime validation was assessed; no general schema dependency has a concrete need, while file-upload size/type validation and matching server-side policy remain Phase 4 work.

## Not Changed

- Services, typed feature data hooks, generated Supabase database contracts, dependencies, React Router, Supabase Auth/RLS/Storage configuration, mutations, dashboard calculations, responsive/accessibility work, deployment configuration, and fixtures were not changed.
- No hosted Supabase, authenticated browser, GitHub CI, or security-policy verification was performed by this task.

## Verification

- `npm ci` passed.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 28 test files / 108 tests.
- `npm run build` passed. The existing large-chunk advisory remains (974.10 kB minified / 279.47 kB gzip).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories; the only remediation is the intentionally deferred breaking React Router v7 upgrade.
- Final `src` JavaScript/JSX inventory contains no active production dependency:
  - 28 `*.test.js`/`*.test.jsx` files and two `src/test/` test-support modules;
  - three non-executable development/test fixtures: `src/data/data-bookings.js`, `data-cabins.js`, and `data-guests.js`;
  - five historical/tutorial residues: `CabinRow-v1.jsx`, `CabinTable-v1.jsx`, `CabinTable-v2.jsx`, `CreateCabinForm-v1.jsx`, and `Modal-v1.jsx`.

## Risks / Notes

- No active TS/TSX production module imports a remaining JS/JSX file, fixture, or historical/tutorial component.
- No Supabase security, Auth, RLS, Storage, or mutation behavior changed.
- The large production chunk warning and two moderate React Router v6 audit advisories are pre-existing, documented, and unresolved by design; no dependency upgrade was made.
- Scope deviations: none. The two small source cleanups above were required by TSX compiler/linter contracts and do not alter behavior.

## Next

Phase 2 meets its Definition of Done. Continue with Phase 3 recruiter-ready documentation and release work.
