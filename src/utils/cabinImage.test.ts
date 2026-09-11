import { describe, expect, it } from "vitest";
import {
  buildCabinImageObjectName,
  getCabinImageExtension,
  getOwnedCabinImageObjectName,
} from "./cabinImage";

const PROJECT_URL = "https://project.supabase.co";
const UUID = "550e8400-e29b-41d4-a716-446655440000";
const PUBLIC_PATH = `${PROJECT_URL}/storage/v1/object/public/cabin-images/`;

describe("cabin image identity", () => {
  it("maps validated MIME types to canonical extensions", () => {
    expect(getCabinImageExtension("image/jpeg")).toBe("jpg");
    expect(getCabinImageExtension("image/png")).toBe("png");
    expect(getCabinImageExtension("image/webp")).toBe("webp");
    expect(getCabinImageExtension("image/gif")).toBeNull();
    expect(buildCabinImageObjectName(UUID, "image/jpeg")).toBe(
      `cabin-${UUID}.jpg`,
    );
  });

  it.each(["jpg", "png", "webp"])(
    "recognizes an exact canonical .%s cabin image URL",
    (extension) => {
      expect(
        getOwnedCabinImageObjectName(
          `${PUBLIC_PATH}cabin-${UUID}.${extension}`,
          PROJECT_URL,
        ),
      ).toBe(`cabin-${UUID}.${extension}`);
    },
  );

  it.each([
    ["external URL", `https://example.com/cabin-${UUID}.png`],
    [
      "wrong project origin",
      `https://other-project.supabase.co/storage/v1/object/public/cabin-images/cabin-${UUID}.png`,
    ],
    [
      "wrong bucket",
      `${PROJECT_URL}/storage/v1/object/public/avatars/cabin-${UUID}.png`,
    ],
    ["legacy object name", `${PUBLIC_PATH}0.5-forest.png`],
    ["fake canonical prefix", `${PUBLIC_PATH}cabin-not-a-uuid.png`],
    ["nested object", `${PUBLIC_PATH}folder/cabin-${UUID}.png`],
    ["encoded nested object", `${PUBLIC_PATH}folder%2Fcabin-${UUID}.png`],
    ["query-path trick", `${PUBLIC_PATH}cabin-${UUID}.png?name=folder/cabin-${UUID}.png`],
  ])("rejects a %s", (_description, imageUrl) => {
    expect(getOwnedCabinImageObjectName(imageUrl, PROJECT_URL)).toBeNull();
  });
});
