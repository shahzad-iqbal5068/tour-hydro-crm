import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailux FAQ | Hydro CRM",
};

export default function FaqSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Tailux FAQ
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dummy frequently asked questions.
        </p>
      </header>

      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-xs text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        <p>Q: Is this real data?</p>
        <p>A: No, this is placeholder content for the settings UI.</p>
      </div>
    </div>
  );
}

