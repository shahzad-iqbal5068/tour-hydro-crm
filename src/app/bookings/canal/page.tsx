import type { Metadata } from "next";
import BookingClient from "@/components/bookings/BookingClient";
import { CANAL_VARIANTS } from "@/types/bookingVariants";

export const metadata: Metadata = {
  title: "Canal Bookings | Hydro CRM",
  description: "Manage Canal cruise bookings: 3 Star and 4–5 Star.",
};

export default function CanalBookingsPage() {
  return <BookingClient variants={CANAL_VARIANTS} />;
}

