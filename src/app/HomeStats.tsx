"use client";

import { useEffect, useState } from "react";

type Period = "today" | "weekly" | "monthly" | "yearly";

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function HomeStats() {
  const [period, setPeriod] = useState<Period>("today");
  const [inquiries, setInquiries] = useState<number | null>(null);
  const [bookings4to5, setBookings4to5] = useState<number | null>(null);
  const [bookings3, setBookings3] = useState<number | null>(null);
  const [bookingsTotal, setBookingsTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/dashboard/stats?period=${period}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.message || "Failed to load");
          return;
        }
        if (!cancelled) {
          setInquiries(data.inquiries ?? 0);
          setBookings4to5(data.bookings4to5 ?? 0);
          setBookings3(data.bookings3 ?? 0);
          setBookingsTotal(data.bookingsTotal ?? 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load stats");
          setInquiries(0);
          setBookings4to5(0);
          setBookings3(0);
          setBookingsTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchStats();
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="period-select"
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >
          Period
        </label>
        <select
          id="period-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        >
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <option key={p} value={p}>
              {PERIOD_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Inquiries
          </p>
          {loading ? (
            <p className="mt-2 text-2xl font-semibold text-zinc-400 dark:text-zinc-500">
              —
            </p>
          ) : error ? (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          ) : (
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {inquiries ?? 0}
            </p>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            From database ({PERIOD_LABELS[period].toLowerCase()})
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Bookings
          </p>
          {loading ? (
            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">—</p>
          ) : error ? (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          ) : (
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  4–5 Star
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {bookings4to5 ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  3 Star
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {bookings3 ?? 0}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-1.5 text-sm dark:border-zinc-700">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Total
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {bookingsTotal ?? 0}
                </span>
              </div>
            </div>
          )}
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {PERIOD_LABELS[period].toLowerCase()}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Monthly revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            48,200 AED
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Approximate, based on package mix
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Active WhatsApp leads
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            87
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Across all cruise packages
          </p>
        </div>
      </div>
    </div>
  );
}
