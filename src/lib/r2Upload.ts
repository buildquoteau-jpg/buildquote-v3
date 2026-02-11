// ------------------------------------------------------------------
// R2 Upload Helper — S3-compatible API for Cloudflare R2
// ------------------------------------------------------------------
// V1: Client generates the key and PUTs directly to R2 via a
// server-generated presigned URL. For now we provide a manual
// r2Key paste fallback and a direct upload path when credentials
// are configured via a backend endpoint.
// ------------------------------------------------------------------

const R2_PUBLIC_BASE =
  "https://1b20339116453994c6fd04b63d84fa28.r2.cloudflarestorage.com/bqmanufacturersportal";

/**
 * Generate a unique R2 object key for a document upload.
 */
export function generateR2Key(
  manufacturerId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `manufacturers/${manufacturerId}/${timestamp}_${sanitized}`;
}

/**
 * Build the public URL for a stored R2 object.
 */
export function getR2PublicUrl(r2Key: string): string {
  return `${R2_PUBLIC_BASE}/${r2Key}`;
}

/**
 * Upload a file to R2 using the S3-compatible presigned URL endpoint.
 *
 * Flow:
 * 1. Call the backend to get a presigned PUT URL for the given key.
 * 2. PUT the file directly to R2.
 * 3. Return the r2Key and public URL.
 *
 * If the presigned URL endpoint is not yet available, returns null
 * so the UI can fall back to manual r2Key entry.
 */
export async function uploadToR2(
  file: File,
  r2Key: string
): Promise<{ r2Key: string; publicUrl: string } | null> {
  try {
    // Request a presigned URL from our backend
    const presignRes = await fetch("/api/r2/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: r2Key,
        contentType: file.type,
      }),
    });

    if (!presignRes.ok) {
      console.warn("Presigned URL endpoint not available, use manual r2Key entry");
      return null;
    }

    const { url } = await presignRes.json();

    // PUT the file directly to R2
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`R2 upload failed: ${uploadRes.status}`);
    }

    return {
      r2Key,
      publicUrl: getR2PublicUrl(r2Key),
    };
  } catch (err) {
    console.warn("R2 upload failed, falling back to manual entry:", err);
    return null;
  }
}
