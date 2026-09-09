# Task

023 — Phase 2.4h Login TypeScript boundary

## Goal

Migrate the active Login form boundary to TypeScript while preserving the authentication workflow and adding focused behavioural regression coverage.

Branch: `task/023-phase-2-4h-login-typescript-boundary`

Base main SHA: `a83276f738eda12a6262722ad9b20c44e4551346`

## Changed

- Renamed `LoginForm` to `.tsx` and explicitly typed its form submission event.
- Email and password retain inferred string state and pass unchanged through the existing typed `useLogin` contract.
- Preserved incomplete-submit prevention, pending disabled inputs/button with spinner, and `onSettled` field clearing.
- Added six behavioural tests using real TanStack Query, `useLogin`, and MemoryRouter while mocking only `apiAuth.login`: empty fields, incomplete credentials, exact synthetic credentials, pending state, failed-attempt field clearing, and successful user-cache/dashboard navigation behaviour. The suite is 10 files / 55 tests.
- Recorded this completed boundary in `ROADMAP.md`.

## Not Changed

- No authentication service or hook, shared UI component, Supabase Auth configuration, RLS/Storage policy, dependency, route, or account/profile/password boundary changed.

## Verification

- `npm ci` passed (with existing transitive dependency deprecation warnings).
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 10 files / 55 tests.
- `npm run build` passed. The existing large-chunk warning remains (971.74 kB minified / 278.66 kB gzip main bundle).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The only available fix is the breaking Router v7 upgrade, which is out of scope.

## Risks / Notes

- The legacy JavaScript `FormRowVertical` component infers `label` and `error` as required to TSX consumers, so this boundary passes narrow `undefined` compatibility props without changing shared UI.
- The legacy JavaScript `Button` does not declare its existing `size` styling prop. A local typed styled wrapper preserves the current `large` button styling without widening the task to shared UI migration.
- Tests use only synthetic `.invalid` credentials and mock the service boundary; they do not access hosted Supabase or include an account identity.

## Next

Review the remaining account/profile/password authentication boundaries for the next Phase 2 task.
