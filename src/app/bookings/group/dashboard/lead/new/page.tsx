import type { Metadata } from "next";
import GroupDashboardLeadNewClient from "./GroupDashboardLeadNewClient";

export const metadata: Metadata = {
  title: "Add Group Lead | Group Dashboard | Hydro CRM",
  description: "Add a new group lead for the Group Booking Control Tower.",
};

export default function GroupDashboardLeadNewPage() {
  return <GroupDashboardLeadNewClient />;
}
