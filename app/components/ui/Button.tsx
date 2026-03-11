"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "sm" | "md";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseClasses =
  "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
  secondary:
    "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
  tertiary:
    "border border-transparent bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  loading,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const content = loading ? "Loading..." : children;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {iconLeft && <span className="mr-1.5 text-[11px]">{iconLeft}</span>}
      <span>{content}</span>
      {iconRight && <span className="ml-1.5 text-[11px]">{iconRight}</span>}
    </button>
  );
}

