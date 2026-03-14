"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
type Range = "daily" | "weekly" | "monthly" | "yearly";

type PerformanceData = {
  range: Range;
  start: string;
  end: string;
  overview: {
    totalInquiries: number;
    totalBookings: number;
    conversionRate: number;
    topEmployee: { name: string; bookings: number } | null;
  };
  employees: {
    userId: string;
    name: string;
    inquiries: number;
    bookings: number;
    conversionRate: number;
  }[];
  leaderboard: {
    userId: string;
    name: string;
    inquiries: number;
    bookings: number;
    conversionRate: number;
  }[];
  timeSeries: { label: string; inquiries: number; bookings: number }[];
};

const RANGE_LABELS: Record<Range, string> = {
  daily: "Today",
  weekly: "Last 7 days",
  monthly: "Last 30 days",
  yearly: "Last 12 months",
};

export default function PerformanceClient() {
  const [range, setRange] = useState<Range>("daily");
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- reset before fetch when range changes */
    setLoading(true);
    setError(null);
    fetch(`/api/admin/performance?range=${range}`)
      .then(async (res) => {
        const json = await res.json();
        if (!cancelled) {
          if (!res.ok) {
            setError(json.message || "Failed to load");
            setData(null);
            return;
          }
          setData(json);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError("Failed to load performance data");
          setData(null);
          toast.error("Failed to load performance data");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  if (loading && !data) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">Loading performance…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  const d = data!;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Performance Dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Inquiries, bookings, conversion and employee comparison — {RANGE_LABELS[range]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="range" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Period
          </label>
          <select
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
              <option key={r} value={r}>
                {RANGE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Total Inquiries
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {d.overview.totalInquiries}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Total Bookings
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {d.overview.totalBookings}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Conversion Rate
          </p>
          <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {d.overview.conversionRate}%
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Top Employee
          </p>
          <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {d.overview.topEmployee
              ? `${d.overview.topEmployee.name} (${d.overview.topEmployee.bookings} bookings)`
              : "—"}
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Employee Performance
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Inquiries vs bookings and conversion % per employee
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Inquiries</th>
                <th className="px-4 py-3">Bookings</th>
                <th className="px-4 py-3">Conversion %</th>
              </tr>
            </thead>
            <tbody>
              {d.employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
                    No data for this period.
                  </td>
                </tr>
              ) : (
                d.employees.map((emp) => (
                  <tr
                    key={emp.userId}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {emp.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {emp.inquiries}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {emp.bookings}
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                      {emp.conversionRate}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Top performers this period
          </h2>
        </div>
        <div className="p-4">
          {d.leaderboard.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {d.leaderboard.map((emp, i) => (
                <li
                  key={emp.userId}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {i + 1}. {emp.name}
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {emp.bookings} bookings
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Inquiries vs Bookings (trend)
          </h3>
          <div className="h-64">
            {d.timeSeries.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
                No time series data
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={d.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-zinc-600 dark:text-zinc-400" />
                  <YAxis tick={{ fontSize: 11 }} className="text-zinc-600 dark:text-zinc-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="inquiries" name="Inquiries" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Employee performance (bookings)
          </h3>
          <div className="h-64">
            {d.employees.filter((e) => e.userId !== "unassigned").length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
                No employee data
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={d.employees.filter((e) => e.userId !== "unassigned")}
                  layout="vertical"
                  margin={{ left: 60, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                  <XAxis type="number" tick={{ fontSize: 11 }} className="text-zinc-600 dark:text-zinc-400" />
                  <YAxis type="category" dataKey="name" width={56} tick={{ fontSize: 11 }} className="text-zinc-600 dark:text-zinc-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="inquiries" name="Inquiries" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="bookings" name="Bookings" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
