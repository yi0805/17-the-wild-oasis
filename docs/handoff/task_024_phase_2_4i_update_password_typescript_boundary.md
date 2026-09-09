# Task

024 — Phase 2.4i Update Password TypeScript boundary

## Goal

Migrate the active password-update form boundary to TypeScript while preserving its React Hook Form validation and authenticated password-update workflow.

Branch: `task/024-phase-2-4i-update-password-typescript-boundary`

Base main SHA: `39bc5e79ac1bab7605b84667d115ea49f9f43e4f`

## Changed

- Renamed `UpdatePasswordForm` to `.tsx` and added explicit React Hook Form values with typed `SubmitHandler` submission.
- Password confirmation remains form-only; the existing mutation receives only `{ password }`.
- Preserved required, minimum-length, and matching-password validation; mutation pending disabled state; successful reset; and Cancel reset.
- Added seven behavioural tests using real React Hook Form, TanStack Query, and `useUpdateUser` while mocking only `apiAuth.updateCurrentUser`: invalid validation paths, exact mutation payload, pending state, successful reset, and cancel reset. The suite is 11 files / 62 tests.
- Recorded this completed boundary in `ROADMAP.md`.

## Not Changed

- No authentication service or hook, shared UI component, Supabase Auth configuration, RLS/Storage policy, dependency, route, or profile/avatar account-update boundary changed.

## Verification

- `npm ci` passed (with existing transitive dependency deprecation warnings).
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 11 files / 62 tests.
- `npm run build` passed. The existing large-chunk warning remains (971.77 kB minified / 278.67 kB gzip main bundle).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The only available fix is the breaking Router v7 upgrade, which is out of scope.

## Risks / Notes

- The legacy JavaScript `FormRow` component infers `label` and `error` as required to TSX consumers, so this boundary passes narrow `undefined` compatibility props without changing shared UI.
- The legacy JavaScript `Button` does not declare its existing `variation` styling prop. A local typed styled wrapper preserves the current secondary Cancel button without widening the task to shared UI migration.
- Tests use synthetic password strings and mock the service boundary; they do not access hosted Supabase, include an account identity, or log/persist passwords.

## Next

Review the remaining profile/avatar account-update boundary separately, including its multi-step Auth/Storage mutation behaviour, before defining Task 025.
