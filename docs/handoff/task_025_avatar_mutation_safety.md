# Task

025 — Avatar lifecycle mutation safety (Stage 1: repository implementation and Draft PR)

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
- Added the proposed forward-only `supabase/migrations/20260910000000_avatar_lifecycle_cleanup.sql` migration and recorded repository-only progress in `ROADMAP.md`.

## Not Changed

- No hosted Supabase configuration or policy has been changed.
- No Supabase CLI command, `supabase db push`, migration-history reconciliation, UI boundary, hook, service-role code, dependency, route, Auth setting, RLS table policy, bucket visibility, MIME limit, or file-size limit changed.
- The historical Phase 0.5 migration and documented baseline remain unchanged.

## Local Verification

- `npm ci` passed (with existing transitive dependency deprecation warnings).
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 12 files / 72 tests.
- `npm run build` passed. The existing large-chunk warning remains (972.49 kB minified / 278.98 kB gzip main bundle).
- `git diff --check` passed.
- `npm audit --omit=dev` reports the two documented moderate React Router v6 advisories. The only available fix is the breaking Router v7 upgrade, which is out of scope.

## Proposed Supabase Policy Change

`supabase/migrations/20260910000000_avatar_lifecycle_cleanup.sql` adds only these idempotently named authenticated `storage.objects` policies:

- `phase_2_5_avatars_select_own`: SELECT where `bucket_id = 'avatars'` and `name LIKE ('avatar-' || auth.uid()::text || '-%')`.
- `phase_2_5_avatars_delete_own`: DELETE with the same self-scoped bucket/name predicate.

It adds no UPDATE or anonymous policy and does not alter the existing avatar INSERT rule, cabin-image policies, bucket visibility, MIME restrictions, file-size limits, database RLS, or Auth settings.

## Manual Hosted Verification

PENDING HUMAN VERIFICATION

Do not apply this migration through `supabase db push`. After substantive Draft PR review, a human must manually review and apply the SQL through the approved hosted workflow, then verify anonymous denial and authenticated same-user SELECT/DELETE, alongside denial for another user's avatar object.

## Risks / Notes

- Until the proposed hosted policies are manually applied and verified, new-object rollback and old-avatar cleanup will be attempted but may be denied by the current hosted Storage policy; cleanup failures are deliberately non-fatal and logged while primary Auth semantics are preserved.
- The service uses the current user returned by Supabase, not UI-provided metadata, for filename ownership and old-avatar cleanup decisions.
- Tests use only synthetic IDs, URLs, avatar objects, and passwords; no hosted data, identity, credential, or token is used.

## Next

Obtain human/substantive review of this Draft PR, migration SQL, and lifecycle behaviour. Only after manual hosted application and verification should the PR be marked ready; then review the remaining profile/avatar UI boundary separately for a subsequent TypeScript task.
