"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/types";
import { authLogout } from "@/lib/api";
import { ensureImageUrl } from "@/lib/imageUrl";
import { ProfileInfoModal, ProfileImageModal } from "./ProfileModal";

type NavbarProps = {
  sectionLabel: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  user: AuthUser | null;
  mounted: boolean;
  onToggleSidebar: () => void;
};

export function Navbar({
  sectionLabel,
  theme,
  onToggleTheme,
  user,
  mounted,
  onToggleSidebar,
}: NavbarProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch {
      // ignore network error, we'll still redirect
    }
    // Clear any client-side cookie reference
    if (typeof document !== "undefined") {
      document.cookie =
        "auth_token=; Max-Age=0; path=/; sameSite=lax; secure=false";
    }
    router.replace("/login");
  };

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "";
  const avatarSrc = user ? ensureImageUrl(user.avatarUrl) : undefined;

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex min-w-0 items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-[11px] font-semibold text-white">
            HT
          </div>
        <span className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-50">
           Hydro Tour
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="group flex items-center gap-2 rounded-full border border-transparent px-1 py-0.5 text-left hover:border-zinc-300 dark:hover:border-zinc-600"
            >
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                {avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarSrc}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
                <span className="pointer-events-none absolute bottom-0 right-0 hidden rounded-full bg-black/70 px-0.5 text-[9px] text-white group-hover:block">
                  ✏️
                </span>
              </div>
              <div className="hidden text-xs leading-tight text-zinc-700 dark:text-zinc-200 sm:block">
                <div className="font-medium">{user.name}</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {user.role}
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-md border border-zinc-300 px-2 py-1 text-[11px] text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900 sm:inline-flex"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {user && infoOpen && (
        <ProfileInfoModal
          user={user}
          onClose={() => setInfoOpen(false)}
          onOpenImageModal={() => {
            setInfoOpen(false);
            setImageOpen(true);
          }}
          onLogout={handleLogout}
        />
      )}

      {user && imageOpen && (
        <ProfileImageModal
          user={user}
          onClose={() => setImageOpen(false)}
          onUpdated={(partial) => {
            // Allow parent to keep token-based data; only update what we know changed
            Object.assign(user, partial);
          }}
        />
      )}
    </header>
  );
}

