"use client";

import type { ActivityItem } from "@/data/groupBookingDashboardData";

type LiveActivityMonitorProps = {
  activities: ActivityItem[];
};

export default function LiveActivityMonitor({ activities }: LiveActivityMonitorProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Live Activity Monitor
      </h3>
      <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
        Agent login tracking enabled
      </p>
      <ul className="mt-3 space-y-2">
        {activities.map((a) => (
          <li
            key={a.id}
            className="border-l-2 border-zinc-200 pl-2 text-[11px] dark:border-zinc-700"
          >
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{a.customerName}</span>
            <span className="text-zinc-500 dark:text-zinc-400"> · {a.dateTime}</span>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-300">{a.action}</p>
            {a.agent && (
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Agent: {a.agent}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
