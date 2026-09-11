# Task

042 — Harden image upload validation and Storage limits

## Goal

Use one image-upload policy to reject unsupported or oversized cabin images and avatars at the form, service, and Storage-configuration boundaries.

## Changed

- Base `main` SHA: `7d933c8f1bef8c25c328aa074a026e412ddd5734`.
- Added `src/utils/imageUpload.ts` as the single application policy: `image/jpeg`, `image/png`, and `image/webp` are allowed; the maximum is `5 * 1024 * 1024` bytes (`5,242,880`). Its `IMAGE_INPUT_ACCEPT` value is reused by both file inputs, and its validator returns consistent short user-facing type or size errors.
- Cabin create and replacement-image validation runs through React Hook Form on the existing Cabin photo row. New invalid files do not reach the cabin mutation; a valid existing string URL in edit mode still needs no replacement.
- The profile form validates a selected avatar on selection and submit, clears the error after a valid replacement or cancel/successful reset, and still permits full-name-only updates.
- `createEditCabin` rejects an invalid new `File` before generating a name, Storage access, or a cabin database mutation. Existing string images bypass new-file validation. Its existing upload → database write → newly-uploaded-object cleanup ordering is unchanged.
- `updateCurrentUser` rejects an invalid avatar before `auth.getUser`, Storage access, or Auth metadata mutation. Password-only and full-name-only flows are unchanged, including the Task 025 avatar rollback and old-owned-avatar cleanup behaviour.
- Added `supabase/migrations/20260911000000_image_upload_limits.sql`. It starts a transaction, clearly fails when either expected bucket ID (`avatars` or `cabin-images`) is absent, and idempotently sets only `file_size_limit = 5242880` and `allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']` for those two existing buckets.
- Existing bucket public-delivery settings and all `storage.objects` RLS policies, including the Task 025 own-avatar policies, are untouched.
- Added form and service regressions for unsupported MIME types and oversized files; existing valid-file, edit-string, mutation compensation, and avatar lifecycle coverage remains.

## Not Changed

- No old cabin-image ownership or cleanup work, avatar lifecycle redesign, resizing, compression, EXIF stripping, magic-byte inspection, malware scanning, bucket visibility change, dependency addition, or Supabase CLI migration-history repair.
- The migration does not create/recreate buckets, modify `storage.objects`, or change Storage RLS policies.

## Verification

- `npm ci`: passed (existing transitive deprecation warnings and a full-development dependency audit notice only).
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Focused image-upload tests passed: 4 files / 38 tests.
- `npm test`: passed, 29 files / 137 tests.
- `npm run build`: passed. The existing large initial-chunk warning remains (`988.38 kB` minified / `283.19 kB` gzip).
- `git diff --check`: passed.
- `npm audit --omit=dev`: reports the two known moderate React Router v6 advisories. The only available remediation is the intentionally deferred breaking `react-router-dom@7.18.3` upgrade.

## Risks / Notes

- **MANUAL HOSTED APPLY REQUIRED AFTER REVIEW/MERGE.** The migration is committed source of truth only; it was not applied to hosted Supabase and hosted bucket restrictions are not claimed as active.
- Hosted Supabase CLI migration history remains unreconciled. Do not run `supabase db push`; use the reviewed migration in the Supabase SQL Editor after merge, then independently verify both bucket values.
- MIME validation uses the browser-provided `File.type`. It does not inspect magic bytes, transform images, strip metadata, or provide malware scanning/deep content verification.

## Next

After review/merge, manually apply and verify `supabase/migrations/20260911000000_image_upload_limits.sql` in the hosted Supabase SQL Editor. Separately scope safe old cabin-image ownership and cleanup, remaining query states, responsive/accessibility work, bundle optimisation, React Router v7, and hosted migration-history reconciliation.
