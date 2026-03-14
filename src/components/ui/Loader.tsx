"use client";

type LoaderSize = "sm" | "md" | "lg";
type LoaderVariant = "spinner" | "dots" | "pulse";

const sizeClasses: Record<LoaderSize, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export type LoaderProps = {
  /** "spinner" (default) | "dots" | "pulse" */
  variant?: LoaderVariant;
  size?: LoaderSize;
  /** Optional text below the loader */
  label?: string;
  /** Use for full-width table/card placeholder (centered, padded) */
  block?: boolean;
  /** Inline spinner only (no wrapper), for use inside text */
  inline?: boolean;
  className?: string;
};

export function Loader({
  variant = "spinner",
  size = "md",
  label,
  block = false,
  inline = false,
  className = "",
}: LoaderProps) {
  const content = (
    <>
      {variant === "spinner" && (
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-zinc-300 border-t-blue-500 dark:border-zinc-600 dark:border-t-blue-400`}
          role="status"
          aria-label="Loading"
        />
      )}
      {variant === "dots" && (
        <div className="flex items-center gap-1" role="status" aria-label="Loading">
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s] dark:bg-blue-400" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s] dark:bg-blue-400" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 dark:bg-blue-400" />
        </div>
      )}
      {variant === "pulse" && (
        <div
          className={`${size === "sm" ? "h-5 w-5" : size === "md" ? "h-8 w-8" : "h-12 w-12"} animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700`}
          role="status"
          aria-label="Loading"
        />
      )}
      {label && (
        <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
      )}
    </>
  );

  if (inline && variant === "spinner" && !label) {
    return (
      <span className={`inline-block ${className}`} role="status" aria-label="Loading">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-zinc-300 border-t-blue-500 dark:border-zinc-600 dark:border-t-blue-400`}
        />
      </span>
    );
  }

  if (block) {
    return (
      <div
        className={`flex min-h-[120px] flex-col items-center justify-center gap-2 py-8 ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {content}
    </div>
  );
}
