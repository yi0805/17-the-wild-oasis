-- Task 043: durable retry queue for future failed owned-cabin-image cleanup.
-- Apply manually through the Supabase SQL Editor only after review/merge. Hosted
-- Supabase CLI migration history remains unreconciled, so do not use db push.

BEGIN;

CREATE TABLE public.cabin_image_cleanup_queue (
  object_name text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  attempt_count integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz NULL,
  last_error text NULL,
  CONSTRAINT cabin_image_cleanup_queue_attempt_count_nonnegative
    CHECK (attempt_count >= 0),
  CONSTRAINT cabin_image_cleanup_queue_owned_name
    CHECK (
      object_name ~ '^cabin-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$'
    )
);

REVOKE ALL PRIVILEGES ON TABLE public.cabin_image_cleanup_queue FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.cabin_image_cleanup_queue FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.cabin_image_cleanup_queue FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.cabin_image_cleanup_queue TO authenticated;

ALTER TABLE public.cabin_image_cleanup_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_043_cabin_image_cleanup_queue_select"
  ON public.cabin_image_cleanup_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "task_043_cabin_image_cleanup_queue_insert"
  ON public.cabin_image_cleanup_queue FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "task_043_cabin_image_cleanup_queue_update"
  ON public.cabin_image_cleanup_queue FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "task_043_cabin_image_cleanup_queue_delete"
  ON public.cabin_image_cleanup_queue FOR DELETE TO authenticated USING (true);

COMMIT;
