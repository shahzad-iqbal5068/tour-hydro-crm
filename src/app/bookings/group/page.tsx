import type { Metadata } from "next";
import GroupBookingClient from "@/components/bookings/GroupBookingClient";

export const metadata: Metadata = {
  title: "Group Bookings | Hydro CRM",
  description:
    "Manage group bookings: guest name, contact, cruise, number of pax, time slot, amounts and dates.",
};

export default function GroupBookingsPage() {
  return <GroupBookingClient />;
}
