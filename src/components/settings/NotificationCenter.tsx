"use client";

import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts/NotificationsContext";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000)
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  return d.toLocaleString();
}

export default function NotificationCenter() {
  const router = useRouter();
  const { notifications, markRead, clearAll } = useNotifications();

  const hasNotifications = notifications.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Notifications
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            See all notification history and jump to the dashboard.
          </p>
        </div>
        {hasNotifications && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Clear all
          </button>
        )}
      </header>

      <section className="rounded-lg border border-zinc-200 bg-white text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <span>Recent notifications</span>
          <button
            type="button"
            onClick={() => router.push("/bookings/group")}
            className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Go to Group Dashboard
          </button>
        </div>

        {!hasNotifications ? (
          <div className="px-4 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            No notifications yet. Upcoming follow-ups and alerts will appear
            here.
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            <table className="min-w-full border-t border-zinc-100 text-[11px] dark:border-zinc-800">
              <thead>
                <tr className="bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Message</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr
                    key={n.id}
                    className={`border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 ${
                      !n.read ? "bg-blue-50/40 dark:bg-blue-950/10" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-zinc-900 dark:text-zinc-100">
                      {n.title}
                    </td>
                    <td className="max-w-xs px-3 py-2 text-zinc-600 dark:text-zinc-300">
                      {n.message ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-zinc-500 dark:text-zinc-400">
                      {formatTime(n.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          n.read
                            ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        }`}
                      >
                        {n.read ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          markRead(n.id);
                          router.push("/bookings/group");
                        }}
                        className="rounded-md border border-zinc-300 px-2 py-1 text-[10px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      >
                        View in dashboard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

