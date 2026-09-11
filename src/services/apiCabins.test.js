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
import { MAX_IMAGE_FILE_SIZE } from "../utils/imageUpload";

const SUPABASE_URL = "https://project.supabase.co";
const UUID = "550e8400-e29b-41d4-a716-446655440000";

function createImageFile(name = "cabin.png", type = "image/png") {
  return new File(["cabin image"], name, { type });
}

function createOversizedImageFile() {
  const image = createImageFile();
  Object.defineProperty(image, "size", { value: MAX_IMAGE_FILE_SIZE + 1 });
  return image;
}

describe("createEditCabin", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(crypto, "randomUUID").mockReturnValue(UUID);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects an unsupported new cabin image before Storage or database work", async () => {
    const image = new File(["not an image"], "cabin.gif", {
      type: "image/gif",
    });

    await expect(
      createEditCabin({ name: "Forest Cabin", image }),
    ).rejects.toThrow("Use a JPEG, PNG, or WebP image.");

    expect(supabaseMock.storage.from).not.toHaveBeenCalled();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("rejects an oversized new cabin image before Storage or database work", async () => {
    await expect(
      createEditCabin({ name: "Forest Cabin", image: createOversizedImageFile() }),
    ).rejects.toThrow("Image must be 5 MB or smaller.");

    expect(supabaseMock.storage.from).not.toHaveBeenCalled();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("does not mutate a cabin when a new image upload fails", async () => {
    const upload = vi.fn().mockResolvedValue({
      error: { message: "Storage upload failed" },
    });
    const remove = vi.fn();
    supabaseMock.storage.from.mockReturnValue({ upload, remove });
    await expect(
      createEditCabin({ name: "Forest Cabin", image: createImageFile("forest.png") }),
    ).rejects.toThrow("Cabin image could not be uploaded");

    expect(supabaseMock.storage.from).toHaveBeenCalledWith("cabin-images");
    expect(upload).toHaveBeenCalledWith(
      `cabin-${UUID}.png`,
      expect.any(File),
    );
    expect(supabaseMock.from).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it("removes a newly uploaded image when creating the cabin fails", async () => {
    const image = createImageFile("new-cabin.png");
    const imageName = `cabin-${UUID}.png`;
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
    const image = createImageFile("updated-cabin.png");
    const imageName = `cabin-${UUID}.png`;
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

  it("updates a cabin with an existing string image without storage work", async () => {
    const existingImage = "https://images.example.com/forest.png";
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
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("returns the created cabin after a successful new-image mutation", async () => {
    const image = createImageFile("created-cabin.png");
    const imageName = `cabin-${UUID}.png`;
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
    await expect(createEditCabin(newCabin)).resolves.toEqual(createdCabin);

    expect(upload).toHaveBeenCalledWith(imageName, image);
    expect(insert).toHaveBeenCalledWith([{ ...newCabin, image: imagePath }]);
    expect(remove).not.toHaveBeenCalled();
  });

  it("uses a MIME-derived .jpg name without the original filename", async () => {
    const image = createImageFile("forest-photo.png", "image/jpeg");
    const imageName = `cabin-${UUID}.jpg`;
    const upload = vi.fn().mockResolvedValue({ error: null });
    const remove = vi.fn();
    const single = vi.fn().mockResolvedValue({ data: { id: 9 }, error: null });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    supabaseMock.storage.from.mockReturnValue({ upload, remove });
    supabaseMock.from.mockReturnValue({ insert });

    await createEditCabin({ name: "JPEG Cabin", image });

    expect(upload).toHaveBeenCalledWith(imageName, image);
    expect(imageName).not.toContain(image.name);
    expect(insert).toHaveBeenCalledWith([
      {
        name: "JPEG Cabin",
        image: `${SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`,
      },
    ]);
  });

  it("uses a MIME-derived .webp name without the original filename", async () => {
    const image = createImageFile("forest-photo.jpeg", "image/webp");
    const imageName = `cabin-${UUID}.webp`;
    const upload = vi.fn().mockResolvedValue({ error: null });
    const remove = vi.fn();
    const single = vi.fn().mockResolvedValue({ data: { id: 10 }, error: null });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    supabaseMock.storage.from.mockReturnValue({ upload, remove });
    supabaseMock.from.mockReturnValue({ insert });

    await createEditCabin({ name: "WebP Cabin", image });

    expect(upload).toHaveBeenCalledWith(imageName, image);
    expect(imageName).not.toContain(image.name);
  });

  it("keeps a successfully updated cabin image and does not remove an old object", async () => {
    const image = createImageFile("replacement.png");
    const imageName = `cabin-${UUID}.png`;
    const upload = vi.fn().mockResolvedValue({ error: null });
    const remove = vi.fn();
    const single = vi.fn().mockResolvedValue({ data: { id: 7 }, error: null });
    const select = vi.fn(() => ({ single }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    supabaseMock.storage.from.mockReturnValue({ upload, remove });
    supabaseMock.from.mockReturnValue({ update });

    await expect(
      createEditCabin({ name: "Updated Forest Cabin", image }, 7),
    ).resolves.toEqual({ id: 7 });

    expect(upload).toHaveBeenCalledWith(imageName, image);
    expect(update).toHaveBeenCalledWith({
      name: "Updated Forest Cabin",
      image: `${SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`,
    });
    expect(remove).not.toHaveBeenCalled();
  });
});
