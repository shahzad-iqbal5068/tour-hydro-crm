"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDashboardStats, useFollowupsToday, type Period } from "@/hooks/api";
import { PageLoader } from "@/components/ui/PageLoader";

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function HomeStats() {
  const [period, setPeriod] = useState<Period>("today");
  const { data: stats, isLoading: loading, error: statsError } = useDashboardStats(period);
  const { data: todayFollowUps = [] } = useFollowupsToday();
  const toastedFollowUps = useRef(false);

  useEffect(() => {
    if (todayFollowUps.length > 0 && !toastedFollowUps.current) {
      toast(`You have ${todayFollowUps.length} follow-up${todayFollowUps.length === 1 ? "" : "s"} today`);
      toastedFollowUps.current = true;
    }
  }, [todayFollowUps.length]);

  const inquiries = stats?.inquiries ?? 0;
  const bookings4to5 = stats?.bookings4to5 ?? 0;
  const bookings3 = stats?.bookings3 ?? 0;
  const bookingsTotal = stats?.bookingsTotal ?? 0;
  const error = statsError ? (statsError as Error).message : null;

  return (
    <div className="space-y-4">
      {todayFollowUps.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <h3 className="mb-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
            Today&apos;s Follow Ups
          </h3>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-200">
            {todayFollowUps.map((b) => (
              <li key={b._id}>
                <span className="font-medium">{b.guestName}</span>
                {b.followUpNote ? ` – ${b.followUpNote}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
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
        {loading ? (
          <div className="col-span-full">
            <PageLoader message="Loading stats…" fullScreen={false} />
          </div>
        ) : (
          <>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Inquiries
          </p>
          {error ? (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
          ) : (
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {inquiries}
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
          {error ? (
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
                  {bookings4to5}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  3 Star
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {bookings3}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-1.5 text-sm dark:border-zinc-700">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Total
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {bookingsTotal}
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
          </>
        )}
      </div>
    </div>
  );
}
