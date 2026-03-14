import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "3 Stars Booking | Hydro CRM",
  description:
    "Manage 3 star cruise bookings including time, pax, guest details and payments.",
};

export default function ThreeStarsBookingPage() {
  redirect("/bookings");
}

