import type { Metadata } from "next";
import BookingClient from "@/components/bookings/BookingClient";
import { CREEK_VARIANTS } from "@/types/bookingVariants";

export const metadata: Metadata = {
  title: "Creek Bookings | Hydro CRM",
  description: "Manage Creek cruise bookings: Rustar and Najom.",
};

export default function CreekBookingsPage() {
  return <BookingClient variants={CREEK_VARIANTS} />;
}

