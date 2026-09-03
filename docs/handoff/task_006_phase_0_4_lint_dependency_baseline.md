# Task

006 — Phase 0.4 lint and dependency baseline

## Goal

Consolidate the active ESLint setup, correct the Fast Refresh warning structurally, resolve approved compatible production dependency findings, and document any justified residual audit risk.

## Changed

- Removed the unused CRA `.eslintrc.json` configuration and `eslint-config-react-app` dev dependency. `.eslintrc.cjs` remains the sole ESLint configuration; `vite-plugin-eslint` remains enabled.
- Split the dark-mode module into `DarkModeContext.js`, which exports the context and `useDarkMode`, and `DarkModeProvider.jsx`, which exports only the provider component. Updated `App.jsx` to consume the provider from its new module without changing dark-mode state or UI behavior.
- Updated only approved compatible lockfile resolutions: `react-router-dom` and `react-router` 6.30.6, `@remix-run/router` 1.23.4, `styled-components` 6.5.3, `lodash` 4.18.1, and `ws` 8.21.3. Existing package.json semver ranges were retained.
- The Styled Components production `postcss`/`nanoid` path is no longer installed.
- Marked Phase 0.4 complete and recorded the final audit outcome in `ROADMAP.md`.

## Not Changed

- Did not migrate React Router to v7/v8, Recharts to v3, or any Supabase package; did not upgrade Vite, ESLint, or unrelated packages.
- Did not change the lint warning threshold or disable `react-refresh/only-export-components`.
- Did not add tests, CI, TypeScript, feature work, or Supabase/Auth/RLS/Storage changes. No Supabase mutation was performed.

## Verification

- `npm ci` passed.
- `npm run lint` passed with zero warnings.
- `npm run build` passed. Vite retains its existing large-chunk advisory; the generated main chunk is 969.47 kB minified / 277.67 kB gzip.
- `npm audit --omit=dev` and its JSON form report 2 moderate findings, both React Router v6 residuals described below.
- Dependency inspection confirmed `react-router-dom`/`react-router` 6.30.6 with `@remix-run/router` 1.23.4; `styled-components` 6.5.3 with no production PostCSS/Nanoid path; Recharts → `lodash` 4.18.1; and Supabase Realtime → `ws` 8.21.3.
- `git diff --check` passed.
- Started Vite locally and verified direct loopback delivery of `/` and `/login` with HTTP 200. A Codex browser view of `/login` was queued; authenticated dashboard, chart, cabin-form, navigation, and interactive dark-mode checks were not performed because no authorised account/session was available.

## Risks / Notes

- The production audit is intentionally non-zero: `react-router` 6.30.6 remains in the audited ranges for GHSA-wrjc-x8rr-h8h6 (CVE-2025-68470 bypass via backslash navigation) and GHSA-337j-9hxr-rhxg (SSR hydration constructor injection). npm reports only a breaking `react-router-dom` 7.18.3 upgrade as a fix.
- The application uses declarative `BrowserRouter`, not SSR hydration. Its current navigation values are static internal paths or paths prefixed with a controlled application route plus an ID. The remaining risk is therefore low in the current implementation, but must be reassessed whenever routing/navigation inputs change.
- React Router v7 migration is deferred because it is a major migration outside Phase 0.4. Recharts v3 and Supabase upgrades are also intentionally deferred.

## Next

Phase 0.5 — user-assisted Supabase Auth, RLS, and Storage security review.
