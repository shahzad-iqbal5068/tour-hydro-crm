"use client";

import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ensureImageUrl } from "@/lib/imageUrl";

type TodayRecord = {
  _id: string;
  checkInAt?: string;
  checkOutAt?: string;
  location?: string;
  photoUrl?: string;
};

type HistoryRecord = {
  _id: string;
  date: string;
  checkInAt?: string;
  checkOutAt?: string;
  location?: string;
  photoUrl?: string;
};

function formatDuration(fromIso?: string, toIso?: string) {
  if (!fromIso) return "—";
  const start = new Date(fromIso).getTime();
  const end = toIso ? new Date(toIso).getTime() : Date.now();
  const diffMs = Math.max(0, end - start);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return `${hours}h ${minutes}m`;
}

export default function AttendanceClient() {
  const [status, setStatus] = useState<"none" | "checked_in" | "closed">("none");
  const [today, setToday] = useState<TodayRecord | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loadingToday, setLoadingToday] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [liveDuration, setLiveDuration] = useState<string>("—");

  const [modalOpen, setModalOpen] = useState(false);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [locationText, setLocationText] = useState<string>("");
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingToday(true);
        const res = await fetch("/api/attendance/mine");
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to load attendance status");
          return;
        }
        setStatus(data.status as "none" | "checked_in" | "closed");
        setToday(data.record);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load attendance status");
      } finally {
        setLoadingToday(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingHistory(true);
        const res = await fetch("/api/attendance/mine/history?limit=30");
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to load attendance history");
          return;
        }
        setHistory(data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load attendance history");
      } finally {
        setLoadingHistory(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (status !== "checked_in" || !today?.checkInAt) {
      setLiveDuration("—");
      return;
    }
    setLiveDuration(formatDuration(today.checkInAt));
    const id = window.setInterval(() => {
      setLiveDuration(formatDuration(today.checkInAt));
    }, 60_000);
    return () => window.clearInterval(id);
  }, [status, today?.checkInAt]);

  useEffect(() => {
    if (!modalOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      return;
    }
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
        toast.error("Cannot access camera");
      }
    };
    void start();
  }, [modalOpen]);

  const capturePhotoToDataUrl = async (): Promise<string | null> => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const uploadImage = async (dataUrl: string): Promise<string> => {
    const blob = await (await fetch(dataUrl)).blob();
    const form = new FormData();
    form.append("file", blob);
    const res = await fetch("/api/upload/image", { method: "POST", body: form });
    const json = (await res.json()) as { url?: string; message?: string };
    if (!res.ok) {
      throw new Error(json.message ?? "Upload failed");
    }
    if (!json.url) throw new Error("No image URL returned");
    return json.url;
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationText(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setLocLoading(false);
      },
      (err) => {
        console.error(err);
        toast.error("Unable to get location");
        setLocLoading(false);
      }
    );
  };

  const handleStartClick = () => {
    setCapturedUrl(null);
    setLocationText("");
    setModalOpen(true);
  };

  const handleStartConfirm = async () => {
    try {
      setLoadingAction(true);
      const dataUrl = await capturePhotoToDataUrl();
      if (!dataUrl) {
        toast.error("Could not capture photo");
        return;
      }
      const uploadedUrl = await uploadImage(dataUrl);
      setCapturedUrl(uploadedUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const res = await fetch("/api/attendance/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: locationText || undefined,
          photoUrl: uploadedUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to start attendance");
        return;
      }
      setStatus("checked_in");
      setToday({
        _id: json._id,
        checkInAt: json.checkInAt,
        location: json.location,
        photoUrl: json.photoUrl,
        checkOutAt: undefined,
      });
      toast.success("Attendance started");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start attendance");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEnd = async () => {
    try {
      setLoadingAction(true);
      const res = await fetch("/api/attendance/end", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to end attendance");
        return;
      }
      setStatus("closed");
      setToday((prev) =>
        prev
          ? {
              ...prev,
              checkOutAt: json.checkOutAt,
            }
          : {
              _id: json._id,
              checkInAt: json.checkInAt,
              checkOutAt: json.checkOutAt,
            }
      );
      toast.success("Attendance ended");
    } catch (err) {
      console.error(err);
      toast.error("Failed to end attendance");
    } finally {
      setLoadingAction(false);
    }
  };

  const formatTime = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <Toaster position="top-right" />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            My attendance
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Check in with a photo and location, then check out when you finish.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleStartClick}
            disabled={status === "checked_in" || loadingToday || loadingAction}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-700/50"
          >
            {status === "checked_in" ? "Already checked in" : "Mark attendance"}
          </button>
          <button
            type="button"
            onClick={handleEnd}
            disabled={
              status !== "checked_in" || loadingToday || loadingAction
            }
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-800/50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Check out
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-3">
        <div>
          <div className="mb-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
            Status today
          </div>
          <div className="text-sm font-semibold">
            {loadingToday
              ? "Loading..."
              : status === "none"
              ? "Not started"
              : status === "checked_in"
              ? "Checked in"
              : "Closed"}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
            Check in
          </div>
          <div className="text-sm">
            {today?.checkInAt ? formatTime(today.checkInAt) : "—"}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
            Elapsed time
          </div>
          <div className="text-sm">{liveDuration}</div>
        </div>
      </div>

      <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Recent records
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Check in</th>
              <th className="px-3 py-2">Check out</th>
              <th className="hidden px-3 py-2 md:table-cell">Duration</th>
              <th className="hidden px-3 py-2 lg:table-cell">Location</th>
              <th className="px-3 py-2 text-right">Photo</th>
            </tr>
          </thead>
          <tbody>
            {loadingHistory ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  Loading history...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No records.
                </td>
              </tr>
            ) : (
              history.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <td className="px-3 py-2 text-zinc-800 dark:text-zinc-100">
                    {row.date}
                  </td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-200">
                    {formatTime(row.checkInAt)}
                  </td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-200">
                    {formatTime(row.checkOutAt)}
                  </td>
                  <td className="hidden px-3 py-2 text-zinc-700 dark:text-zinc-200 md:table-cell">
                    {formatDuration(row.checkInAt, row.checkOutAt)}
                  </td>
                  <td className="hidden max-w-[140px] truncate px-3 py-2 text-zinc-600 dark:text-zinc-300 lg:table-cell">
                    {row.location || "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {(() => {
                      const href = ensureImageUrl(row.photoUrl);
                      return href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-md border border-zinc-300 px-2 py-1 text-[11px] text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      >
                        View
                      </a>
                      ) : (
                      <span className="text-[11px] text-zinc-400">
                        No photo
                      </span>
                      );
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-950 p-4 text-xs text-zinc-50 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Start attendance</h2>
                <p className="text-[11px] text-zinc-400">
                  Allow camera and optionally capture your location.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="mb-3 overflow-hidden rounded-md border border-zinc-700 bg-black">
              <video
                ref={videoRef}
                className="h-48 w-full object-cover"
                autoPlay
                muted
                playsInline
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-[11px] font-medium text-zinc-300">
                Location (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Latitude, longitude or address"
                  className="flex-1 rounded-md border border-zinc-700 bg-black px-2 py-1.5 text-xs text-zinc-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleLocate}
                  disabled={locLoading}
                  className="rounded-md border border-zinc-700 px-2 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-500"
                >
                  {locLoading ? "Locating..." : "Use GPS"}
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartConfirm}
                disabled={loadingAction}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-700/60"
              >
                {loadingAction ? "Saving..." : "Capture & start"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

