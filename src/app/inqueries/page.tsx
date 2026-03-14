import type { Metadata } from "next";
import { Suspense } from "react";
import TablePageClient from "./TablePageClient";
import { Loader } from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "Bookings Table | Hydro CRM",
  description:
    "View, filter, search and print all tourist cruise bookings and WhatsApp inquiries.",
};

export default function TablePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <Loader block size="lg" label="Loading…" />
        </div>
      }
    >
      <TablePageClient />
    </Suspense>
  );
}
