import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions & Password | Hydro CRM",
};

export default function SessionsSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Sessions & Password
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dummy data about active sessions and password security.
        </p>
      </header>

      <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Active sessions
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          You are currently logged in on 1 device (this browser).
        </p>
      </section>
    </div>
  );
}

