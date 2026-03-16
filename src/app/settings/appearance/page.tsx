import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appearance Settings | Hydro CRM",
};

export default function AppearanceSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Appearance
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dummy appearance options – theme is still controlled from the top
          navbar.
        </p>
      </header>

      <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Layout density
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Choose between comfortable, compact, or system default spacing.
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            Dummy
          </span>
        </div>
      </section>
    </div>
  );
}

