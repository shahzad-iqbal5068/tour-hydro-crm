import type { Metadata } from "next";
import FollowUpsClient from "./FollowUpsClient";

export const metadata: Metadata = {
  title: "Follow-ups | Tour Hydro CRM",
  description: "View and manage booking follow-ups, send WhatsApp messages, mark as done.",
};

export default function FollowUpsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <FollowUpsClient />
    </div>
  );
}
