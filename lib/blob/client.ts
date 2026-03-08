import { put, del, head, list, type PutBlobResult } from "@vercel/blob";

// ─── Vercel Blob client helpers ───────────────────────────────────────────────
// Upload strategies:
//   - Server upload: call these functions from API routes (max 4.5 MB in Vercel Functions)
//   - Client upload: use /api/upload-token to get a token, then Blob.upload() from browser (no size limit)

function blobPath(category: "pdf" | "image" | "video" | "audio", filename: string): string {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `${category}/${Date.now()}_${safe}`;
}

/**
 * Upload a PDF buffer from a server-side route.
 * For PDFs > 4 MB use client upload via /api/upload-token instead.
 */
export async function uploadPdf(buffer: Buffer, filename: string): Promise<PutBlobResult> {
    const pathname = blobPath("pdf", filename);
    return put(pathname, buffer, {
        access: "public",
        contentType: "application/pdf",
        addRandomSuffix: false,
    });
}

/**
 * Upload a generated image buffer (GPT Image / diagram).
 */
export async function uploadImage(buffer: Buffer, filename: string): Promise<PutBlobResult> {
    const ext = filename.split(".").pop() || "png";
    const pathname = blobPath("image", filename);
    return put(pathname, buffer, {
        access: "public",
        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        addRandomSuffix: false,
    });
}

/**
 * Upload a rendered video (MP4).
 */
export async function uploadVideo(buffer: Buffer, filename: string): Promise<PutBlobResult> {
    const pathname = blobPath("video", filename);
    return put(pathname, buffer, {
        access: "public",
        contentType: "video/mp4",
        addRandomSuffix: false,
    });
}

/**
 * Upload a TTS audio file (MP3).
 */
export async function uploadAudio(buffer: Buffer, filename: string): Promise<PutBlobResult> {
    const pathname = blobPath("audio", filename);
    return put(pathname, buffer, {
        access: "public",
        contentType: "audio/mpeg",
        addRandomSuffix: false,
    });
}

/**
 * Delete a blob by URL.
 */
export async function deleteBlob(url: string): Promise<void> {
    return del(url);
}

/**
 * Check if a blob exists.
 */
export async function blobExists(url: string): Promise<boolean> {
    try {
        await head(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * List all blobs under a prefix.
 */
export async function listBlobs(prefix: string) {
    return list({ prefix });
}
