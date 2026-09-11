export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
export const IMAGE_INPUT_ACCEPT = ALLOWED_IMAGE_MIME_TYPES.join(",");

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return "Use a JPEG, PNG, or WebP image.";
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}
