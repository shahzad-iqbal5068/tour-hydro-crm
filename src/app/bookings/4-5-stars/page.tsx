import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "4–5 Stars Booking | Hydro CRM",
  description:
    "Manage 4–5 star cruise bookings including time, pax, guest details and payments.",
};

export default function FourFiveStarsBookingPage() {
  redirect("/bookings");
}

