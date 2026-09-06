import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { supabaseMock, supabaseUrl } = vi.hoisted(() => ({
  supabaseUrl: "https://project.supabase.co",
  supabaseMock: {
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  },
}));

vi.mock("./supabase", () => ({
  default: supabaseMock,
  supabaseUrl,
}));

import { createEditCabin } from "./apiCabins";

const SUPABASE_URL = "https://project.supabase.co";

describe("createEditCabin", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not mutate a cabin when a new image upload fails", async () => {
    const upload = vi.fn().mockResolvedValue({
      error: { message: "Storage upload failed" },
    });
    const remove = vi.fn();
    supabaseMock.storage.from.mockReturnValue({ upload, remove });
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    await expect(
      createEditCabin({ name: "Forest Cabin", image: { name: "forest.png" } }),
    ).rejects.toThrow("Cabin image could not be uploaded");

    expect(supabaseMock.storage.from).toHaveBeenCalledWith("cabin-images");
    expect(upload).toHaveBeenCalledWith("0.5-forest.png", {
      name: "forest.png",
    });
    expect(supabaseMock.from).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it("removes a newly uploaded image when creating the cabin fails", async () => {
    const image = { name: "new-cabin.png" };
    const imageName = "0.12345-new-cabin.png";
    const imagePath = `${SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;
    const newCabin = { name: "Forest Cabin", image };
    const upload = vi.fn().mockResolvedValue({ error: null });
    const remove = vi.fn().mockResolvedValue({ error: null });
    const single = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Database insert failed" },
    });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    supabaseMock.storage.from.mockReturnValue({ upload, remove });
    supabaseMock.from.mockReturnValue({ insert });
    vi.spyOn(Math, "random").mockReturnValue(0.12345);

    await expect(createEditCabin(newCabin)).rejects.toThrow(
      "Cabin could not be saved",
    );

    expect(upload).toHaveBeenCalledWith(imageName, image);
    expect(insert).toHaveBeenCalledWith([{ ...newCabin, image: imagePath }]);
    expect(remove).toHaveBeenCalledWith([imageName]);
    expect(supabaseMock.storage.from).toHaveBeenCalledTimes(2);
    expect(supabaseMock.storage.from).toHaveBeenNthCalledWith(
      1,
      "cabin-images",
    );
    expect(supabaseMock.storage.from).toHaveBeenNthCalledWith(
      2,
      "cabin-images",
    );
  });

  it("removes a newly uploaded image when editing the cabin fails", async () => {
    const image = { name: "updated-cabin.png" };
    const imageName = "0.23456-updated-cabin.png";
    const imagePath = `${SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;
    const newCabin = { name: "Updated Forest Cabin", image };
    const upload = vi.fn().mockResolvedValue({ error: null });
    const remove = vi.fn().mockResolvedValue({ error: null });
    const single = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Database update failed" },
    });
    const select = vi.fn(() => ({ single }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    supabaseMock.storage.from.mockReturnValue({ upload, remove });
    supabaseMock.from.mockReturnValue({ update });
    vi.spyOn(Math, "random").mockReturnValue(0.23456);

    await expect(createEditCabin(newCabin, 7)).rejects.toThrow(
      "Cabin could not be saved",
    );

    expect(update).toHaveBeenCalledWith({ ...newCabin, image: imagePath });
    expect(eq).toHaveBeenCalledWith("id", 7);
    expect(remove).toHaveBeenCalledWith([imageName]);
    expect(upload.mock.invocationCallOrder[0]).toBeLessThan(
      update.mock.invocationCallOrder[0],
    );
  });

  it("updates a cabin with an existing application image without storage work", async () => {
    const existingImage = `${SUPABASE_URL}/storage/v1/object/public/cabin-images/existing.png`;
    const newCabin = { name: "Forest Cabin", image: existingImage };
    const updatedCabin = { id: 7, ...newCabin };
    const single = vi.fn().mockResolvedValue({
      data: updatedCabin,
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    supabaseMock.from.mockReturnValue({ update });

    await expect(createEditCabin(newCabin, 7)).resolves.toEqual(updatedCabin);

    expect(update).toHaveBeenCalledWith(newCabin);
    expect(eq).toHaveBeenCalledWith("id", 7);
    expect(supabaseMock.storage.from).not.toHaveBeenCalled();
  });

  it("returns the created cabin after a successful new-image mutation", async () => {
    const image = { name: "created-cabin.png" };
    const imageName = "0.34567-created-cabin.png";
    const imagePath = `${SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;
    const newCabin = { name: "New Cabin", image };
    const createdCabin = { id: 8, ...newCabin, image: imagePath };
    const upload = vi.fn().mockResolvedValue({ error: null });
    const remove = vi.fn();
    const single = vi.fn().mockResolvedValue({
      data: createdCabin,
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    supabaseMock.storage.from.mockReturnValue({ upload, remove });
    supabaseMock.from.mockReturnValue({ insert });
    vi.spyOn(Math, "random").mockReturnValue(0.34567);

    await expect(createEditCabin(newCabin)).resolves.toEqual(createdCabin);

    expect(upload).toHaveBeenCalledWith(imageName, image);
    expect(insert).toHaveBeenCalledWith([{ ...newCabin, image: imagePath }]);
    expect(remove).not.toHaveBeenCalled();
  });
});
