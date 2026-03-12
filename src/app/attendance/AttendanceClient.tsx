"use client";

import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

type Status = "loading" | "none" | "checked_in" | "closed";

type MineResponse = {
  status: "none" | "checked_in" | "closed";
  date: string;
  record: {
    _id: string;
    checkInAt?: string;
    checkOutAt?: string;
    location?: string;
    photoUrl?: string;
  } | null;
};

type MyHistoryRow = {
  _id: string;
  date: string;
  checkInAt?: string;
  checkOutAt?: string;
  location?: string;
  photoUrl?: string;
};

export default function AttendanceClient() {
  const [status, setStatus] = useState<Status>("loading");
  const [dateKey, setDateKey] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [checkInAt, setCheckInAt] = useState<string | undefined>(undefined);
  const [now, setNow] = useState<Date | null>(null);
  const [history, setHistory] = useState<MyHistoryRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const loadStatus = async () => {
    try {
      setStatus("loading");
      const res = await fetch("/api/attendance/mine");
      if (!res.ok) {
        throw new Error("Failed to load");
      }
      const data = (await res.json()) as MineResponse;
      setStatus(data.status);
      setDateKey(data.date);
      if (data.record?.location) setLocation(data.record.location);
      if (data.record?.photoUrl) setPhotoUrl(data.record.photoUrl);
      if (data.record?.checkInAt) setCheckInAt(data.record.checkInAt);
      setNow(new Date());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load attendance");
      setStatus("none");
    }
  };

  useEffect(() => {
    void loadStatus();
    void loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/attendance/mine/history?limit=30");
      if (!res.ok) return;
      const data = (await res.json()) as { data: MyHistoryRow[] };
      setHistory(data.data || []);
    } catch {
      // ignore history errors
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`;
        setLocation(loc);
        toast.success("Location captured");
      },
      (err) => {
        console.error(err);
        toast.error("Unable to get location");
      }
    );
  };

  const uploadPhoto = async (file: File) => {
    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary is not configured");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        toast.error("Upload failed");
        return;
      }
      setPhotoUrl(data.secure_url);
      toast.success("Photo uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void uploadPhoto(file);
  };

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

  const captureFromCamera = () => {
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
        void uploadPhoto(blob as File);
      }
    }, "image/jpeg", 0.9);
  };

  useEffect(
    () => () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    },
    []
  );

  const handleStart = async () => {
    if (!photoUrl) {
      toast.error("Please capture a photo first");
      return;
    }
    // Try to auto-capture location if empty
    if (!location) {
      detectLocation();
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/attendance/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, photoUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to mark attendance");
        return;
      }
      toast.success("Attendance marked. Welcome!");
      stopCamera();
      setModalOpen(false);
      void loadStatus();
      void loadHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnd = async () => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/attendance/end", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to close day");
        return;
      }
      toast.success("Day closed. Have a good rest!");
      void loadStatus();
      void loadHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to close day");
    } finally {
      setSubmitting(false);
    }
  };

  const canStart = status === "none";
  const canEnd = status === "checked_in";

  const computeLiveDuration = () => {
    if (!now || status !== "checked_in" || !checkInAt) return "—";
    const startMs = new Date(checkInAt).getTime();
    const diffMs = Math.max(0, now.getTime() - startMs);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (status !== "checked_in" || !checkInAt) return;
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => window.clearInterval(id);
  }, [status, checkInAt]);

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <Toaster position="top-right" />
      <h1 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Attendance
      </h1>
      <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400">
        Mark your attendance for today. Location and a photo are recorded for
        admin review.
      </p>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
          Date: {dateKey || "—"}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
          Status:{" "}
          {status === "loading"
            ? "Loading..."
            : status === "none"
            ? "Not marked"
            : status === "checked_in"
            ? "Checked in"
            : "Day closed"}
        </span>
      </div>

      <div className="space-y-4 hidden">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-200">
            Location
          </label>
          <div className="flex gap-2">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Capture or type location"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
            />
            <button
              type="button"
              onClick={detectLocation}
              className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Use GPS
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-200">
            Camera
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="h-24 w-40 overflow-hidden rounded-md bg-black/70">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                />
              ) : photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt="Attendance"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[11px] text-zinc-400">
                  Camera off
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {cameraActive ? "Stop camera" : "Open camera"}
              </button>
              <button
                type="button"
                onClick={captureFromCamera}
                disabled={!cameraActive || uploading}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {uploading ? "Saving photo..." : "Capture photo"}
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          disabled={!canStart || submitting || uploading}
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && canStart ? "Marking..." : "Check in"}
        </button>
        <button
          type="button"
          onClick={handleEnd}
          disabled={!canEnd || submitting}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {submitting && canEnd ? "Closing..." : "Check out"}
        </button>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-200">
          My recent attendance
        </label>
        <div className="max-h-64 overflow-y-auto rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
          <table className="min-w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">In</th>
                <th className="px-3 py-2">Out</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    No records yet.
                  </td>
                </tr>
              ) : (
                history.map((row) => {
                  const inTime = row.checkInAt
                    ? new Date(row.checkInAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";
                  const outTime = row.checkOutAt
                    ? new Date(row.checkOutAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";
                  const statusLabel = row.checkOutAt
                    ? "Completed"
                    : row.checkInAt
                    ? "In progress"
                    : "Not marked";
                  return (
                    <tr
                      key={row._id}
                      className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    >
                      <td className="px-3 py-2 text-zinc-800 dark:text-zinc-100">
                        {row.date}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-200">
                        {inTime}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-200">
                        {outTime}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-200">
                        {statusLabel}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-md rounded-lg bg-white p-4 text-sm shadow-lg dark:bg-zinc-950 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Mark today&apos;s attendance
              </h2>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setModalOpen(false);
                }}
                className="rounded-full px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-200">
                  Location
                </label>
                <div className="flex gap-2">
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Capture or type location"
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                  />
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  >
                    Use GPS
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-200">
                  Camera
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="h-24 w-40 overflow-hidden rounded-md bg-black/70">
                    {cameraActive ? (
                      <video
                        ref={videoRef}
                        className="h-full w-full object-cover"
                        muted
                      />
                    ) : photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoUrl}
                        alt="Attendance"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[11px] text-zinc-400">
                        Camera off
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={cameraActive ? stopCamera : startCamera}
                      className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    >
                      {cameraActive ? "Stop camera" : "Open camera"}
                    </button>
                    <button
                      type="button"
                      onClick={captureFromCamera}
                      disabled={!cameraActive || uploading}
                      className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      {uploading ? "Saving photo..." : "Capture photo"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setModalOpen(false);
                  }}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={submitting || uploading}
                  className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save & mark attendance"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

