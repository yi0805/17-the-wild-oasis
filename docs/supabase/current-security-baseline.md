# Current Supabase Security Baseline

## Purpose and scope

This document records the hosted Supabase baseline observed during Phase 0.5 on 2026-09-06. It is evidence for reviewing the first forward-only security migration; it is **not** a fabricated historical migration.

No secrets, user identities, user rows, application rows, passwords, tokens, or production data are included here.

## Auth baseline

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

No real user identities are recorded. Public signup will be disabled manually in the Supabase Dashboard after review; operations accounts will then be provisioned outside this browser application through controlled Supabase administration.

## Application authorization model

No distinct role model is represented in the current frontend repository.

Protected routes distinguish only authenticated and unauthenticated users. The approved product model is:

```text
Unauthenticated
→ no operations-data access

Authenticated
→ trusted operations user
→ all operators share the hotel's operational data
```

## Public-table RLS baseline

RLS is enabled on `bookings`, `cabins`, `guests`, and `settings`. No `anon` RLS policies were observed on these tables.

| Table | Authenticated policies observed |
| --- | --- |
| `bookings` | SELECT `USING (true)`; INSERT `WITH CHECK (true)`; UPDATE `USING (true) WITH CHECK (true)`; DELETE `USING (true)` |
| `cabins` | SELECT `USING (true)`; INSERT `WITH CHECK (true)`; UPDATE `USING (true) WITH CHECK (true)`; DELETE `USING (true)` |
| `guests` | SELECT `USING (true)`; INSERT `WITH CHECK (true)`; UPDATE `USING (true) WITH CHECK (true)`; DELETE `USING (true)` |
| `settings` | SELECT `USING (true)`; UPDATE `USING (true) WITH CHECK (true)` |

Both `anon` and `authenticated` currently have broad table-level grants, including SELECT, INSERT, UPDATE, DELETE, and privileges such as TRIGGER, TRUNCATE, and REFERENCES. RLS currently blocks anonymous row access despite those grants, but the grants are broader than the application requires.

## Storage baseline

| Bucket | Public | File-size limit | Allowed MIME types |
| --- | --- | --- | --- |
| `avatars` | `true` | `NULL` | `NULL` |
| `cabin-images` | `true` | `NULL` | `NULL` |

Authenticated bucket-scoped Storage policies exist for SELECT, INSERT, UPDATE, and DELETE on both buckets.

The following global Storage policy was also observed and is intended for removal by the proposed migration:

```text
role: public
command: INSERT
WITH CHECK (true)
```

It has no bucket restriction. Bucket public/private state and file-size/MIME restrictions are deliberately unchanged in Phase 0.5 because the application currently stores public object URLs; file restrictions remain Phase 4 work.

## Hosted schema baseline

The operational tables have these verified key relationships:

| Table | Primary key | Foreign keys |
| --- | --- | --- |
| `bookings` | `id` | `cabinId` → `cabins.id`; `guestId` → `guests.id` |
| `cabins` | `id` | None recorded in this baseline |
| `guests` | `id` | None recorded in this baseline |
| `settings` | `id` | None recorded in this baseline |

None of these operational tables has a user/account ownership column. The forward migration therefore keeps the approved shared-operations model and does not invent row ownership semantics.

## Proposed follow-up

The first migration is [20260906000000_phase_0_5_security_boundary.sql](/E:/reactPractise/17-the-wild-oasis/supabase/migrations/20260906000000_phase_0_5_security_boundary.sql). It remains unapplied pending ChatGPT/human review, the manual Auth Dashboard changes, and anonymous/authenticated verification.
