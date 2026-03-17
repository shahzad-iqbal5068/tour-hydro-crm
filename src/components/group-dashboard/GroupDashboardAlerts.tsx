// "use client";

// import { useEffect, useRef } from "react";
// import { Bell, X } from "lucide-react";
// import type { AlertItem } from "@/data/groupBookingDashboardData";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNotifications } from "@/contexts/NotificationsContext";

// type GroupDashboardAlertsProps = {
//   alerts: AlertItem[];
//   onDismiss?: (id: string) => void;
// };

// /** Play notification sound and push to global notifications when alerts first appear. */
// function usePlayNotificationWhenAlertsAppear(alerts: AlertItem[]) {
//   const hasPlayedRef = useRef(false);
//   const prevCountRef = useRef(0);
//   const { addNotification } = useNotifications();

//   useEffect(() => {
//     const count = alerts.length;
//     const hadAlerts = prevCountRef.current > 0;
//     prevCountRef.current = count;

//     if (count === 0) {
//       hasPlayedRef.current = false;
//       return;
//     }

//     // When we go from 0 alerts to at least 1: sound + global notification (panel auto-opens)
//     if (!hadAlerts && count > 0 && !hasPlayedRef.current) {
//       hasPlayedRef.current = true;
//       addNotification({
//         title: "Group Dashboard alerts",
//         message: count === 1 ? "1 new alert" : `${count} new alerts`,
//       });
//       try {
//         const audio = new Audio("/sounds/notification.wav");
//         audio.volume = 0.7;
//         audio.play().catch(() => {});
//       } catch {
//         // Ignore if file missing or playback fails
//       }
//     }
//   }, [alerts.length, addNotification]);
// }

// export default function GroupDashboardAlerts({
//   alerts,
//   onDismiss,
// }: GroupDashboardAlertsProps) {
//   usePlayNotificationWhenAlertsAppear(alerts);

//   if (alerts.length === 0) return null;

//   return (
//     <div className="flex w-[320px] flex-col gap-3">
//       <AnimatePresence>
//         {alerts.map((a) => (
//           <motion.div
//             key={a.id}
//             initial={{ opacity: 0, y: -15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             transition={{ duration: 0.35 }}
//             className="relative flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs shadow-sm dark:border-rose-800 dark:bg-rose-950/60"
//           >
//             {/* Bell + Wave animation */}
//             <div className="relative flex items-center justify-center">
//               <motion.span
//                 className="absolute h-6 w-6 rounded-full border border-rose-400"
//                 animate={{
//                   scale: [1, 2.2],
//                   opacity: [0.6, 0],
//                 }}
//                 transition={{
//                   duration: 1.5,
//                   repeat: Infinity,
//                   ease: "easeOut",
//                 }}
//               />
//               <motion.span
//                 className="absolute h-6 w-6 rounded-full border border-rose-300"
//                 animate={{
//                   scale: [1, 2.6],
//                   opacity: [0.5, 0],
//                 }}
//                 transition={{
//                   duration: 1.5,
//                   repeat: Infinity,
//                   delay: 0.4,
//                   ease: "easeOut",
//                 }}
//               />
//               <motion.div
//                 animate={{
//                   rotate: [0, -12, 12, -10, 10, 0],
//                 }}
//                 transition={{
//                   duration: 0.9,
//                   repeat: Infinity,
//                   repeatDelay: 2,
//                 }}
//               >
//                 <motion.div
//                   animate={{
//                     color: [
//                       "#e11d48",
//                       "#fb7185",
//                       "#e11d48",
//                     ],
//                   }}
//                   transition={{
//                     duration: 1.2,
//                     repeat: Infinity,
//                   }}
//                 >
//                   <Bell className="h-4 w-4" />
//                 </motion.div>
//               </motion.div>
//             </div>

//             <div className="min-w-0 flex-1">
//               <p className="font-semibold text-rose-800 dark:text-rose-200">
//                 {a.title}
//               </p>
//               <p className="mt-1 text-rose-700 dark:text-rose-300">
//                 {a.message}
//               </p>
//             </div>

//             {onDismiss && (
//               <button
//                 type="button"
//                 onClick={() => onDismiss(a.id)}
//                 className="shrink-0 rounded-lg p-1 text-rose-600 hover:bg-rose-200 dark:text-rose-400 dark:hover:bg-rose-800"
//                 aria-label="Dismiss"
//               >
//                 <X className="h-3.5 w-3.5" />
//               </button>
//             )}
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X, Minus } from "lucide-react";
import type { AlertItem } from "@/types/groupBookingDashboardData";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/contexts/NotificationsContext";

type GroupDashboardAlertsProps = {
  alerts: AlertItem[];
  onDismiss?: (id: string) => void;
};

/** Play notification sound logic (Unchanged) */
function usePlayNotificationWhenAlertsAppear(alerts: AlertItem[]) {
  const hasPlayedRef = useRef(false);
  const prevCountRef = useRef(0);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const count = alerts.length;
    const hadAlerts = prevCountRef.current > 0;
    prevCountRef.current = count;

    if (count === 0) {
      hasPlayedRef.current = false;
      return;
    }

    if (!hadAlerts && count > 0 && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      addNotification({
        title: "Group Dashboard alerts",
        message: count === 1 ? "1 new alert" : `${count} new alerts`,
      });
      try {
        const audio = new Audio("/sounds/notification.wav");
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } catch { /* ignore */ }
    }
  }, [alerts.length, addNotification]);
}

export default function GroupDashboardAlerts({
  alerts,
  onDismiss,
}: GroupDashboardAlertsProps) {
  const [isOpen, setIsOpen] = useState(true); // Default to open, but can be toggled
  usePlayNotificationWhenAlertsAppear(alerts);

  if (alerts.length === 0) return null;

  return (
    <div className="relative flex flex-col items-end gap-3">
      {/* 1. COLLAPSED BELL BUTTON (Trigger) */}
      {!isOpen && (
        <motion.button
          layoutId="alert-wrapper"
          onClick={() => setIsOpen(true)}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-rose-200 text-white shadow-lg shadow-rose-200 dark:shadow-none"
        >
          <BellWave active={true} size="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-rose-600 shadow-sm">
            {alerts.length}
          </span>
        </motion.button>
      )}

      {/* 2. EXPANDED ALERTS LIST */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="alert-wrapper"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="flex w-[340px] flex-col gap-3 rounded-xl border border-rose-200 bg-white p-3 shadow-xl dark:border-rose-800 dark:bg-zinc-950"
          >
            {/* Header with Collapse Button */}
            <div className="flex items-center justify-between border-b border-rose-100 pb-2 dark:border-rose-900">
              <div className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-rose-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  Active Alerts ({alerts.length})
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-rose-50 p-1 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-900"
                aria-label="Collapse"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto">
              {alerts.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="relative flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs shadow-sm dark:border-rose-800 dark:bg-rose-950/60"
                >
                  <BellWave active={true} size="h-4 w-4" />

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
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Reusable Bell with the Wave Motion */
function BellWave({ size = "h-4 w-4", active = true }: { size?: string, active?: boolean }) {
  if (!active) return <Bell className={size} />;
  
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <motion.span
        className="absolute h-6 w-6 rounded-full border border-rose-400"
        animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute h-6 w-6 rounded-full border border-rose-300"
        animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, ease: "easeOut" }}
      />
      <motion.div
        animate={{ rotate: [0, -12, 12, -10, 10, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 2 }}
      >
        <motion.div
          animate={{ color: ["#e11d48", "#fb7185", "#e11d48"] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Bell className={size} />
        </motion.div>
      </motion.div>
    </div>
  );
}