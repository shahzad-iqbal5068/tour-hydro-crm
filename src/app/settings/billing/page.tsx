import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing Settings | Hydro CRM",
};

export default function BillingSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Billing
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dummy billing information – connect your provider later.
        </p>
      </header>

      <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Current plan
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Hydro CRM Demo – 10 seats included.
        </p>
      </section>
    </div>
  );
}

