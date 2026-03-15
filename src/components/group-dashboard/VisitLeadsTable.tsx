"use client";

import type { VisitLeadRow } from "@/data/groupBookingDashboardData";

type VisitLeadsTableProps = {
  rows: VisitLeadRow[];
};

function statusClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("done") || s.includes("completed")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
  if (s.includes("today") || s.includes("coming")) return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
  if (s.includes("tomorrow")) return "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200";
  return "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200";
}

export default function VisitLeadsTable({ rows }: VisitLeadsTableProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Visit Leads</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <th className="px-3 py-2">Guest</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Visit Status</th>
              <th className="px-3 py-2">Reminder Status</th>
              <th className="px-3 py-2">Agent</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <td className="whitespace-nowrap px-3 py-2 font-medium">{r.guest}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.contact}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.location}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${statusClass(r.visitStatus)}`}>
                    {r.visitStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${statusClass(r.reminderStatus)}`}>
                    {r.reminderStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2">{r.agent}</td>
                <td className="max-w-[180px] truncate px-3 py-2">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
