"use client";

import type { KPIMetric } from "@/data/groupBookingDashboardData";

type GroupDashboardKPICardsProps = {
  metrics: KPIMetric[];
};

export default function GroupDashboardKPICards({ metrics }: GroupDashboardKPICardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {m.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{m.value}</p>
        </div>
      ))}
    </div>
  );
}
