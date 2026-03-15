"use client";

import { useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import type { AlertItem } from "@/data/groupBookingDashboardData";
import { motion, AnimatePresence } from "framer-motion";

type GroupDashboardAlertsProps = {
  alerts: AlertItem[];
  onDismiss?: (id: string) => void;
};

/** Play notification sound once when alerts first appear. Uses public/sounds/notification.wav */
function usePlayNotificationWhenAlertsAppear(alerts: AlertItem[]) {
  const hasPlayedRef = useRef(false);
  const prevCountRef = useRef(0);

  useEffect(() => {
    const count = alerts.length;
    const hadAlerts = prevCountRef.current > 0;
    prevCountRef.current = count;

    if (count === 0) {
      hasPlayedRef.current = false;
      return;
    }

    // Play only when we go from 0 alerts to at least 1 (new alerts appeared)
    if (!hadAlerts && count > 0 && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      try {
        const audio = new Audio("/sounds/notification.wav");
        audio.volume = 0.7;
        audio.play().catch(() => {
          // Browsers often block autoplay until user interaction; ignore
        });
      } catch {
        // Ignore if file missing or playback fails
      }
    }
  }, [alerts.length]);
}

export default function GroupDashboardAlerts({
  alerts,
  onDismiss,
}: GroupDashboardAlertsProps) {
  usePlayNotificationWhenAlertsAppear(alerts);

  if (alerts.length === 0) return null;

  return (
    <div className="flex w-[320px] flex-col gap-3">
      <AnimatePresence>
        {alerts.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="relative flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs shadow-sm dark:border-rose-800 dark:bg-rose-950/60"
          >
            {/* Bell + Wave animation */}
            <div className="relative flex items-center justify-center">
              <motion.span
                className="absolute h-6 w-6 rounded-full border border-rose-400"
                animate={{
                  scale: [1, 2.2],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.span
                className="absolute h-6 w-6 rounded-full border border-rose-300"
                animate={{
                  scale: [1, 2.6],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.4,
                  ease: "easeOut",
                }}
              />
              <motion.div
                animate={{
                  rotate: [0, -12, 12, -10, 10, 0],
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <motion.div
                  animate={{
                    color: [
                      "#e11d48",
                      "#fb7185",
                      "#e11d48",
                    ],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                >
                  <Bell className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-rose-800 dark:text-rose-200">
                {a.title}
              </p>
              <p className="mt-1 text-rose-700 dark:text-rose-300">
                {a.message}
              </p>
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
