"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import AppShell from "./AppShell";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <NotificationsProvider>
        <AppShell>{children}</AppShell>
      </NotificationsProvider>
    </QueryProvider>
  );
}
