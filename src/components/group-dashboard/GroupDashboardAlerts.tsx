"use client";

import { X } from "lucide-react";
import type { AlertItem } from "@/data/groupBookingDashboardData";

type GroupDashboardAlertsProps = {
  alerts: AlertItem[];
  onDismiss?: (id: string) => void;
};

export default function GroupDashboardAlerts({ alerts, onDismiss }: GroupDashboardAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {alerts.map((a) => (
        <div
          key={a.id}
          className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs shadow-sm dark:border-rose-800 dark:bg-rose-950/50"
        >
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-rose-800 dark:text-rose-200">{a.title}</p>
            <p className="mt-1 text-rose-700 dark:text-rose-300">{a.message}</p>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(a.id)}
              className="shrink-0 rounded-lg p-1 text-rose-600 hover:bg-rose-200 dark:text-rose-400 dark:hover:bg-rose-800"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
