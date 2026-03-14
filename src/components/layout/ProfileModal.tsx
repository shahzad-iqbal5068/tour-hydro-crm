"use client";

import { useEffect, useRef, useState } from "react";
import type { AuthUser } from "@/types";
import { ensureImageUrl } from "@/lib/imageUrl";
import { toast } from "react-hot-toast";

type ProfileInfoModalProps = {
  user: AuthUser;
  onClose: () => void;
  onOpenImageModal: () => void;
  onLogout: () => void;
};

type ProfileImageModalProps = {
  user: AuthUser;
  onClose: () => void;
  onUpdated: (user: Partial<AuthUser>) => void;
};

export function ProfileInfoModal({
  user,
  onClose,
  onOpenImageModal,
  onLogout,
}: ProfileInfoModalProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/40 px-3">
      <div className="w-full max-w-sm rounded-lg bg-white p-4 text-sm shadow-lg dark:bg-zinc-950 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-lg font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
            {(() => {
              const src = ensureImageUrl(user.avatarUrl);
              return src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              );
            })()}
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {user.name}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {user.role}
            </div>
          </div>
          <div className="mt-3 flex w-full flex-col gap-2">
            <button
              type="button"
              onClick={onOpenImageModal}
              className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Change profile image
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-md border border-red-500 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileImageModal({
  user,
  onClose,
  onUpdated,
}: ProfileImageModalProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Auto-start camera when modal opens
    void startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error(err);
      toast.error("Unable to access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    streamRef.current = null;
    setCameraActive(false);
  };

  const uploadImage = async (file: File | Blob) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; message?: string };
      if (!res.ok) {
        toast.error(data.message ?? "Upload failed");
        return;
      }
      if (data.url) {
        setAvatarUrl(data.url);
        toast.success("Image uploaded");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        void uploadImage(blob);
      }
    }, "image/jpeg", 0.9);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
        return;
      }
      toast.success("Profile image updated");
      onUpdated({ avatarUrl: data.avatarUrl });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/40 px-3">
      <div className="w-full max-w-lg rounded-lg bg-white p-4 text-sm shadow-lg dark:bg-zinc-950 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Profile image
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex w-full flex-col items-center gap-3 sm:w-40">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-lg font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {(() => {
                const src = ensureImageUrl(avatarUrl);
                return src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                );
              })()}
            </div>
            <div className="text-center text-xs text-zinc-600 dark:text-zinc-400">
              {user.email}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                Live camera
              </div>
              <div className="space-y-2 rounded-md border border-dashed border-zinc-300 p-2 text-xs dark:border-zinc-700">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">
                    Webcam
                  </span>
                  <button
                    type="button"
                    onClick={cameraActive ? stopCamera : startCamera}
                    className="rounded-md border border-zinc-300 px-2 py-0.5 text-[11px] text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    {cameraActive ? "Stop" : "Start"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-20 w-28 overflow-hidden rounded-md bg-black/60">
                    {cameraActive && (
                      <video
                        ref={videoRef}
                        className="h-full w-full object-cover"
                        muted
                      />
                    )}
                    {!cameraActive && (
                      <div className="flex h-full items-center justify-center text-[10px] text-zinc-400">
                        Camera off
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={captureFromCamera}
                    disabled={!cameraActive || uploading}
                    className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    {uploading ? "Saving..." : "Capture & save"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

