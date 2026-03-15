"use client";

import { useState } from "react";
import type { MasterGroupRow } from "@/data/groupBookingDashboardData";
import {
  STATUS_FILTER_OPTIONS,
  VISIT_REMINDER_OPTIONS,
} from "@/data/groupBookingDashboardData";

type MasterGroupBookingTableProps = {
  rows: MasterGroupRow[];
};

const filterSelectClass =
  "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500";
const filterInputClass =
  "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500";

export default function MasterGroupBookingTable({ rows }: MasterGroupBookingTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [locationFilter, setLocationFilter] = useState("all");
  const [waFilter, setWaFilter] = useState("all");
  const [visitReminderFilter, setVisitReminderFilter] = useState("All Visit / Reminder");

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.customerName.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.whatsapp.toLowerCase().includes(q) ||
      r.bookingStatus.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All Statuses" || r.bookingStatus === statusFilter;
    const matchLocation = locationFilter === "all" || r.location === locationFilter;
    const matchWa = waFilter === "all" || r.whatsapp === waFilter;
    const matchVisitReminder =
      visitReminderFilter === "All Visit / Reminder" ||
      (r.visitReminderStatus && r.visitReminderStatus === visitReminderFilter);
    return matchSearch && matchStatus && matchLocation && matchWa && matchVisitReminder;
  });

  const locations = [...new Set(rows.map((r) => r.location))].sort();
  const was = [...new Set(rows.map((r) => r.whatsapp))].sort();

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Title + full-width filter bar with consistent border and padding */}
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Master Group Booking Dashboard
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest, phone, location, WhatsApp, notes"
            className={`${filterInputClass} min-w-[200px] flex-1 max-w-md`}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={filterSelectClass}
          >
            {STATUS_FILTER_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className={filterSelectClass}
          >
            <option value="all">All Locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={waFilter}
            onChange={(e) => setWaFilter(e.target.value)}
            className={filterSelectClass}
          >
            <option value="all">All WA</option>
            {was.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          <select
            value={visitReminderFilter}
            onChange={(e) => setVisitReminderFilter(e.target.value)}
            className={filterSelectClass}
          >
            {VISIT_REMINDER_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <th className="px-4 py-3">Date Added</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Group Size</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Travel Date</th>
              <th className="px-4 py-3">Booking Status</th>
              <th className="px-4 py-3">Last Follow Up</th>
              <th className="px-4 py-3">Next Follow Up</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <td className="whitespace-nowrap px-4 py-3 text-zinc-700 dark:text-zinc-200">
                  {r.dateAdded}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{r.whatsapp}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium">{r.customerName}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.phone}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.groupSize}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.location}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.travelDate}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-block rounded-lg border px-2 py-0.5 text-[10px] font-medium ${
                      r.bookingStatus === "Confirmed"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                        : r.bookingStatus === "No Reply" || r.bookingStatus === "Lost" || r.bookingStatus === "Cancelled"
                          ? "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                          : r.bookingStatus === "New Inquiry"
                            ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-200"
                            : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                    }`}
                  >
                    {r.bookingStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{r.lastFollowUpDate}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.nextFollowUpDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
