"use client";

import { Clock } from "lucide-react";
import type { DueIn15Item } from "@/data/groupBookingDashboardData";

type DueIn15MinutesCardProps = {
  item: DueIn15Item;
};

export default function DueIn15MinutesCard({ item }: DueIn15MinutesCardProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm dark:border-rose-800 dark:bg-rose-950/50">
      <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
        <Clock className="h-4 w-4" />
        <h3 className="text-xs font-semibold uppercase tracking-wide">Due In 15 Minutes</h3>
      </div>
      <dl className="mt-3 space-y-1.5 text-[11px]">
        <div>
          <dt className="text-rose-600 dark:text-rose-400">Guest</dt>
          <dd className="font-medium text-rose-900 dark:text-rose-100">{item.guestName}</dd>
        </div>
        <div>
          <dt className="text-rose-600 dark:text-rose-400">Location / Pax</dt>
          <dd className="text-rose-800 dark:text-rose-200">{item.locationAndPax}</dd>
        </div>
        <div>
          <dt className="text-rose-600 dark:text-rose-400">Time</dt>
          <dd className="text-rose-800 dark:text-rose-200">{item.time}</dd>
        </div>
        <div>
          <dt className="text-rose-600 dark:text-rose-400">Agent</dt>
          <dd className="text-rose-800 dark:text-rose-200">{item.agent}</dd>
        </div>
        <div>
          <dt className="text-rose-600 dark:text-rose-400">Popup Alert Status</dt>
          <dd className="text-rose-800 dark:text-rose-200">{item.popupStatus}</dd>
        </div>
      </dl>
    </div>
  );
}
