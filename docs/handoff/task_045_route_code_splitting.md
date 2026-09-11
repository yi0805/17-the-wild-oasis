# Task

045 — Measure and reduce the initial JavaScript bundle with route-level code splitting

## Goal

Measure the clean production bundle, then use only justified React route-level splitting to reduce the initial JavaScript payload while preserving every route and authentication boundary.

Base `main` SHA: `2ef2fbe6f58082282f7eba120ffb06fe6cffa835`.

## Changed

- Measurement environment: Windows PowerShell, Node `v24.14.0`, npm `11.9.0`, Vite `4.5.14`; `npm ci` preceded the baseline `npm run build`.
- The baseline Vite build emitted one JavaScript chunk: `index-a81d593d.js`, `991.79 kB` minified and `284.19 kB` gzip. It emitted Vite's standard >500 kB warning.
- `src/App.tsx` showed that all nine page modules were statically imported. Dashboard reaches `DashboardLayout`, `SalesChart`, and `DurationChart`, whose charts import Recharts. That eager graph justified route-level page boundaries.
- Converted Dashboard, Bookings, Booking, Checkin, Cabins, Settings, Account, Login, and PageNotFound to `React.lazy` dynamic imports. Their existing route paths, protected/public arrangement, data handling, and Dashboard chart code remain unchanged.
- Wrapped the route tree in one `Suspense` boundary. Its accessible fallback uses the existing Spinner inside `role="status"` with the label `Loading page`; it is separate from ProtectedRoute's `Loading user` authentication state.
- Added `src/App.test.tsx`, which verifies that `/login` first shows the route fallback and then resolves to the lazy Login page.
- The post-change Vite build emits 28 JavaScript chunks. The initial entry is `index-6ac964bc.js`, `463.07 kB` minified and `138.82 kB` gzip. It has no >500 kB warning.
- Meaningful lazy route chunks are Dashboard (`424.32 kB` / `115.45 kB` gzip), Bookings (`5.99 kB` / `2.38 kB`), Booking (`1.93 kB` / `0.98 kB`), Checkin (`3.42 kB` / `1.63 kB`), Cabins (`9.47 kB` / `3.24 kB`), Settings (`1.84 kB` / `0.74 kB`), Account (`3.22 kB` / `1.33 kB`), Login (`2.81 kB` / `1.32 kB`), and PageNotFound (`0.74 kB` / `0.47 kB`).
- Initial-entry reduction is `528.72 kB` minified (53.31%) and `145.37 kB` gzip (51.15%).
- React Query Devtools remain eager. The Vite output supplied no independently attributable Devtools production size, so no opportunistic loading change was made. No manual Rollup chunks or dependencies were added.
- README and ROADMAP now retain only the measured gzip fact, current test count, and remaining bundle limitation.

## Not Changed

- No route paths, navigation, ProtectedRoute behaviour, authentication logic, business logic, data fetching, query keys, mutations, Dashboard charts, Recharts version, dependencies, Vite chunk warning limit, or manual chunk configuration changed.
- No browser/manual authenticated route check was performed because this environment did not provide authorised credentials. The mandatory production build and automated public-route check passed.

## Verification

- `npm ci`: passed with existing transitive deprecation warnings only.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 34 files / 169 tests. The suite prints the existing React Router v7 future-flag warnings during the new BrowserRouter test.
- `npm run build`: passed. Baseline and post-change output are recorded above from the same environment; the post-change >500 kB warning is gone.
- `git diff --check`: passed.
- `npm audit --omit=dev`: reports the two known moderate React Router v6 advisories; the offered `react-router-dom@7.18.3` remediation is a breaking, deferred v7 upgrade.

## Risks / Notes

- Route splitting measures build output only. It does not establish Lighthouse, Core Web Vitals, latency, or user-perceived loading improvements.
- No bundle budget or dependency-level size attribution has been added. Further performance work requires separate measured evidence.
- Hosted Supabase CLI migration-history reconciliation, broader query-state work, feature-level responsive work, and the deferred React Router v7 upgrade remain separate work.

## Next

Review the measured diff and open the Task 045 pull request. Do not merge automatically.
