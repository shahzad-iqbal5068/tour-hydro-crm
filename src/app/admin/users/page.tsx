import type { Metadata } from "next";
import AdminUsersPageClient from "./AdminUsersPageClient";

export const metadata: Metadata = {
  title: "Admin Users | Hydro CRM",
  description:
    "Manage Hydro CRM users and roles including super admin, admin, manager, CEO and sales staff.",
};

export default function AdminUsersPage() {
  return <AdminUsersPageClient />;
}
