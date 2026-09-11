-- Task 042: match browser/service image validation at the Storage boundary.
-- Apply manually through the Supabase SQL Editor only after review/merge. Hosted
-- Supabase CLI migration history remains unreconciled, so do not use db push.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
    RAISE EXCEPTION 'Expected Storage bucket "avatars" does not exist';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'cabin-images') THEN
    RAISE EXCEPTION 'Expected Storage bucket "cabin-images" does not exist';
  END IF;
END $$;

UPDATE storage.buckets
SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
WHERE id IN ('avatars', 'cabin-images');

COMMIT;
