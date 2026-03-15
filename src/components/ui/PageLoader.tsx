"use client";

import { Loader2 } from "lucide-react";

type PageLoaderProps = {
  /** Optional message below the spinner */
  message?: string;
  /** Use full viewport height (e.g. for full-page loading) */
  fullScreen?: boolean;
  /** Optional className for the wrapper */
  className?: string;
};

export function PageLoader({
  message = "Loading…",
  fullScreen = true,
  className = "",
}: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-zinc-500 dark:text-zinc-400 ${
        fullScreen ? "min-h-[60vh]" : "py-12"
      } ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2
        className="h-10 w-10 animate-spin text-zinc-400 dark:text-zinc-500"
        aria-hidden
      />
      {message && (
        <p className="text-sm font-medium tabular-nums">{message}</p>
      )}
    </div>
  );
}
