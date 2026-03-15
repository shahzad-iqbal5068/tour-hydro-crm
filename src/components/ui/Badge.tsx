"use client";

import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "filled" | "outlined" | "soft";
export type BadgeColor = "neutral" | "success" | "warning" | "error" | "info";

export type BadgeProps = {
  children?: ReactNode;
  className?: string;
  variant?: BadgeVariant;
  color?: BadgeColor;
  as?: "span" | "div";
} & HTMLAttributes<HTMLSpanElement>;

function getBadgeClasses(
  variant: BadgeVariant,
  color: BadgeColor
): string {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium";
  if (color === "neutral") {
    const v = {
      filled: "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100",
      outlined: "border border-zinc-300 text-zinc-800 dark:border-zinc-600 dark:text-zinc-200",
      soft: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-200",
    };
    return `${base} ${v[variant]}`;
  }
  if (color === "success") {
    const v = {
      filled: "bg-emerald-600 text-white dark:bg-emerald-700",
      outlined: "border border-emerald-300 text-emerald-800 dark:border-emerald-600 dark:text-emerald-200",
      soft: "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
    };
    return `${base} ${v[variant]}`;
  }
  if (color === "warning") {
    const v = {
      filled: "bg-amber-500 text-white dark:bg-amber-600",
      outlined: "border border-amber-300 text-amber-800 dark:border-amber-600 dark:text-amber-200",
      soft: "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
    };
    return `${base} ${v[variant]}`;
  }
  if (color === "error") {
    const v = {
      filled: "bg-rose-500 text-white dark:bg-rose-600",
      outlined: "border border-rose-300 text-rose-800 dark:border-rose-600 dark:text-rose-200",
      soft: "bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
    };
    return `${base} ${v[variant]}`;
  }
  // info
  const v = {
    filled: "bg-sky-500 text-white dark:bg-sky-600",
    outlined: "border border-sky-300 text-sky-800 dark:border-sky-600 dark:text-sky-200",
    soft: "bg-sky-50 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200",
  };
  return `${base} ${v[variant]}`;
}

export function Badge({
  children,
  className = "",
  variant = "soft",
  color = "neutral",
  as: Component = "span",
  ...rest
}: BadgeProps) {
  return (
    <Component
      className={`${getBadgeClasses(variant, color)} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
