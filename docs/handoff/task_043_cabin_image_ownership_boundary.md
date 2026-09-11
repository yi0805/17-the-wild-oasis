# Task

043 — Establish the owned cabin-image boundary and cleanup queue schema

## Goal

Prepare safe ownership identification for new cabin-image objects and a durable retry queue schema for a later cleanup lifecycle.

Base `main` SHA: `1d098536443b408d4bacd67c90258511c0c5fbd9`.

## Changed

- Replaced the legacy `${Math.random()}-${file.name}` cabin-object naming with `cabin-<UUID-v4>.<extension>` for new `File` uploads only. `apiCabins` calls `crypto.randomUUID()` and passes it to the pure `src/utils/cabinImage.ts` helper.
- MIME mapping is exact: `image/jpeg` → `jpg`, `image/png` → `png`, and `image/webp` → `webp`. Original filenames are never included in new Storage object names.
- Added strict positive ownership parsing. It returns an object name only for a valid URL with the exact configured Supabase origin, no query or fragment, the exact public `cabin-images` path, a decoded non-nested object name, and an exact lowercase canonical UUID-v4 `.jpg`, `.png`, or `.webp` name. External, wrong-project, wrong-bucket, legacy, malformed, fake-prefix, nested, and query/path-trick URLs return `null`.
- Existing string image values remain unchanged and do not trigger upload or UUID generation. Historical/default URLs are intentionally non-owned and are neither renamed nor migrated.
- Preserved upload → cabin database write → newly uploaded-object rollback ordering. Failed create/edit database writes remove only the new canonical object. No old image is removed after a successful replacement.
- Added `supabase/migrations/20260911010000_cabin_image_cleanup_queue.sql`, which creates only `public.cabin_image_cleanup_queue` with `object_name` primary key, `created_at`, `attempt_count`, `last_attempt_at`, and `last_error`. It has a nonnegative attempt-count check and an exact canonical owned-name check.
- The queue revokes `PUBLIC`, `anon`, and initial `authenticated` grants, then grants authenticated `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. RLS is enabled with one authenticated policy per operation. No existing public-table or Storage policy changes.
- Updated Task 042 documentation after human SQL verification: both public `avatars` and `cabin-images` buckets have a 5,242,880-byte maximum and allow JPEG, PNG, and WebP.

## Not Changed

- No successful old-cabin-image deletion, queue insert, retry processor, background job, bulk cleanup, historical filename migration, avatar behavior, Storage-bucket setting, existing Storage RLS, dependency, or generated database type changed.
- `src/types/database.types.ts` was deliberately not hand-edited: the new table does not yet exist in the hosted schema.
- The cleanup-queue migration was not applied. Do not run `supabase db push`; hosted migration history remains unreconciled.

## Verification

- `npm ci`: passed (existing transitive deprecation warnings and full development-dependency audit notice only).
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Focused ownership and cabin service regressions: 2 files / 22 tests passed. Service tests narrowly stubbed `crypto.randomUUID()` with `550e8400-e29b-41d4-a716-446655440000` and restore it after every test.
- `npm test`: passed, 30 files / 152 tests.
- `npm run build`: passed. Existing large-chunk warning remains (`988.55 kB` minified / `283.27 kB` gzip).
- `git diff --check`: passed.
- `npm audit --omit=dev`: reports the two known moderate React Router v6 advisories; the offered `react-router-dom@7.18.3` remediation is a breaking, deferred v7 upgrade.

## Risks / Notes

- **MANUAL HOSTED APPLY REQUIRED AFTER REVIEW/MERGE.** Apply `supabase/migrations/20260911010000_cabin_image_cleanup_queue.sql` through Supabase SQL Editor only after review/merge, then verify the table, constraint, grants, RLS, and authenticated/anonymous access paths.
- The queue migration is schema preparation only. It records no rows and does not delete Storage objects.

## Next

Task 044 is blocked until the Task 043 migration has been manually applied to hosted Supabase, its queue/security metadata has been verified, and `src/types/database.types.ts` has been regenerated from that real hosted schema. Only then implement successful old-owned-image cleanup, durable failed-cleanup queue writes, and retry behavior while preserving the successful cabin update/new image.
