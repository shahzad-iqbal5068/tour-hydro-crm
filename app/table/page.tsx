import type { Metadata } from "next";
import TablePageClient from "./TablePageClient";

export const metadata: Metadata = {
  title: "Bookings Table | Hydro CRM",
  description:
    "View, filter, search and print all tourist cruise bookings and WhatsApp inquiries.",
};

export default function TablePage() {
  return <TablePageClient />;
}
