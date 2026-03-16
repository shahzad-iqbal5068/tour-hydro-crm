"use client";

import { useEffect, useRef, useState } from "react";
import type { AuthUser } from "@/types";
import { profileUpdate, uploadImage as apiUploadImage } from "@/lib/api";
import { ensureImageUrl } from "@/lib/imageUrl";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/40 px-3 py-4">
      <div className="w-full max-w-xs rounded-2xl bg-white text-sm text-zinc-900 shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-800">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Profile
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center px-4 pb-3 pt-1">
          <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-lg font-semibold text-white dark:bg-zinc-800">
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
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {user.name}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {user.role}
            </div>
          </div>

          <div className="mt-4 grid w-full grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="justify-center bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              onClick={onOpenImageModal}
            >
              Upload image
            </Button>
            <Button
              size="sm"
              className="justify-center bg-emerald-600 text-white hover:bg-emerald-500"
              onClick={onOpenImageModal}
            >
              Open camera
            </Button>
          </div>
        </div>

        <div className="mt-1 border-t border-zinc-200 px-2 py-2 text-xs dark:border-zinc-800">
          <div className="space-y-1">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-base">
                ☺
              </span>
              <span>
                <div className="text-xs font-medium">Profile</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Your profile settings
                </div>
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-base">
                ✉
              </span>
              <span>
                <div className="text-xs font-medium">Messages</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Your messages and tasks
                </div>
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-500 text-base">
                👥
              </span>
              <span>
                <div className="text-xs font-medium">Team</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Your team members
                </div>
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-base">
                ₿
              </span>
              <span>
                <div className="text-xs font-medium">Billing</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Your billing information
                </div>
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-base">
                ⚙
              </span>
              <span>
                <div className="text-xs font-medium">Settings</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Webapp settings
                </div>
              </span>
            </button>
          </div>
        </div>

        <div className="border-t border-zinc-200 px-4 pb-4 pt-2 dark:border-zinc-800">
          <Button
            fullWidth
            size="md"
            variant="secondary"
            className="mt-1 justify-center rounded-xl bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            onClick={onLogout}
          >
            Logout
          </Button>
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
      const url = await apiUploadImage(formData);
      setAvatarUrl(url);
      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
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
      const data = await profileUpdate({ avatarUrl: avatarUrl ?? "" });
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xs"
          >
            ✕
          </Button>
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-2 py-0.5 text-[11px]"
                    onClick={cameraActive ? stopCamera : startCamera}
                  >
                    {cameraActive ? "Stop" : "Start"}
                  </Button>
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
                  <Button
                    size="sm"
                    disabled={!cameraActive || uploading}
                    className="px-3 py-1.5 text-xs"
                    onClick={captureFromCamera}
                  >
                    {uploading ? "Saving..." : "Capture & save"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                size="sm"
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="px-3 py-1.5 text-xs"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

