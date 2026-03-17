"use client";

import { useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString();
}

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isPanelOpen,
    togglePanel,
    closePanel,
    removeNotification,
    markRead,
    clearAll,
  } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPanelOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        closePanel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPanelOpen, closePanel]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={togglePanel}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 shadow-sm hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        aria-label={isPanelOpen ? "Close notifications" : "Open notifications"}
        aria-expanded={isPanelOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isPanelOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
              Notifications
            </span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                No notifications
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`group flex gap-2 px-3 py-2 text-left ${!n.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="mt-0.5 truncate text-[11px] text-zinc-600 dark:text-zinc-400">
                          {n.message}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                        {formatTime(n.createdAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        markRead(n.id);
                        removeNotification(n.id);
                      }}
                      className="shrink-0 rounded p-1 text-zinc-400 opacity-0 hover:bg-zinc-200 hover:text-zinc-700 group-hover:opacity-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                      aria-label="Dismiss"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
