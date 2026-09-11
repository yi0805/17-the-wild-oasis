const CABIN_IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type CabinImageExtension = (typeof CABIN_IMAGE_EXTENSIONS)[keyof typeof CABIN_IMAGE_EXTENSIONS];

const CANONICAL_CABIN_IMAGE_NAME =
  /^cabin-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpg|png|webp)$/;
const CABIN_IMAGES_PUBLIC_PATH = "/storage/v1/object/public/cabin-images/";

export function getCabinImageExtension(mimeType: string): CabinImageExtension | null {
  return CABIN_IMAGE_EXTENSIONS[mimeType as keyof typeof CABIN_IMAGE_EXTENSIONS] ?? null;
}

export function buildCabinImageObjectName(uuid: string, mimeType: string) {
  const extension = getCabinImageExtension(mimeType);

  if (!extension) throw new Error("Unsupported cabin image MIME type");

  return `cabin-${uuid}.${extension}`;
}

export function getOwnedCabinImageObjectName(
  imageUrl: string,
  projectUrl: string,
): string | null {
  let image: URL;
  let project: URL;

  try {
    image = new URL(imageUrl);
    project = new URL(projectUrl);
  } catch {
    return null;
  }

  if (image.origin !== project.origin) return null;
  if (image.search || image.hash) return null;
  if (!image.pathname.startsWith(CABIN_IMAGES_PUBLIC_PATH)) return null;

  let objectName: string;
  try {
    objectName = decodeURIComponent(
      image.pathname.slice(CABIN_IMAGES_PUBLIC_PATH.length),
    );
  } catch {
    return null;
  }

  if (objectName.includes("/")) return null;

  return CANONICAL_CABIN_IMAGE_NAME.test(objectName) ? objectName : null;
}
