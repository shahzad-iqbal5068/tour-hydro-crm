import type { Metadata } from "next";
import AgentBookingClient from "@/components/bookings/AgentBookingClient";

export const metadata: Metadata = {
  title: "Agent bookings | Hydro CRM",
  description:
    "Track agent bookings with customer, cruise, payment, B2B and commission details.",
};

export default function AgentBookingsPage() {
  return <AgentBookingClient />;
}

