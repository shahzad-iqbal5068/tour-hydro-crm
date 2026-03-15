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
