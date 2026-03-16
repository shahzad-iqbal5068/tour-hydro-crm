// import type { Metadata } from "next";
// import GroupBookingClient from "@/components/bookings/GroupBookingClient";

// export const metadata: Metadata = {
//   title: "Group Bookings | Hydro CRM",
//   description:
//     "Manage group bookings: guest name, contact, cruise, number of pax, time slot, amounts and dates.",
// };

// export default function GroupBookingsPage() {
//   return <GroupBookingClient />;
// 

import type { Metadata } from "next";
import GroupBookingDashboardClient from "@/components/group-dashboard/GroupBookingDashboardClient";

export const metadata: Metadata = {
  title: "Group Booking Dashboard | Hydro CRM",
  description:
    "Control tower for group inquiry, follow-up, visit tracking, reminders and WhatsApp-wise booking management.",
};

export default function GroupBookingDashboardPage() {
  return <GroupBookingDashboardClient />;
}
