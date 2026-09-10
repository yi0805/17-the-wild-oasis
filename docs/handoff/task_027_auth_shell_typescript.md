# Task

027 — Authentication shell TypeScript boundary

Branch: `task/027-auth-shell-typescript`

Base main SHA: `a31db7b6987eedc8bfc5181bd39bd8c0c03fb5eb`

## Goal

Migrate the active logout control and protected-route UI guard to TypeScript while preserving the existing authentication-shell behaviour and adding focused behavioural regression coverage.

## Changed

- Renamed `Logout.jsx` and `ProtectedRoute.jsx` to TSX.
- Logout keeps the existing `useLogout` TanStack Query mutation; its typed click callback invokes the mutation without passing a click event as mutation variables.
- Logout retains pending disable/spinner behaviour, cache removal, and replace navigation to `/login`. The button and pending spinner now have ARIA labels for observable, accessible state.
- ProtectedRoute types `children` as `ReactNode`, retains its full-page loading spinner, authenticated-child rendering, and completed unauthenticated redirect, and explicitly returns `null` while an unauthenticated query remains fetching.
- Added focused logout and protected-route behavioural tests using synthetic API results and local query caches only.
- Added the Task 027 roadmap record.

## Not Changed

- `apiAuth.ts`, `useLogout.ts`, `useUser.ts`, HeaderMenu, App, shared UI components, dependencies, routing architecture, Supabase Auth, RLS, Storage policies, and migrations were not changed.
- No hosted verification or Supabase command was performed.

## Verification

- `npm ci` passed, with existing transitive dependency deprecation warnings.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 16 test files / 93 tests.
- `npm run build` passed. The existing large-chunk warning remains (973.27 kB minified / 279.18 kB gzip).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. Its only offered remediation is the breaking `react-router-dom` 7.18.3 upgrade, which is intentionally out of scope.

## Risks / Notes

- ProtectedRoute is only a client-side UI navigation guard. It does not replace Supabase authorization, RLS, or Storage policies.
- The test suite uses the real React Router, TanStack Query providers, and feature hooks; only the API boundary is mocked. A pre-populated local query cache exercises the `isFetching` gate without shared or hosted data.

## Next

Continue the incremental TypeScript migration with the next approved active UI boundary; retain the distinction between UI navigation guards and Supabase authorization.
