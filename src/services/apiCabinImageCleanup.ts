import supabase, { supabaseUrl } from "./supabase";
import type { Tables, TablesInsert, TablesUpdate } from "../types/database.types";
import { getOwnedCabinImageObjectName } from "../utils/cabinImage";

type CleanupQueueItem = Tables<"cabin_image_cleanup_queue">;
type CleanupQueueInsert = TablesInsert<"cabin_image_cleanup_queue">;
type CleanupQueueUpdate = TablesUpdate<"cabin_image_cleanup_queue">;

export const CABIN_IMAGE_CLEANUP_BATCH_SIZE = 10;

function getSupabaseClient() {
  if (!supabase) throw new Error("Supabase client is unavailable");
  return supabase;
}

function getCabinImageUrl(objectName: string) {
  return `${supabaseUrl}/storage/v1/object/public/cabin-images/${objectName}`;
}

function getCleanupErrorMessage(error: { message?: string } | null) {
  return error?.message?.slice(0, 500) || "Cabin image cleanup failed";
}

async function hasCabinImageReference(imageUrl: string) {
  const { data, error } = await getSupabaseClient()
    .from("cabins")
    .select("id")
    .eq("image", imageUrl);

  if (error) throw error;

  return (data?.length ?? 0) > 0;
}

async function ensureCleanupQueueEntry(objectName: string) {
  const queueItem: CleanupQueueInsert = { object_name: objectName };
  const { error } = await getSupabaseClient()
    .from("cabin_image_cleanup_queue")
    .upsert(queueItem, {
      onConflict: "object_name",
      ignoreDuplicates: true,
    });

  if (error) throw error;
}

async function getCleanupQueueEntry(objectName: string) {
  const { data, error } = await getSupabaseClient()
    .from("cabin_image_cleanup_queue")
    .select("*")
    .eq("object_name", objectName)
    .maybeSingle();

  if (error || !data) throw error ?? new Error("Cleanup queue item is unavailable");

  return data;
}

async function deleteCleanupQueueEntry(objectName: string) {
  const { error } = await getSupabaseClient()
    .from("cabin_image_cleanup_queue")
    .delete()
    .eq("object_name", objectName);

  if (error) throw error;
}

async function recordFailedCleanupAttempt(
  queueItem: CleanupQueueItem,
  storageError: { message?: string } | null,
) {
  const update: CleanupQueueUpdate = {
    attempt_count: queueItem.attempt_count + 1,
    last_attempt_at: new Date().toISOString(),
    last_error: getCleanupErrorMessage(storageError),
  };
  const { error } = await getSupabaseClient()
    .from("cabin_image_cleanup_queue")
    .update(update)
    .eq("object_name", queueItem.object_name);

  if (error) throw error;
}

async function attemptQueuedCleanup(queueItem: CleanupQueueItem) {
  const imageUrl = getCabinImageUrl(queueItem.object_name);
  const ownedObjectName = getOwnedCabinImageObjectName(imageUrl, supabaseUrl);
  if (ownedObjectName !== queueItem.object_name) {
    console.error("Cabin image cleanup queue item is not canonical", queueItem.object_name);
    return;
  }

  try {
    if (await hasCabinImageReference(imageUrl)) return;
  } catch (error) {
    console.error("Cabin image cleanup final reference check failed", error);
    return;
  }

  const { error: storageError } = await getSupabaseClient().storage
    .from("cabin-images")
    .remove([queueItem.object_name]);

  if (!storageError) {
    try {
      await deleteCleanupQueueEntry(queueItem.object_name);
    } catch (error) {
      console.error("Cabin image cleanup queue removal failed", error);
    }
    return;
  }

  try {
    await recordFailedCleanupAttempt(queueItem, storageError);
  } catch (error) {
    console.error("Cabin image cleanup retry metadata update failed", error);
  }
}

export async function cleanupReplacedCabinImage(previousImageUrl: string) {
  const objectName = getOwnedCabinImageObjectName(previousImageUrl, supabaseUrl);
  if (!objectName) return;

  try {
    if (await hasCabinImageReference(previousImageUrl)) return;
  } catch (error) {
    console.error("Cabin image cleanup reference check failed", error);
    return;
  }

  try {
    await ensureCleanupQueueEntry(objectName);
    const queueItem = await getCleanupQueueEntry(objectName);
    await attemptQueuedCleanup(queueItem);
  } catch (error) {
    console.error("Cabin image cleanup queue preparation failed", error);
  }
}

export async function retryCabinImageCleanup() {
  let queueItems: CleanupQueueItem[] | null;
  let queueError: unknown;

  try {
    const { data, error } = await getSupabaseClient()
      .from("cabin_image_cleanup_queue")
      .select("*")
      .limit(CABIN_IMAGE_CLEANUP_BATCH_SIZE);
    queueItems = data;
    queueError = error;
  } catch (error) {
    console.error("Cabin image cleanup queue could not be loaded", error);
    return;
  }

  if (queueError) {
    console.error("Cabin image cleanup queue could not be loaded", queueError);
    return;
  }

  for (const queueItem of queueItems ?? []) {
    try {
      await attemptQueuedCleanup(queueItem);
    } catch (itemError) {
      console.error("Cabin image cleanup retry item failed", itemError);
    }
  }
}
