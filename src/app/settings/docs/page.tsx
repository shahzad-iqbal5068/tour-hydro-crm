import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | Hydro CRM",
};

export default function DocsSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Documentation
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dummy documentation links.
        </p>
      </header>

      <ul className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 text-xs text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        <li>Getting started with Hydro CRM</li>
        <li>Managing bookings and attendance</li>
        <li>Admin configuration and permissions</li>
      </ul>
    </div>
  );
}

