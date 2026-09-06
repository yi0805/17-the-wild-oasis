# Task

008 — Phase 0.5 Supabase security preparation

## Goal

Prepare the approved Phase 0.5 security boundary for review without applying hosted Supabase, Auth, RLS, Storage, or Dashboard changes.

## Changed

### Prepared

- Removed the browser-client account-creation capability: the `/users` route, navigation entry, `Users` page, signup form/hook, and `supabase.auth.signUp()` service function.
- Added the verified hosted baseline at `docs/supabase/current-security-baseline.md`. It contains configuration, RLS, grant, Storage, and schema metadata only; it is not a historical migration and contains no secrets or production rows.
- Added the first forward-only, unapplied migration: `supabase/migrations/20260906000000_phase_0_5_security_boundary.sql`.
  - Revokes all table privileges from `anon` for `bookings`, `cabins`, `guests`, and `settings`.
  - Reduces `authenticated` table grants to bookings SELECT/UPDATE/DELETE; cabins SELECT/INSERT/UPDATE/DELETE; guests SELECT; settings SELECT/UPDATE.
  - Structurally replaces only the verified authenticated allow-all baseline policies with the approved target policies, including `settings.id = 1` restrictions.
  - Removes the exact global unrestricted `public` INSERT policy on `storage.objects` without relying on its display name.
  - Replaces authenticated policies scoped to `avatars` and `cabin-images` only. Avatars retain self-scoped INSERT; cabin images retain shared-asset INSERT and failed-write-cleanup DELETE.
- Added a ROADMAP decision noting that preparation is complete but hosted changes and verification remain pending.

## Not Changed

- The migration has not been applied to any database.
- No Supabase Dashboard or Auth setting was changed. The pending human-only changes are: disable `Allow new users to sign up` and raise the minimum password length from 6 to 8.
- Secure password change, require-current-password, bucket public/private state, MIME/size settings, Site URL, and redirect URLs were not changed.
- Login, logout, current-user retrieval, account profile/password updates, and avatar updates remain unchanged.
- No roles, custom claims, Edge Functions, service-role code, tests, dependencies, or Pull Request were added.
- Phase 0.5 remains unchecked in `ROADMAP.md`; anonymous/authenticated verification has not occurred.

## Verification

- `npm ci` passed. npm reported existing deprecation warnings for transitive tooling packages.
- `npm run lint` passed with zero warnings. The first invocation immediately after `npm ci` could not locate the local ESLint executable; after confirming `node_modules/.bin/eslint.cmd` existed, an immediate rerun passed without repository changes.
- `npm run build` passed. Vite retained its existing large-chunk advisory; the generated main chunk is 966.63 kB minified / 277.13 kB gzip.
- `git diff --check` passed.
- Repository searches confirmed that no `/users` route, signup form/hook, `signup()` service function, or `signUp(` browser-client call remains under `src/`.
- Repository searches confirmed login, logout, current-user retrieval, password update, and profile/avatar update references remain; no service-role key, `auth.admin`, or privileged backend mechanism was introduced.
- Manually reviewed the complete source, baseline-document, migration, and handoff diff. The migration was not executed.

## Risks / Notes

- The migration is intentionally unapplied pending ChatGPT/human review. Applying it before reviewing the precise hosted baseline could affect authenticated operations access.
- Browser account creation is removed before public signup is disabled in the Dashboard. Until the human completes that Dashboard change, direct public Auth signup remains a hosted configuration risk.
- The application still uses public object URLs. Bucket visibility and MIME/size hardening are explicitly deferred.
- The migration does not alter sequences, table data, schema, Auth schema, bucket records, or unrelated Storage buckets. Authenticated cabin INSERT and the Storage cleanup path require manual verification after approval.

## Next

Have ChatGPT/human review the baseline and unapplied migration, then approve a hosted change window. The human must disable public signup and set the password minimum to 8; only then apply the reviewed migration and run the documented anonymous/authenticated verification plan before completing Phase 0.5.
