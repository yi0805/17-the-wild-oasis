import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { supabaseMock, supabaseUrl } = vi.hoisted(() => ({
  supabaseUrl: "https://project.supabase.co",
  supabaseMock: {
    from: vi.fn(),
    storage: { from: vi.fn() },
  },
}));

vi.mock("./supabase", () => ({ default: supabaseMock, supabaseUrl }));

import {
  CABIN_IMAGE_CLEANUP_BATCH_SIZE,
  cleanupReplacedCabinImage,
  retryCabinImageCleanup,
} from "./apiCabinImageCleanup";

const UUID = "550e8400-e29b-41d4-a716-446655440000";
const OLD_OBJECT = `cabin-${UUID}.png`;
const OLD_IMAGE_URL = `${supabaseUrl}/storage/v1/object/public/cabin-images/${OLD_OBJECT}`;

function queueItem(objectName = OLD_OBJECT, attemptCount = 0) {
  return {
    object_name: objectName,
    attempt_count: attemptCount,
    created_at: "2026-09-11T00:00:00.000Z",
    last_attempt_at: null,
    last_error: null,
  };
}

function cabinReferenceQuery(
  data: Array<{ id: number }> = [],
  error: { message: string } | null = null,
) {
  const eq = vi.fn().mockResolvedValue({ data, error });
  return { select: vi.fn(() => ({ eq })), eq };
}

function queueEntryQuery(item = queueItem()) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: item, error: null });
  const eq = vi.fn(() => ({ maybeSingle }));
  return { select: vi.fn(() => ({ eq })), eq, maybeSingle };
}

function queueDeleteQuery() {
  const eq = vi.fn().mockResolvedValue({ error: null });
  return { delete: vi.fn(() => ({ eq })), eq };
}

function queueUpdateQuery() {
  const eq = vi.fn().mockResolvedValue({ error: null });
  return { update: vi.fn(() => ({ eq })), eq };
}

describe("cabin image cleanup", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not queue or remove a non-owned previous image", async () => {
    const remove = vi.fn();
    supabaseMock.storage.from.mockReturnValue({ remove });

    await cleanupReplacedCabinImage("https://images.example.com/legacy-cabin.png");

    expect(supabaseMock.from).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it("keeps a shared owned image when another cabin still references it", async () => {
    const references = cabinReferenceQuery([{ id: 2 }]);
    const remove = vi.fn();
    supabaseMock.from.mockReturnValue(references);
    supabaseMock.storage.from.mockReturnValue({ remove });

    await cleanupReplacedCabinImage(OLD_IMAGE_URL);

    expect(references.eq).toHaveBeenCalledWith("image", OLD_IMAGE_URL);
    expect(remove).not.toHaveBeenCalled();
    expect(supabaseMock.from).toHaveBeenCalledTimes(1);
  });

  it("queues an unreferenced owned image before removing it, then clears the queue", async () => {
    const references = cabinReferenceQuery();
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const queueEntry = queueEntryQuery();
    const queueDelete = queueDeleteQuery();
    const remove = vi.fn().mockResolvedValue({ error: null });
    supabaseMock.from
      .mockReturnValueOnce(references)
      .mockReturnValueOnce({ upsert })
      .mockReturnValueOnce(queueEntry)
      .mockReturnValueOnce(queueDelete);
    supabaseMock.storage.from.mockReturnValue({ remove });

    await cleanupReplacedCabinImage(OLD_IMAGE_URL);

    expect(upsert).toHaveBeenCalledWith(
      { object_name: OLD_OBJECT },
      { onConflict: "object_name", ignoreDuplicates: true },
    );
    expect(remove).toHaveBeenCalledWith([OLD_OBJECT]);
    expect(queueDelete.eq).toHaveBeenCalledWith("object_name", OLD_OBJECT);
    expect(upsert.mock.invocationCallOrder[0]).toBeLessThan(
      remove.mock.invocationCallOrder[0],
    );
  });

  it("keeps a durable queue entry and records metadata after immediate Storage cleanup fails", async () => {
    const references = cabinReferenceQuery();
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const queueEntry = queueEntryQuery(queueItem(OLD_OBJECT, 2));
    const queueUpdate = queueUpdateQuery();
    const remove = vi.fn().mockResolvedValue({ error: { message: "Storage failed" } });
    supabaseMock.from
      .mockReturnValueOnce(references)
      .mockReturnValueOnce({ upsert })
      .mockReturnValueOnce(queueEntry)
      .mockReturnValueOnce(queueUpdate);
    supabaseMock.storage.from.mockReturnValue({ remove });

    await expect(cleanupReplacedCabinImage(OLD_IMAGE_URL)).resolves.toBeUndefined();

    expect(queueUpdate.update).toHaveBeenCalledWith({
      attempt_count: 3,
      last_attempt_at: expect.any(String),
      last_error: "Storage failed",
    });
    expect(queueUpdate.eq).toHaveBeenCalledWith("object_name", OLD_OBJECT);
  });

  it("does not delete Storage when durable queue insertion fails", async () => {
    const references = cabinReferenceQuery();
    const upsert = vi.fn().mockResolvedValue({ error: { message: "Queue failed" } });
    const remove = vi.fn();
    supabaseMock.from
      .mockReturnValueOnce(references)
      .mockReturnValueOnce({ upsert });
    supabaseMock.storage.from.mockReturnValue({ remove });

    await expect(cleanupReplacedCabinImage(OLD_IMAGE_URL)).resolves.toBeUndefined();

    expect(remove).not.toHaveBeenCalled();
  });

  it("does not delete Storage when the post-update reference check fails", async () => {
    const references = cabinReferenceQuery([], { message: "Reference read failed" });
    const remove = vi.fn();
    supabaseMock.from.mockReturnValue(references);
    supabaseMock.storage.from.mockReturnValue({ remove });

    await cleanupReplacedCabinImage(OLD_IMAGE_URL);

    expect(remove).not.toHaveBeenCalled();
  });

  it("removes an unreferenced queued item during a bounded retry", async () => {
    const queuedItems = [queueItem()];
    const limit = vi.fn().mockResolvedValue({ data: queuedItems, error: null });
    const references = cabinReferenceQuery();
    const queueDelete = queueDeleteQuery();
    const remove = vi.fn().mockResolvedValue({ error: null });
    supabaseMock.from
      .mockReturnValueOnce({ select: vi.fn(() => ({ limit })) })
      .mockReturnValueOnce(references)
      .mockReturnValueOnce(queueDelete);
    supabaseMock.storage.from.mockReturnValue({ remove });

    await retryCabinImageCleanup();

    expect(limit).toHaveBeenCalledWith(CABIN_IMAGE_CLEANUP_BATCH_SIZE);
    expect(remove).toHaveBeenCalledWith([OLD_OBJECT]);
    expect(queueDelete.eq).toHaveBeenCalledWith("object_name", OLD_OBJECT);
  });

  it("keeps a queued item that is referenced again", async () => {
    const limit = vi.fn().mockResolvedValue({ data: [queueItem()], error: null });
    const references = cabinReferenceQuery([{ id: 3 }]);
    const remove = vi.fn();
    supabaseMock.from
      .mockReturnValueOnce({ select: vi.fn(() => ({ limit })) })
      .mockReturnValueOnce(references);
    supabaseMock.storage.from.mockReturnValue({ remove });

    await retryCabinImageCleanup();

    expect(remove).not.toHaveBeenCalled();
  });

  it("keeps a queued item and increments its failed retry metadata", async () => {
    const limit = vi.fn().mockResolvedValue({ data: [queueItem(OLD_OBJECT, 4)], error: null });
    const references = cabinReferenceQuery();
    const queueUpdate = queueUpdateQuery();
    const remove = vi.fn().mockResolvedValue({ error: { message: "Retry failed" } });
    supabaseMock.from
      .mockReturnValueOnce({ select: vi.fn(() => ({ limit })) })
      .mockReturnValueOnce(references)
      .mockReturnValueOnce(queueUpdate);
    supabaseMock.storage.from.mockReturnValue({ remove });

    await retryCabinImageCleanup();

    expect(queueUpdate.update).toHaveBeenCalledWith({
      attempt_count: 5,
      last_attempt_at: expect.any(String),
      last_error: "Retry failed",
    });
  });

  it("isolates a failed queued item so a later safe item is removed", async () => {
    const secondObject = "cabin-550e8400-e29b-41d4-a716-846655440000.webp";
    const firstItem = queueItem(OLD_OBJECT);
    const secondItem = queueItem(secondObject);
    const limit = vi.fn().mockResolvedValue({ data: [firstItem, secondItem], error: null });
    const firstReferences = cabinReferenceQuery();
    const firstUpdate = queueUpdateQuery();
    const secondReferences = cabinReferenceQuery();
    const secondDelete = queueDeleteQuery();
    const remove = vi
      .fn()
      .mockResolvedValueOnce({ error: { message: "First failed" } })
      .mockResolvedValueOnce({ error: null });
    supabaseMock.from
      .mockReturnValueOnce({ select: vi.fn(() => ({ limit })) })
      .mockReturnValueOnce(firstReferences)
      .mockReturnValueOnce(firstUpdate)
      .mockReturnValueOnce(secondReferences)
      .mockReturnValueOnce(secondDelete);
    supabaseMock.storage.from.mockReturnValue({ remove });

    await retryCabinImageCleanup();

    expect(remove).toHaveBeenNthCalledWith(1, [OLD_OBJECT]);
    expect(remove).toHaveBeenNthCalledWith(2, [secondObject]);
    expect(secondDelete.eq).toHaveBeenCalledWith("object_name", secondObject);
  });

  it("does not delete any Storage object when the queue cannot be loaded", async () => {
    const limit = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Queue read failed" },
    });
    const remove = vi.fn();
    supabaseMock.from.mockReturnValue({ select: vi.fn(() => ({ limit })) });
    supabaseMock.storage.from.mockReturnValue({ remove });

    await retryCabinImageCleanup();

    expect(remove).not.toHaveBeenCalled();
  });
});
