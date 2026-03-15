"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/QueryProvider";
import AppShell from "./AppShell";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AppShell>{children}</AppShell>
    </QueryProvider>
  );
}
