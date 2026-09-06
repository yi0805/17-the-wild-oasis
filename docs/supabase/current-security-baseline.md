# Current Supabase Security Baseline

## Purpose and scope

This document records the hosted Supabase baseline observed during Phase 0.5 on 2026-09-06. It is evidence for reviewing the first forward-only security migration; it is **not** a fabricated historical migration.

No secrets, user identities, user rows, application rows, passwords, tokens, or production data are included here.

## Verified pre-change hosted baseline

The following sections preserve the hosted state observed before the approved Phase 0.5 changes were applied.

### Auth baseline

- The Email provider is enabled.
- Public new-user signup was enabled at the time of inspection.
- Confirm email is enabled.
- Anonymous sign-in is disabled.
- Manual linking is disabled.
- Secure email change is enabled.
- Secure password change is disabled.
- Require-current-password-on-update is disabled.
- The minimum Supabase password length is 6.
- No additional password-complexity requirement was observed.
- The Site URL is a local-development URL.
- Both Netlify and Vercel redirect URLs currently exist.
- The canonical deployment target has not yet been decided.

No real user identities are recorded. At this baseline point, public signup was pending manual disablement and operations-account provisioning was planned outside the browser application.

### Application authorization model

No distinct role model is represented in the current frontend repository.

Protected routes distinguish only authenticated and unauthenticated users. The approved product model is:

```text
Unauthenticated
→ no operations-data access

Authenticated
→ trusted operations user
→ all operators share the hotel's operational data
```

### Public-table RLS baseline

RLS is enabled on `bookings`, `cabins`, `guests`, and `settings`. No `anon` RLS policies were observed on these tables. The policies below were observed as PERMISSIVE policies.

| Table | Authenticated policies observed |
| --- | --- |
| `bookings` | SELECT `USING (true)`; INSERT `WITH CHECK (true)`; UPDATE `USING (true) WITH CHECK (true)`; DELETE `USING (true)` |
| `cabins` | SELECT `USING (true)`; INSERT `WITH CHECK (true)`; UPDATE `USING (true) WITH CHECK (true)`; DELETE `USING (true)` |
| `guests` | SELECT `USING (true)`; INSERT `WITH CHECK (true)`; UPDATE `USING (true) WITH CHECK (true)`; DELETE `USING (true)` |
| `settings` | SELECT `USING (true)`; UPDATE `USING (true) WITH CHECK (true)` |

Both `anon` and `authenticated` currently have broad table-level grants, including SELECT, INSERT, UPDATE, DELETE, and privileges such as TRIGGER, TRUNCATE, and REFERENCES. RLS currently blocks anonymous row access despite those grants, but the grants are broader than the application requires.

### Storage baseline

| Bucket | Public | File-size limit | Allowed MIME types |
| --- | --- | --- | --- |
| `avatars` | `true` | `NULL` | `NULL` |
| `cabin-images` | `true` | `NULL` | `NULL` |

Authenticated PERMISSIVE bucket-scoped Storage policies exist for SELECT, INSERT, UPDATE, and DELETE on both buckets. Their verified baseline predicate shape is the pure bucket condition: SELECT/DELETE use `USING (bucket_id = '<bucket>'::text)` with `WITH CHECK = NULL`; INSERT uses `USING = NULL` with `WITH CHECK (bucket_id = '<bucket>'::text)`; and UPDATE uses `USING (bucket_id = '<bucket>'::text)` with `WITH CHECK = NULL`. This exact baseline shape is important because the forward migration must not remove ownership-scoped or otherwise restrictive policies.

The following global Storage policy was also observed and is intended for removal by the proposed migration:

```text
role: public
command: INSERT
WITH CHECK (true)
```

It is PERMISSIVE and has no bucket restriction. Bucket public/private state and file-size/MIME restrictions are deliberately unchanged in Phase 0.5 because the application currently stores public object URLs; file restrictions remain Phase 4 work.

### Hosted schema baseline

The operational tables have these verified key relationships:

| Table | Primary key | Foreign keys |
| --- | --- | --- |
| `bookings` | `id` | `cabinId` → `cabins.id`; `guestId` → `guests.id` |
| `cabins` | `id` | None recorded in this baseline |
| `guests` | `id` | None recorded in this baseline |
| `settings` | `id` | None recorded in this baseline |

None of these operational tables has a user/account ownership column. The forward migration therefore keeps the approved shared-operations model and does not invent row ownership semantics.

### Prepared migration

The first forward migration is `supabase/migrations/20260906000000_phase_0_5_security_boundary.sql`. Before application, it was manually reviewed as a proposal. Its `cabin-images` target is authenticated SELECT, INSERT, and DELETE, all scoped to that bucket; UPDATE is not retained.

## Verified Phase 0.5 post-change state

### Auth and product boundary

- The human disabled `Allow new users to sign up` and raised the minimum password length from 6 to 8.
- Confirm email remains enabled; anonymous sign-in and manual linking remain disabled; secure email change remains enabled; secure password change and require-current-password-on-update remain disabled; no password-complexity requirement is configured.
- Bucket public/private state and Site URL/redirect configuration were not changed. The canonical deployment/Auth redirect URL remains unresolved.
- The product model remains: unauthenticated users have no operations-data access, while authenticated users are trusted, equal operations users. No admin/staff RBAC, custom claims, or browser service-role code was added.
- Public signup was tested through the Auth API from an unauthenticated browser client and was rejected with HTTP 422, `Signups not allowed for this instance`.

### Manual migration application

The human manually reviewed and applied `supabase/migrations/20260906000000_phase_0_5_security_boundary.sql` through Supabase SQL Editor. The editor reported `Success. No rows returned`.

This was not a Supabase CLI deployment. Supabase CLI migration history has not been reconciled or verified; if CLI-managed deployment is adopted later, reconcile hosted migration history before relying on `supabase db push`.

### Database RLS and grants

The human re-queried `pg_policies` and `information_schema.role_table_grants` after application.

| Table | Verified authenticated PERMISSIVE policies | Authenticated grants |
| --- | --- | --- |
| `bookings` | SELECT `USING (true)`; UPDATE `USING (true) WITH CHECK (true)`; DELETE `USING (true)`; no INSERT | SELECT, UPDATE, DELETE |
| `cabins` | SELECT `USING (true)`; INSERT `WITH CHECK (true)`; UPDATE `USING (true) WITH CHECK (true)`; DELETE `USING (true)` | SELECT, INSERT, UPDATE, DELETE |
| `guests` | SELECT `USING (true)` only | SELECT |
| `settings` | SELECT `USING (id = 1)`; UPDATE `USING (id = 1) WITH CHECK (id = 1)`; no INSERT/DELETE | SELECT, UPDATE |

`anon` has no table privileges on these four tables. No browser-role TRIGGER, TRUNCATE, or REFERENCES privileges remain.

### Storage and buckets

Verified application policies on `storage.objects` are:

- `avatars`: `phase_0_5_avatars_insert`, a PERMISSIVE authenticated INSERT policy requiring `bucket_id = 'avatars'` and the existing `avatar-{auth.uid()}-...` filename scheme. No application UPDATE or DELETE policy remains.
- `cabin-images`: authenticated `phase_0_5_cabin_images_select`, `phase_0_5_cabin_images_insert`, and `phase_0_5_cabin_images_delete`, each scoped to `bucket_id = 'cabin-images'`. No UPDATE policy remains.
- The prior unrestricted global `public INSERT WITH CHECK (true)` policy is absent.

Both buckets remain public with `file_size_limit = NULL` and `allowed_mime_types = NULL`. File-size and MIME restrictions remain deferred to Phase 4.

### Human behavioural verification summary

- Anonymous database access was denied: `SET LOCAL ROLE anon` followed by a `bookings` SELECT failed with `permission denied for table bookings`.
- The first anonymous Storage attempt was inconclusive because a one-character typo in the ignored local Supabase URL produced `ERR_NAME_NOT_RESOLVED`. After correcting that local value and restarting Vite, anonymous `cabin-images` upload reached Supabase and failed with HTTP 400, `data: null`, and `new row violates row-level security policy`.
- An authorised, administrator-provisioned operator successfully logged in and loaded Dashboard, Bookings, Cabins, and Settings without authorization errors. Zero Last-7-Days results reflected the dataset period, not an access failure.
- Breakfast price changed from 15 to 16, persisted after refresh, then was restored to 15 and persisted.
- Authenticated `cabin-images` upload returned `error: null`; subsequent client removal returned one deleted object with `error: null`. No test object was left behind. This verifies the SELECT-plus-DELETE requirement for `remove()` and the failed-database-write cleanup path.
- An avatar upload under an incorrect user-ID filename was rejected with HTTP 400, `data: null`, and `new row violates row-level security policy`; the Account page’s application-generated avatar filename uploaded and rendered successfully.

No credentials, test email addresses, user IDs, or user identities are recorded in this document.
