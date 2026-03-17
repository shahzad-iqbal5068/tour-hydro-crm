"use client";

import type { MasterGroupRow } from "@/types/groupBookingDashboardData";
import { Badge } from "@/components/ui/Badge";

type GroupDashboardCalendarCardsProps = {
  rows: MasterGroupRow[];
};

function isTodayDate(dateStr: string): boolean {
  if (!dateStr || dateStr === "—") return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

function getBadge(row: MasterGroupRow): { label: string; variant: "today" | "due" | "none" } {
  const isToday =
    isTodayDate(row.lastFollowUpDate) ||
    isTodayDate(row.callingDate) ||
    isTodayDate(row.confirmBookingDate);
  if (isToday) return { label: "Today", variant: "today" };
  if (row.bookingStatus === "Not done") return { label: "Due in 15 min", variant: "due" };
  return { label: "", variant: "none" };
}

function cellVal(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export default function GroupDashboardCalendarCards({ rows }: GroupDashboardCalendarCardsProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        No follow-up entries to show. Add a group lead or select another tab.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
        Follow Up Calendar View
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => {
          const badge = getBadge(row);
          const cardBg =
            badge.variant === "today"
              ? "bg-amber-50 dark:bg-amber-950/30"
              : badge.variant === "due"
                ? "bg-rose-50 dark:bg-rose-950/30"
                : "bg-sky-50 dark:bg-sky-950/30";
          const badgeColor = badge.variant === "today" ? "warning" : badge.variant === "due" ? "error" : "neutral";
          return (
            <div
              key={row.id}
              className={`relative rounded-xl border border-zinc-200 p-4 shadow-sm dark:border-zinc-700 ${cardBg}`}
            >
              {badge.label ? (
                <Badge
                  color={badgeColor}
                  variant="filled"
                  className="absolute right-3 top-3"
                >
                  {badge.label}
                </Badge>
              ) : null}
              <p className="mb-2 pr-16 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {cellVal(row.customerName)}
              </p>
              <p className="mb-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                {cellVal(row.location)} • {cellVal(row.numberOfPersons)} pax
              </p>
              <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Time:</span> {cellVal(row.slotTiming)}
              </p>
              <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Assigned Agent:</span> {cellVal(row.assignedPerson)}
              </p>
              <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">WhatsApp:</span> {cellVal(row.whatsapp)}
              </p>
              <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Booking Status:</span> {cellVal(row.bookingStatus)}
              </p>
              {row.remarks ? (
                <p className="mt-2 text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {row.remarks}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
