import type { Metadata } from "next";
import BookingClient from "@/components/bookings/BookingClient";

export const metadata: Metadata = {
  title: "3 Stars Booking | Hydro CRM",
  description:
    "Manage 3 star cruise bookings including time, pax, guest details and payments.",
};

export default function ThreeStarsBookingPage() {
  return <BookingClient variant="3" />;
}

