"use client";

import { useState } from "react";
import { ensureImageUrl } from "@/lib/imageUrl";

type AccountState = {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  nickname: string;
  phone: string;
};

export function AccountGeneralSection() {
  const [account, setAccount] = useState<AccountState>(() => {
    if (typeof document === "undefined") {
      return {
        name: "",
        email: "",
        role: "",
        avatarUrl: undefined,
        nickname: "",
        phone: "",
      };
    }
    try {
      const cookie = document.cookie;
      const token = cookie
        .split("; ")
        .find((c) => c.startsWith("auth_token="))
        ?.split("=")[1];
      if (!token) {
        return {
          name: "",
          email: "",
          role: "",
          avatarUrl: undefined,
          nickname: "",
          phone: "",
        };
      }
      const payloadPart = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadPart)) as {
        name: string;
        email: string;
        role: string;
        avatarUrl?: string;
      };
      return {
        name: decoded.name ?? "",
        email: decoded.email ?? "",
        role: decoded.role ?? "",
        avatarUrl: decoded.avatarUrl,
        nickname: "",
        phone: "",
      };
    } catch {
      return {
        name: "",
        email: "",
        role: "",
        avatarUrl: undefined,
        nickname: "",
        phone: "",
      };
    }
  });

  const initials = account.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarSrc = ensureImageUrl(account.avatarUrl);

  return (
    <section className="space-y-6 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          General
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Update your basic account information.
        </p>
      </header>

      <div className="space-y-4 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
        <div className="space-y-2">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Avatar
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={account.name || "Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {initials || "?"}
                </div>
              )}
              <button
                type="button"
                className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-[11px] text-white shadow-sm"
                title="Change avatar (use profile menu)"
              >
                ✏️
              </button>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Avatar changes are managed from the profile picture menu in the
              header.
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1 text-xs">
            <label className="font-medium text-zinc-600 dark:text-zinc-300">
              Display name
            </label>
            <div className="flex items-center gap-2 rounded-md border border-zinc-300 bg-zinc-900/5 px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900">
              <span className="text-zinc-500 dark:text-zinc-400">👤</span>
              <input
                className="flex-1 border-none bg-transparent text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-50"
                placeholder="Enter nickname"
                value={account.nickname}
                onChange={(e) =>
                  setAccount((prev) => ({ ...prev, nickname: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <label className="font-medium text-zinc-600 dark:text-zinc-300">
              Full name
            </label>
            <div className="flex items-center gap-2 rounded-md border border-zinc-300 bg-zinc-900/5 px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900">
              <span className="text-zinc-500 dark:text-zinc-400">👤</span>
              <input
                className="flex-1 border-none bg-transparent text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-50"
                placeholder="Enter full name"
                value={account.name}
                onChange={(e) =>
                  setAccount((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1 text-xs">
            <label className="font-medium text-zinc-600 dark:text-zinc-300">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-md border border-zinc-300 bg-zinc-900/5 px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900">
              <span className="text-zinc-500 dark:text-zinc-400">✉️</span>
              <input
                className="flex-1 border-none bg-transparent text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-50"
                placeholder="Enter email"
                type="email"
                value={account.email}
                onChange={(e) =>
                  setAccount((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <label className="font-medium text-zinc-600 dark:text-zinc-300">
              Phone number
            </label>
            <div className="flex items-center gap-2 rounded-md border border-zinc-300 bg-zinc-900/5 px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900">
              <span className="text-zinc-500 dark:text-zinc-400">📞</span>
              <input
                className="flex-1 border-none bg-transparent text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-50"
                placeholder="Phone number"
                value={account.phone}
                onChange={(e) =>
                  setAccount((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-dashed border-zinc-200 pt-4 text-xs dark:border-zinc-800">
          <div className="font-medium text-zinc-700 dark:text-zinc-200">
            Password & security
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Forgot password (link)
            </button>
            <button
              type="button"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Update password
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            These buttons are placeholders – wire them to your real password
            reset / update flow.
          </p>
        </div>
      </div>
    </section>
  );
}

