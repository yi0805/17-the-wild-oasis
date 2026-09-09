-- Task 025 forward-only avatar cleanup policies. Do not apply through the
-- Supabase CLI because hosted migration history has not been reconciled.

BEGIN;

DROP POLICY IF EXISTS "phase_2_5_avatars_select_own" ON storage.objects;
DROP POLICY IF EXISTS "phase_2_5_avatars_delete_own" ON storage.objects;

CREATE POLICY "phase_2_5_avatars_select_own"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'avatars'
    AND name LIKE ('avatar-' || auth.uid()::text || '-%')
  );

CREATE POLICY "phase_2_5_avatars_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND name LIKE ('avatar-' || auth.uid()::text || '-%')
  );

COMMIT;
