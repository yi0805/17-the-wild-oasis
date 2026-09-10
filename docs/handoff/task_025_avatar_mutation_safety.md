# Task

025 — Avatar lifecycle mutation safety (Stage 2: human hosted verification)

Branch: `task/025-avatar-mutation-safety`

Base main SHA: `00ed45e89a604b1fe0a4cc4755c39c2f53f3fa47`

## Goal

Harden the profile/avatar mutation lifecycle before its UI TypeScript migration, preventing avoidable partial Auth updates and application-owned avatar Storage orphans without changing the authenticated-user model.

## Problem Found

The prior flow wrote full-name metadata before uploading an avatar, then attempted a second Auth metadata update for the avatar URL. Upload failures could therefore leave a partial profile update, metadata failures could orphan the new object, and successful replacements never cleaned up a previous application-owned avatar.

## Changed

- `updateCurrentUser` now leaves password-only and full-name-only paths on their existing Auth-only flow, with no Storage access.
- Avatar replacement now resolves the authoritative current user first, uploads a generated same-user avatar object, then persists the requested profile metadata and new avatar URL in one Auth update.
- An Auth metadata failure triggers best-effort removal of exactly the newly uploaded avatar; a rollback cleanup failure is logged without masking the Auth failure.
- After a successful Auth update, a prior avatar is removed only when its parsed URL targets this project's `avatars` public path, its direct object name exactly matches the current user's generated-avatar scheme, and it is not the new object. External, malformed, and other-user values are retained.
- Added 10 local service tests covering password/full-name paths, lookup/upload/auth failures, rollback semantics, owned cleanup, and non-owned-avatar safety. The suite is 12 files / 72 tests.
- Added the forward-only `supabase/migrations/20260910000000_avatar_lifecycle_cleanup.sql` migration and recorded completion in `ROADMAP.md` after human hosted verification.

## Not Changed

- No further application code, migration SQL, test, dependency, UI boundary, hook, service-role code, route, Auth setting, RLS table policy, bucket visibility, MIME limit, or file-size limit changed during Stage 2.
- No Supabase CLI command, `supabase db push`, or migration-history reconciliation was used.
- The historical Phase 0.5 migration and documented baseline remain unchanged.

## Local Verification

- `npm ci` passed (with existing transitive dependency deprecation warnings).
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 12 files / 72 tests.
- `npm run build` passed. The existing large-chunk warning remains (972.49 kB minified / 278.98 kB gzip main bundle).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The only available fix is the breaking Router v7 upgrade, which is out of scope.

## Hosted Supabase Policy Change

The human manually applied `supabase/migrations/20260910000000_avatar_lifecycle_cleanup.sql` through Supabase SQL Editor. Hosted avatar policies are now:

- `phase_0_5_avatars_insert`: authenticated self-scoped INSERT.
- `phase_2_5_avatars_select_own`: authenticated self-scoped SELECT where `bucket_id = 'avatars'` and `name LIKE ('avatar-' || auth.uid()::text || '-%')`.
- `phase_2_5_avatars_delete_own`: authenticated self-scoped DELETE with the same bucket/name predicate.

No avatar UPDATE policy or anonymous avatar mutation policy was observed. The migration does not alter cabin-image policies, bucket visibility, MIME restrictions, file-size limits, database RLS, or Auth settings.

## Manual Hosted Verification

Manual hosted verification is separate from automated CI and was completed successfully by a human against the Task 025 Vercel Preview deployment and hosted Supabase project.

- Avatar replacement uploaded a new object, persisted Auth metadata, issued a DELETE for the previous current avatar, received HTTP 200, returned the deleted Storage object, and the object was absent from a later `storage.objects` query.
- A known existing avatar object returned `target_exists = true` before permission checks.
- With `ROLE authenticated` and a different synthetic JWT subject, the target object returned `visible_rows = 0`.
- With `ROLE anon`, the same existing target object returned `visible_rows = 0`.

No real credential, token, user identity, or object name is recorded here.

## Risks / Notes

- The service uses the current user returned by Supabase, not UI-provided metadata, for filename ownership and old-avatar cleanup decisions.
- Tests use only synthetic IDs, URLs, avatar objects, and passwords; no hosted data, identity, credential, or token is used.
- Historical orphan avatars identified during verification are pre-existing and out of scope. Task 025 intentionally does not bulk-delete historical objects.

## Next

Review the PR now that the human hosted verification is recorded; do not merge automatically. Review the remaining profile/avatar UI boundary separately for a subsequent TypeScript task.
