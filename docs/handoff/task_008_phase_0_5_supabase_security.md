# Task

008 — Phase 0.5 Supabase security preparation

## Goal

Complete the approved Phase 0.5 security boundary with verified hosted application and manual anonymous/authenticated verification.

## Changed

### Prepared

- Removed the browser-client account-creation capability: its route, navigation entry, page, form/hook, and signup service function.
- Added the verified hosted baseline at `docs/supabase/current-security-baseline.md`. It contains configuration, RLS, grant, Storage, and schema metadata only; it is not a historical migration and contains no secrets or production rows.
- Added the first forward-only migration: `supabase/migrations/20260906000000_phase_0_5_security_boundary.sql`.
  - Revokes all table privileges from `anon` for `bookings`, `cabins`, `guests`, and `settings`.
  - Reduces `authenticated` table grants to bookings SELECT/UPDATE/DELETE; cabins SELECT/INSERT/UPDATE/DELETE; guests SELECT; settings SELECT/UPDATE.
  - Structurally replaces only the verified PERMISSIVE authenticated allow-all baseline policies with the approved target policies, including `settings.id = 1` restrictions.
  - Removes the exact PERMISSIVE global unrestricted `public` INSERT policy on `storage.objects` without relying on its display name.
  - Replaces only verified PERMISSIVE authenticated Storage policies with the exact baseline pure-bucket predicate shape. Ownership-scoped, restrictive, global, and unrelated-bucket policies do not match.
  - Avatars retain self-scoped INSERT. Cabin images retain shared-asset SELECT, INSERT, and DELETE; SELECT plus DELETE preserves the verified failed-database-write cleanup path, and UPDATE remains removed.
- Recorded the final verified hosted state and marked Phase 0.5 complete in `ROADMAP.md`.

### Completed hosted application and verification

- The human manually reviewed and applied the migration through Supabase SQL Editor; the result was `Success. No rows returned`.
- The human disabled public signup and raised the minimum password length to 8. Other documented Auth settings, buckets, and URL configuration were unchanged.
- Re-queried database policies/grants and Storage policies/buckets confirmed the approved least-privilege target, including no `anon` application-table grants and no unrestricted public Storage INSERT policy.
- Anonymous database and Storage writes were denied; authorised operator reads, settings update/restore, cabin-image upload/delete, avatar ownership rejection, valid avatar upload, and public-signup API rejection all passed.

### Review corrections

- Added authenticated, bucket-scoped `cabin-images` SELECT to preserve the verified SELECT-plus-DELETE failed-write cleanup path; UPDATE remains absent.
- Narrowed destructive table and Storage policy matching to exact verified PERMISSIVE baseline policy shape, role, command, and predicates.
- Corrected the verified Storage UPDATE baseline matcher to `USING (bucket_id = '<bucket>'::text)` with `WITH CHECK = NULL`, so the unused hosted UPDATE policies are removed.
- Replaced stale present-tense ROADMAP baseline statements with historical wording and removed the local filesystem link from the baseline document.

## Not Changed

- No additional hosted configuration was changed beyond the approved migration and Dashboard settings recorded above.
- The migration was applied manually through Supabase SQL Editor, not Supabase CLI. CLI migration history was not verified or reconciled.
- Secure password change, require-current-password, bucket public/private state, MIME/size settings, Site URL, and redirect URLs were not changed.
- Login, logout, current-user retrieval, account profile/password updates, and avatar updates remain unchanged.
- No roles, custom claims, Edge Functions, service-role code, tests, or dependencies were added.

## Verification

- `npm ci` passed. npm reported existing deprecation warnings for transitive tooling packages.
- `npm run lint` passed with zero warnings. The first invocation immediately after `npm ci` could not locate the local ESLint executable; after confirming `node_modules/.bin/eslint.cmd` existed, an immediate rerun passed without repository changes.
- `npm run build` passed. Vite retained its existing large-chunk advisory; the generated main chunk is 966.63 kB minified / 277.13 kB gzip.
- `git diff --check` passed.
- Repository searches confirmed that no account-creation route, signup form/hook, or signup service function remains under `src/`.
- Repository searches confirmed login, logout, current-user retrieval, password update, and profile/avatar update references remain; no service-role key, `auth.admin`, or privileged backend mechanism was introduced.
- Manually reviewed the complete source, baseline-document, migration, and handoff diff. The migration was not executed.
- Correction pass: `npm ci`, `npm run lint`, `npm run build`, and `git diff --check` passed. The tracked-file search found no local filesystem path, browser signup call, or removed account-creation route reference; the revised migration was manually reviewed and not executed.
- Final Storage correction: `git diff --check`, `npm run lint`, and `npm run build` passed. The complete Storage section was manually re-read: the two verified UPDATE baseline entries now require pure bucket `USING` with `WITH CHECK = NULL`, restrictive policies cannot match, and the final migration creates no Storage UPDATE policy.
- Finalization: human-observed policy/grant/bucket metadata and all documented anonymous/authenticated behavioural checks passed after manual SQL Editor application. `npm ci`, lint, build, and diff checks passed; `npm ci` required stopping a verified orphaned local build process that had locked `esbuild.exe`. No Phase 1 automated test suite exists.

## Risks / Notes

- The application still uses public object URLs. Bucket visibility and MIME/size hardening are explicitly deferred.
- The migration does not alter sequences, table data, schema, Auth schema, bucket records, or unrelated Storage buckets. Authenticated cabin INSERT and the SELECT-plus-DELETE Storage cleanup path were manually verified after application.
- The canonical deployment/Auth redirect URL remains unresolved. Successful old cabin-image replacement cleanup and old-avatar cleanup remain future work.
- If CLI-managed migration deployment is adopted, reconcile hosted migration history before relying on `supabase db push`.

## Next

Review the final Pull Request. Future work remains Phase 1 testing/CI, Phase 2 TypeScript migration, Phase 3 deployment configuration, and Phase 4 Storage file restrictions and owned old-image cleanup.
