// "use client";

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useMemo,
//   useState,
//   type ReactNode,
// } from "react";
// import { useGroupDashboardLeads } from "@/hooks/api/useGroupDashboardLeads";
// import getUpcomingFollowUps from "@/components/ui/getUpcomingFollowUps";
// export type AppNotification = {
//   id: string;
//   title: string;
//   message?: string;
//   createdAt: number;
//   read?: boolean;
// };

// type NotificationsContextValue = {
//   notifications: AppNotification[];
//   unreadCount: number;
//   isPanelOpen: boolean;
//   openPanel: () => void;
//   closePanel: () => void;
//   togglePanel: () => void;
//   addNotification: (n: Omit<AppNotification, "id" | "createdAt">) => void;
//   removeNotification: (id: string) => void;
//   markRead: (id: string) => void;
//   clearAll: () => void;
// };

// const NotificationsContext = createContext<NotificationsContextValue | null>(null);

// function generateId(): string {
//   return `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
// }

// export function NotificationsProvider({ children }: { children: ReactNode }) {
//   const [notifications, setNotifications] = useState<AppNotification[]>([]);
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const { data } = useGroupDashboardLeads();

//   const unreadCount = useMemo(
//     () => notifications.filter((n) => !n.read).length,
//     [notifications]
//   );
  

//   const openPanel = useCallback(() => setIsPanelOpen(true), []);
//   const closePanel = useCallback(() => setIsPanelOpen(false), []);
//   const togglePanel = useCallback(() => setIsPanelOpen((o) => !o), []);

//   const addNotification = useCallback(
//     (n: Omit<AppNotification, "id" | "createdAt">) => {
//       const newOne: AppNotification = {
//         ...n,
//         id: generateId(),
//         createdAt: Date.now(),
//         read: false,
//       };
//       setNotifications((prev) => [newOne, ...prev]);
//       setIsPanelOpen(true);
//     },
//     []
//   );

//   const removeNotification = useCallback((id: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   }, []);

//   const markRead = useCallback((id: string) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   }, []);

//   const clearAll = useCallback(() => setNotifications([]), []);

//   const value = useMemo<NotificationsContextValue>(
//     () => ({
//       notifications,
//       unreadCount,
//       isPanelOpen,
//       openPanel,
//       closePanel,
//       togglePanel,
//       addNotification,
//       removeNotification,
//       markRead,
//       clearAll,
//     }),
//     [
//       notifications,
//       unreadCount,
//       isPanelOpen,
//       openPanel,
//       closePanel,
//       togglePanel,
//       addNotification,
//       removeNotification,
//       markRead,
//       clearAll,
//     ]
//   );

//   return (
//     <NotificationsContext.Provider value={value}>
//       {children}
//     </NotificationsContext.Provider>
//   );
// }

// export function useNotifications(): NotificationsContextValue {
//   const ctx = useContext(NotificationsContext);
//   if (!ctx) {
//     throw new Error("useNotifications must be used within NotificationsProvider");
//   }
//   return ctx;
// }


"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { useGroupDashboardLeads } from "@/hooks/api/useGroupDashboardLeads";
import getUpcomingFollowUps from "@/components/ui/getUpcomingFollowUps";

export type AppNotification = {
  id: string;
  title: string;
  message?: string;
  createdAt: number;
  read?: boolean;
};

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt">) => void;
  removeNotification: (id: string) => void;
  markRead: (id: string) => void;
  clearAll: () => void;
};

const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);

function generateId() {
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function NotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
   const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { data } = useGroupDashboardLeads();

  const prevCountRef = useRef(0);

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt">) => {
      setNotifications((prev) => [
        { ...n, id: generateId(), createdAt: Date.now(), read: false },
        ...prev,
      ]);
      setIsPanelOpen(true);
    },
    []
  );
  const handleFollowUpsChange = useCallback(
    (next: number) => {
      setNotifications((prev) => [
        {
          id: generateId(),
          title: "Follow-ups due",
          message:
            next === 1
              ? "1 follow-up due in next 3 days"
              : `${next} follow-ups due in next 3 days`,
          createdAt: Date.now(),
          read: false,
        },
        ...prev,
      ]);
  
      setIsPanelOpen(true);
    },
    []
  );
  // 🔔 GLOBAL FOLLOW-UP CHECK
  
  useEffect(() => {
    if (!data) return;
  
    const followUps = getUpcomingFollowUps(data);
  
    const prev = prevCountRef.current;
    const next = followUps.length;
  
    prevCountRef.current = next;
  
    if (prev === 0 && next > 0) {
      handleFollowUpsChange(next);
    }
  }, [data, handleFollowUpsChange]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);
  const togglePanel = useCallback(
    () => setIsPanelOpen((prev) => !prev),
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel,
      addNotification,
      removeNotification,
      markRead,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel,
      addNotification,
      removeNotification,
      markRead,
      clearAll,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside provider");
  }
  return ctx;
}