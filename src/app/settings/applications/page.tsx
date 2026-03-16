import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications | Hydro CRM",
};

export default function ApplicationsSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Applications
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dummy list of connected apps.
        </p>
      </header>

      <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          No external applications are connected yet.
        </p>
      </section>
    </div>
  );
}

