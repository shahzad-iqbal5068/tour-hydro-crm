import type { Metadata } from "next";
import NotificationCenter from "@/components/settings/NotificationCenter";

export const metadata: Metadata = {
  title: "Notification Center | Hydro CRM",
};

export default function NotificationSettingsPage() {
  return <NotificationCenter />;
}
 
