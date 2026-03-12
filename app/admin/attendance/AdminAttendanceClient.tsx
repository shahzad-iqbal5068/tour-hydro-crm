"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import type { AttendanceRow, Role } from "@/types";

const ROLES: (Role | "ALL")[] = [
  "ALL",
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "CEO",
  "SALES_EXEC",
  "CALL_PERSON",
];

export default function AdminAttendanceClient() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string>("");
  const [role, setRole] = useState<"ALL" | Role>("ALL");
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (date) {
        params.set("date", date);
      } else {
        params.set("month", String(month));
        params.set("year", String(year));
      }
      if (role !== "ALL") params.set("role", role);
      const res = await fetch(`/api/attendance?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to load attendance");
        return;
      }
      setRows(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const computeDuration = (row: AttendanceRow) => {
    if (!row.checkInAt || !row.checkOutAt) return "—";
    const start = new Date(row.checkInAt).getTime();
    const end = new Date(row.checkOutAt).getTime();
    const diffMs = Math.max(0, end - start);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="mx-auto max-w-6xl rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <Toaster position="top-right" />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Attendance overview
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            See attendance times and photos for all team members.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAttendance}
          className="self-start rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            Specific date (optional)
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i, 1).toLocaleString(undefined, {
                  month: "short",
                })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value) || year)}
            className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "ALL" | Role)}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === "ALL" ? "All roles" : r.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={loadAttendance}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Apply filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Name</th>
              <th className="hidden px-3 py-2 sm:table-cell">Role</th>
              <th className="px-3 py-2">In</th>
              <th className="px-3 py-2">Out</th>
              <th className="hidden px-3 py-2 md:table-cell">Duration</th>
              <th className="hidden px-3 py-2 lg:table-cell">Location</th>
              <th className="px-3 py-2 text-right">Photo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  Loading attendance...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No records.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <td className="px-3 py-2 text-zinc-800 dark:text-zinc-100">
                    {row.date}
                  </td>
                  <td className="px-3 py-2 font-medium text-zinc-900 dark:text-zinc-50">
                    {row.name}
                  </td>
                  <td className="hidden px-3 py-2 text-zinc-700 dark:text-zinc-200 sm:table-cell">
                    {row.role.replace("_", " ")}
                  </td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-200">
                    {formatTime(row.checkInAt)}
                  </td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-200">
                    {formatTime(row.checkOutAt)}
                  </td>
                  <td className="hidden px-3 py-2 text-zinc-700 dark:text-zinc-200 md:table-cell">
                    {computeDuration(row)}
                  </td>
                  <td className="hidden max-w-[140px] truncate px-3 py-2 text-zinc-600 dark:text-zinc-300 lg:table-cell">
                    {row.location || "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {row.photoUrl ? (
                      <a
                        href={row.photoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-md border border-zinc-300 px-2 py-1 text-[11px] text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-[11px] text-zinc-400">No photo</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

