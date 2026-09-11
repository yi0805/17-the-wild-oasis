# Task

044 — Complete safe owned cabin-image replacement cleanup and durable retry

## Goal

Safely clean up a replaced application-owned cabin image only when it is currently unreferenced, while retaining durable retry state for failed Storage removal.

Base `main` SHA: `4b3c56ab0680824b4b674183b55bfa11015105a1`.

## Changed

- Human hosted verification confirmed the Task 043 queue migration was manually applied through Supabase SQL Editor: the queue existed, was empty after a rolled-back authenticated CRUD verification transaction, and anonymous SELECT was denied.
- Regenerated `src/types/database.types.ts` from the hosted `public` schema using `npx --yes supabase@2.116.0 gen types typescript --project-id <locally-derived-project-ref> --schema public`. The only generated schema change was `cabin_image_cleanup_queue` with `Row`, `Insert`, and `Update` contracts for `object_name`, `created_at`, `attempt_count`, `last_attempt_at`, and `last_error`; no unrelated schema drift was accepted.
- A replacement edit with a new `File` now reads the authoritative current cabin image before upload. A failed or missing pre-read aborts before upload, row mutation, queue access, or old-object cleanup.
- After a successful update only, strict canonical ownership is checked and a fresh exact-URL cabin reference query prevents removal of shared images. Reference-query failures fail closed and preserve the successful primary update.
- Unreferenced owned objects are queue-upserted with conflict-safe duplicate preservation before deletion. Successful removal deletes the queue row; failed removal retains it and increments concise retry metadata. Queue-write/read/metadata failures are diagnostic only and never roll back the cabin update or new image.
- Added a bounded batch-of-10 retry service. Every queued item is reconstructed, revalidated as canonical, and reference-checked immediately before removal; failures are isolated per item.
- Added a once-per-mount best-effort retry hook to the production Cabins page. It is separate from `getCabins()` and does not poll or invalidate unrelated queries.

## Not Changed

- No cabin-delete image cleanup, historical/legacy migration or bulk cleanup, duplicate-cabin behavior, image-reference schema, trigger/RPC, cron, Edge Function, service role, dependency, avatar behavior, bucket restriction, or existing Storage policy changed.
- No hosted schema mutation was run by Codex. `supabase db push` was not run.

## Verification

- `npm ci`: passed (existing transitive deprecation warnings and development audit notice only).
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Focused cleanup, mutation, and retry-trigger regressions: 4 files / 25 tests passed.
- `npm test -- --reporter=dot`: passed, 33 files / 167 tests.
- `npm run build`: passed. Existing large-chunk warning remains (`991.71 kB` minified / `284.16 kB` gzip).
- `git diff --check`: passed.
- `npm audit --omit=dev`: reports the two known moderate React Router v6 advisories; the offered `react-router-dom@7.18.3` remediation is a breaking, deferred v7 upgrade.

## Risks / Notes

- Hosted Supabase CLI migration history remains unreconciled. Continue to use the reviewed SQL Editor process; do not run `supabase db push`.
- Cleanup is best-effort and is triggered only by a bounded Cabins-page lifecycle pass. It is not guaranteed background processing.

## Next

Review the Task 044 PR before merge. Remaining Phase 4 work includes other query/accessibility/responsive hardening and measured bundle work. Cabin-delete cleanup and historical cabin-image cleanup require separate scope.
