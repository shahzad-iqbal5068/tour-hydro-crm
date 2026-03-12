"use client";

import type { AuthUser } from "@/types"; // shared app types

type NavbarProps = {
  sectionLabel: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  user: AuthUser | null;
  mounted: boolean;
};

export function Navbar({
  sectionLabel,
  theme,
  onToggleTheme,
  user,
  mounted,
}: NavbarProps) {
  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "";

  return (
    <header className="flex min-w-0 items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-50">
          Hydro CRM
        </span>
        <span className="hidden shrink-0 text-xs text-zinc-500 dark:text-zinc-400 md:inline">
          {sectionLabel}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Toggle theme"
        >
          <span suppressHydrationWarning>
            {mounted ? (theme === "light" ? "🌙" : "☀️") : "🌙"}
          </span>
        </button>

        {user && (
          <div className="flex items-center gap-2 rounded-full border border-transparent px-1 py-0.5 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {initials}
            </div>
            <div className="hidden text-xs leading-tight text-zinc-700 dark:text-zinc-200 sm:block">
              <div className="font-medium">{user.name}</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {user.role}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

