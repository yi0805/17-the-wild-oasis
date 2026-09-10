# Task

026 — Profile / Avatar UI TypeScript boundary

Branch: `task/026-profile-avatar-ui-typescript`

Base main SHA: `7336ebd4a321899bc3bc2475326b7522c27487f2`

## Goal

Migrate the active profile-update form and header avatar UI boundary to TypeScript while preserving the existing profile mutation contract and adding focused behavioural regression coverage.

## Changed

- Renamed `UpdateUserDataForm.jsx` and `UserAvatar.jsx` to TSX.
- `UpdateUserDataForm` now stores its avatar selection as `File | null`, types submit/change events, and narrows `event.target.files` with a null fallback.
- Nullable `useUser()` data and untrusted metadata values are safely narrowed before they reach the UI. Missing/invalid profile metadata receives neutral form values; the header avatar uses `User` and `default-user.jpg` fallbacks.
- The form retains the `{ fullName, avatar }` mutation payload, disabled email field, pending controls, cancel behaviour, and successful avatar reset. Its native file input is explicitly cleared on cancel and successful update.
- Added profile-form and avatar-display behavioural tests using only synthetic users and files.
- Added the Task 026 roadmap record.

## Not Changed

- `apiAuth.ts`, `useUpdateUser.ts`, `useUser.ts`, avatar upload/rollback/cleanup ordering, Supabase configuration, policies, migrations, shared UI components, dependencies, routing, and styling were not changed.
- No hosted verification or Supabase command was performed.

## Verification

- `npm ci` passed, with existing transitive dependency deprecation warnings.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 14 test files / 86 tests.
- `npm run build` passed. The existing large-chunk warning remains (973.16 kB minified / 279.14 kB gzip).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. Its only offered remediation is the breaking `react-router-dom` 7.18.3 upgrade, which is intentionally out of scope.

## Risks / Notes

- The old JS shared components do not expose TypeScript prop declarations. A local typed styled secondary-button adapter follows the existing `UpdatePasswordForm` migration pattern; no shared component was changed.
- The current form is rendered safely while `useUser()` is null/undefined and enables controls once a user exists. This avoids an unsafe non-null assertion without changing the authenticated profile flow.

## Next

Continue the incremental TypeScript migration with the next approved active UI boundary; keep Auth and Storage lifecycle work separate unless a concrete blocker emerges.
