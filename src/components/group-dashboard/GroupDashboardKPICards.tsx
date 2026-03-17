"use client";

import type { KPIMetric } from "@/types/groupBookingDashboardData";
import {
  LayoutGrid,
  CalendarCheck2,
  CalendarX2,
  AlarmClock,
  MapPin,
  BadgeCheck,
  PhoneOff,
  Flame,
  type LucideIcon,
} from "lucide-react";

type GroupDashboardKPICardsProps = {
  metrics: KPIMetric[];
};

function getMetricIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (l.includes("total")) return LayoutGrid;
  if (l.includes("today")) return CalendarCheck2;
  if (l.includes("overdue")) return CalendarX2;
  if (l.includes("15")) return AlarmClock;
  if (l.includes("visit")) return MapPin;
  if (l.includes("confirmed")) return BadgeCheck;
  if (l.includes("cancel")) return PhoneOff;
  if (l.includes("high")) return Flame;
  return LayoutGrid;
}

export default function GroupDashboardKPICards({ metrics }: GroupDashboardKPICardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {m.label}
            </p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              {(() => {
                const Icon = getMetricIcon(m.label);
                return <Icon className="h-4 w-4 text-indigo-800" aria-hidden />;
              })()}
            </div>
          </div>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{m.value}</p>
        </div>
      ))}
    </div>
  );
}
