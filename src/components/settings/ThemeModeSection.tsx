"use client";

import { useState } from "react";

type ThemeMode = "light" | "dark" | "system";

export function ThemeModeSection() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme") as ThemeMode | null;
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "light";
  });

  const handleChange = (next: ThemeMode) => {
    setMode(next);
    window.localStorage.setItem("theme", next);
    window.dispatchEvent(
      new CustomEvent<ThemeMode>("hydro-theme-change", { detail: next })
    );
  };

  const optionClass = (value: ThemeMode) =>
    `flex-1 cursor-pointer rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
      mode === value
        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200"
        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700"
    }`;

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Theme mode
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Switch between light, dark, or follow your system preference.
          </p>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className={optionClass("light")}
          onClick={() => handleChange("light")}
        >
          Light
        </button>
        <button
          type="button"
          className={optionClass("dark")}
          onClick={() => handleChange("dark")}
        >
          Dark
        </button>
        <button
          type="button"
          className={optionClass("system")}
          onClick={() => handleChange("system")}
        >
          System
        </button>
      </div>
    </section>
  );
}

