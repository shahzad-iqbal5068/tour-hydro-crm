"use client";

import type { MasterGroupRow } from "@/types/groupBookingDashboardData";
import getUpcomingFollowUps from "@/components/ui/getUpcomingFollowUps";
import { Toaster, toast } from "react-hot-toast";

type TodayFollowUpsTableProps = {
  rows: MasterGroupRow[];
};

export default function TodayFollowUpsTable({ rows }: TodayFollowUpsTableProps) {
  const filtered = getUpcomingFollowUps(rows);

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-[11px] text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        No follow-ups due in the next 3 days.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Toaster position="top-right" />
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
            {filtered.map((r) => {
              const statusLower = r.bookingStatus?.toLowerCase() ?? "";
              const isDone = statusLower === "done";
              const isNotDone = statusLower === "not done";

              const rowHighlight =
                isDone
                  ? "bg-emerald-50 dark:bg-emerald-950/20"
                  : isNotDone
                    ? "bg-rose-50 animate-pulse dark:bg-rose-950/30"
                    : "";

              return (
                <tr
                  key={r.id}
                  className={`border-b border-zinc-100 last:border-0 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 ${rowHighlight}`}
                >
                  <td className="whitespace-nowrap px-3 py-2 font-medium">
                    {r.whatsapp}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!r.contact) return;
                        navigator.clipboard
                          .writeText(String(r.contact))
                          .then(() => {
                            toast.success("Contact copied");
                          })
                          .catch(() => {
                            toast.error("Failed to copy");
                          });
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <span>{r.contact}</span>
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {r.numberOfPersons}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{r.groupNo}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {r.bookingStatus}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {r.lastFollowUpDate}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {r.callingDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
