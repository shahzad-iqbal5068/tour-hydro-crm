// import type { Metadata } from "next";
// import GroupBookingDashboardClient from "@/components/group-dashboard/GroupBookingDashboardClient";

// export const metadata: Metadata = {
//   title: "Group Booking Dashboard | Hydro CRM",
//   description:
//     "Control tower for group inquiry, follow-up, visit tracking, reminders and WhatsApp-wise booking management.",
// };

// export default function GroupBookingDashboardPage() {
//   return <GroupBookingDashboardClient />;
// }


import type { Metadata } from "next";
import GroupDashboardLeadNewClient from "./GroupDashboardLeadNewClient";

export const metadata: Metadata = {
  title: "Add Group Lead | Group Dashboard | Hydro CRM",
  description: "Add a new group lead for the Group Booking Control Tower.",
};

export default function GroupDashboardLeadNewPage() {
  return <GroupDashboardLeadNewClient />;
}
