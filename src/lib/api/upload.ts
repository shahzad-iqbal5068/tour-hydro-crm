import { apiFetcher } from "./client";

export type UploadImageResponse = { url: string };

/**
 * Upload image (e.g. to Cloudinary). Use FormData with "file" key.
 * Do not call fetch("/api/upload/image") from components; use this function.
 */
export async function uploadImage(formData: FormData): Promise<string> {
  const res = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { message?: string }).message ?? "Upload failed";
    throw new Error(message);
  }
  const url = (data as { url?: string }).url;
  if (!url) throw new Error("No image URL returned");
  return url;
}
