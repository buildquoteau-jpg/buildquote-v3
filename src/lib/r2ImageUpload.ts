// ------------------------------------------------------------------
// R2 Image Upload Helper — extends r2Upload.ts for image uploads
// Used by builder logo (Feature 2) and project image (Feature 3)
// ------------------------------------------------------------------

import { getR2PublicUrl, uploadToR2 } from "./r2Upload";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export interface ImageValidationError {
  type: "invalid_type" | "too_large";
  message: string;
}

/**
 * Validate an image file before upload.
 */
export function validateImage(file: File): ImageValidationError | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      type: "invalid_type",
      message: "Only PNG, JPEG, and WebP images are accepted.",
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      type: "too_large",
      message: "Image must be under 2 MB.",
    };
  }
  return null;
}

/**
 * Generate an R2 key for a builder logo.
 */
export function builderLogoR2Key(builderId: string, fileName: string): string {
  const timestamp = Date.now();
  const ext = fileName.split(".").pop() ?? "png";
  return `builders/${builderId}/logo_${timestamp}.${ext}`;
}

/**
 * Generate an R2 key for a project image.
 */
export function projectImageR2Key(
  projectId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const ext = fileName.split(".").pop() ?? "png";
  return `projects/${projectId}/image_${timestamp}.${ext}`;
}

/**
 * Upload an image to R2. Returns the r2Key and publicUrl,
 * or null if the presigned URL endpoint is unavailable.
 */
export async function uploadImage(
  file: File,
  r2Key: string
): Promise<{ r2Key: string; publicUrl: string } | null> {
  return uploadToR2(file, r2Key);
}

export { getR2PublicUrl };
