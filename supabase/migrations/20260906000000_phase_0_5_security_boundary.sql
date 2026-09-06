-- Phase 0.5 forward-only security boundary. DO NOT apply before review.
--
-- Browser account creation has been removed, and public signup will be disabled
-- manually in Supabase Auth. Together, those changes ensure that membership in
-- the authenticated role is provisioned through controlled administration.
-- Authenticated users are trusted operations users and share hotel data; this
-- migration deliberately does not add application-specific roles or ownership.

BEGIN;

-- Remove unused browser-role privileges before granting only the operations
-- required by the current frontend. RLS remains the row-access boundary.
REVOKE ALL PRIVILEGES ON TABLE public.bookings, public.cabins, public.guests, public.settings FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.bookings, public.cabins, public.guests, public.settings FROM authenticated;

GRANT SELECT, UPDATE, DELETE ON TABLE public.bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.cabins TO authenticated;
GRANT SELECT ON TABLE public.guests TO authenticated;
GRANT SELECT, UPDATE ON TABLE public.settings TO authenticated;

-- Replace only the verified PERMISSIVE authenticated allow-all baseline
-- policies. Matching role, command, and both predicate slots avoids relying on
-- Dashboard display names and leaves restrictive policies untouched.
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT namespace_name.nspname, table_name.relname, policy.polname
    FROM pg_policy AS policy
    JOIN pg_class AS table_name ON table_name.oid = policy.polrelid
    JOIN pg_namespace AS namespace_name ON namespace_name.oid = table_name.relnamespace
    WHERE namespace_name.nspname = 'public'
      AND table_name.relname IN ('bookings', 'cabins', 'guests', 'settings')
      AND policy.polpermissive
      AND policy.polroles = ARRAY[(SELECT oid FROM pg_roles WHERE rolname = 'authenticated')]
      AND (
        (
          policy.polcmd = 'r'
          AND pg_get_expr(policy.polqual, policy.polrelid) = 'true'
          AND policy.polwithcheck IS NULL
        )
        OR (
          policy.polcmd = 'a'
          AND policy.polqual IS NULL
          AND pg_get_expr(policy.polwithcheck, policy.polrelid) = 'true'
        )
        OR (
          policy.polcmd = 'w'
          AND pg_get_expr(policy.polqual, policy.polrelid) = 'true'
          AND pg_get_expr(policy.polwithcheck, policy.polrelid) = 'true'
        )
        OR (
          policy.polcmd = 'd'
          AND pg_get_expr(policy.polqual, policy.polrelid) = 'true'
          AND policy.polwithcheck IS NULL
        )
      )
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      policy_record.polname,
      policy_record.nspname,
      policy_record.relname
    );
  END LOOP;
END
$$;

DROP POLICY IF EXISTS "phase_0_5_bookings_select" ON public.bookings;
DROP POLICY IF EXISTS "phase_0_5_bookings_update" ON public.bookings;
DROP POLICY IF EXISTS "phase_0_5_bookings_delete" ON public.bookings;
DROP POLICY IF EXISTS "phase_0_5_cabins_select" ON public.cabins;
DROP POLICY IF EXISTS "phase_0_5_cabins_insert" ON public.cabins;
DROP POLICY IF EXISTS "phase_0_5_cabins_update" ON public.cabins;
DROP POLICY IF EXISTS "phase_0_5_cabins_delete" ON public.cabins;
DROP POLICY IF EXISTS "phase_0_5_guests_select" ON public.guests;
DROP POLICY IF EXISTS "phase_0_5_settings_select" ON public.settings;
DROP POLICY IF EXISTS "phase_0_5_settings_update" ON public.settings;

CREATE POLICY "phase_0_5_bookings_select"
  ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "phase_0_5_bookings_update"
  ON public.bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "phase_0_5_bookings_delete"
  ON public.bookings FOR DELETE TO authenticated USING (true);

CREATE POLICY "phase_0_5_cabins_select"
  ON public.cabins FOR SELECT TO authenticated USING (true);
CREATE POLICY "phase_0_5_cabins_insert"
  ON public.cabins FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "phase_0_5_cabins_update"
  ON public.cabins FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "phase_0_5_cabins_delete"
  ON public.cabins FOR DELETE TO authenticated USING (true);

CREATE POLICY "phase_0_5_guests_select"
  ON public.guests FOR SELECT TO authenticated USING (true);

CREATE POLICY "phase_0_5_settings_select"
  ON public.settings FOR SELECT TO authenticated USING (id = 1);
CREATE POLICY "phase_0_5_settings_update"
  ON public.settings FOR UPDATE TO authenticated USING (id = 1) WITH CHECK (id = 1);

-- Remove only the verified PERMISSIVE global, unrestricted public INSERT
-- policy on storage.objects. The structural match is independent of its display
-- name and cannot remove a bucket-scoped or more restrictive policy.
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policy.polname
    FROM pg_policy AS policy
    JOIN pg_class AS table_name ON table_name.oid = policy.polrelid
    JOIN pg_namespace AS namespace_name ON namespace_name.oid = table_name.relnamespace
    WHERE namespace_name.nspname = 'storage'
      AND table_name.relname = 'objects'
      AND policy.polpermissive
      AND policy.polroles = ARRAY[0::oid]
      AND policy.polcmd = 'a'
      AND policy.polqual IS NULL
      AND pg_get_expr(policy.polwithcheck, policy.polrelid) = 'true'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.polname);
  END LOOP;
END
$$;

-- Replace only the verified PERMISSIVE authenticated bucket policies. Each
-- candidate must have the exact baseline role, command, and pure single-bucket
-- predicate shape. Ownership-scoped, restrictive, global, and unrelated-bucket
-- policies cannot match. Cabin images stay shared assets; avatar uploads are
-- self-scoped.
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policy.polname
    FROM pg_policy AS policy
    JOIN pg_class AS table_name ON table_name.oid = policy.polrelid
    JOIN pg_namespace AS namespace_name ON namespace_name.oid = table_name.relnamespace
    CROSS JOIN (
      VALUES
        ('r'::"char", '(bucket_id = ''avatars''::text)', NULL::text),
        ('a'::"char", NULL::text, '(bucket_id = ''avatars''::text)'),
        ('w'::"char", '(bucket_id = ''avatars''::text)', NULL::text),
        ('d'::"char", '(bucket_id = ''avatars''::text)', NULL::text),
        ('r'::"char", '(bucket_id = ''cabin-images''::text)', NULL::text),
        ('a'::"char", NULL::text, '(bucket_id = ''cabin-images''::text)'),
        ('w'::"char", '(bucket_id = ''cabin-images''::text)', NULL::text),
        ('d'::"char", '(bucket_id = ''cabin-images''::text)', NULL::text)
    ) AS baseline(expected_command, expected_qual, expected_with_check)
    WHERE namespace_name.nspname = 'storage'
      AND table_name.relname = 'objects'
      AND policy.polpermissive
      AND policy.polroles = ARRAY[(SELECT oid FROM pg_roles WHERE rolname = 'authenticated')]
      AND policy.polcmd = baseline.expected_command
      AND pg_get_expr(policy.polqual, policy.polrelid) IS NOT DISTINCT FROM baseline.expected_qual
      AND pg_get_expr(policy.polwithcheck, policy.polrelid) IS NOT DISTINCT FROM baseline.expected_with_check
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.polname);
  END LOOP;
END
$$;

DROP POLICY IF EXISTS "phase_0_5_avatars_insert" ON storage.objects;
DROP POLICY IF EXISTS "phase_0_5_cabin_images_select" ON storage.objects;
DROP POLICY IF EXISTS "phase_0_5_cabin_images_insert" ON storage.objects;
DROP POLICY IF EXISTS "phase_0_5_cabin_images_delete" ON storage.objects;

-- Avatar filenames are generated as avatar-{currentUserId}-{random}; the
-- authenticated uploader may create only an object matching their own ID.
CREATE POLICY "phase_0_5_avatars_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND name LIKE ('avatar-' || auth.uid()::text || '-%')
  );

-- Cabin images are shared operational assets. The frontend needs SELECT and
-- DELETE together to preserve the verified failed-database-write cleanup path,
-- plus INSERT for the upload that precedes that write.
CREATE POLICY "phase_0_5_cabin_images_select"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'cabin-images');
CREATE POLICY "phase_0_5_cabin_images_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cabin-images');
CREATE POLICY "phase_0_5_cabin_images_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cabin-images');

COMMIT;
