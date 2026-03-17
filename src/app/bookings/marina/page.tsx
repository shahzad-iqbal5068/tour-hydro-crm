import type { Metadata } from "next";
import BookingClient from "@/components/bookings/BookingClient";
import { MARINA_VARIANTS } from "@/types/bookingVariants";

export const metadata: Metadata = {
  title: "Marina Bookings | Hydro CRM",
  description: "Manage Marina cruise bookings: Heaven on Sea and Boonmax Carnival.",
};

export default function MarinaBookingsPage() {
  return <BookingClient variants={MARINA_VARIANTS} />;
}

