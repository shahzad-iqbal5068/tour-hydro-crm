import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask a Question | Hydro CRM",
};

export default function SupportSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Ask a Question
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dummy support form – does not send anything yet.
        </p>
      </header>

      <form className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
            Subject
          </label>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            placeholder="Example: Question about bookings screen"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
            Message
          </label>
          <textarea
            rows={4}
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            placeholder="Describe your question or issue..."
          />
        </div>
        <button
          type="button"
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Send (dummy)
        </button>
      </form>
    </div>
  );
}

