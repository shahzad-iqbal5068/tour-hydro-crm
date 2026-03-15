"use client";

import type { TodayFollowUpRow } from "@/data/groupBookingDashboardData";

type TodayFollowUpsTableProps = {
  rows: TodayFollowUpRow[];
};

export default function TodayFollowUpsTable({ rows }: TodayFollowUpsTableProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Today Follow Ups</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <th className="px-3 py-2">Guest</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Pax</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Follow Up Date</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Agent</th>
              <th className="px-3 py-2">Updated By Email</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-amber-50/50 dark:hover:bg-amber-950/20"
              >
                <td className="whitespace-nowrap px-3 py-2 font-medium">{r.guest}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.contact}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.pax}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.location}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.followUpDate}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.time}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.agent}</td>
                <td className="whitespace-nowrap px-3 py-2 text-zinc-500">{r.updatedByEmail}</td>
                <td className="max-w-[180px] truncate px-3 py-2">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
