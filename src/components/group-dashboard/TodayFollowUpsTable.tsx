"use client";

import type { MasterGroupRow } from "@/data/groupBookingDashboardData";

type TodayFollowUpsTableProps = {
  rows: MasterGroupRow[];
};

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export default function TodayFollowUpsTable({ rows }: TodayFollowUpsTableProps) {
 
  const filtered = rows.filter((r) => {
    // Not Done only
    if (r.bookingStatus?.toLowerCase() === "done") return false;
  
    // Use confirmBookingDate
    const d = daysUntil(r.confirmBookingDate);
  
    if (d === null) return false;
  
    return d >= 0 && d <= 3;
  });

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-[11px] text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        No follow-ups due in the next 3 days.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Today & Upcoming Follow Ups
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <th className="px-3 py-2">WhatsApp</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">No. of Persons</th>
              <th className="px-3 py-2">Group No.</th>
              <th className="px-3 py-2">Booking Status</th>
              <th className="px-3 py-2">Last Follow Up Date</th>
              <th className="px-3 py-2">Calling Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-amber-50/50 dark:hover:bg-amber-950/20"
              >
                <td className="whitespace-nowrap px-3 py-2 font-medium">{r.whatsapp}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.contact}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.numberOfPersons}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.groupNo}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.bookingStatus}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.lastFollowUpDate}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.callingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
