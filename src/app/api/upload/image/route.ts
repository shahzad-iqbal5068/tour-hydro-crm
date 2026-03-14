import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side image upload to Cloudinary.
 * Only the server needs CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET,
 * so uploads work from any device (e.g. other laptops) that hit this backend.
 */
export async function POST(request: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    return NextResponse.json(
      { message: "Image upload is not configured on the server. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "No image file provided. Send a form field named 'file'." },
        { status: 400 }
      );
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("upload_preset", preset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };

    if (!res.ok) {
      console.error("Cloudinary upload error:", data);
      return NextResponse.json(
        { message: data.error?.message ?? "Upload failed" },
        { status: 502 }
      );
    }

    const url = data.secure_url;
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { message: "Invalid response from image service" },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: url.startsWith("http") ? url : `https:${url}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
