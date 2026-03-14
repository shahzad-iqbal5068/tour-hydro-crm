import type { Metadata } from "next";
import BookingClient from "@/components/bookings/BookingClient";

export const metadata: Metadata = {
  title: "Bookings | Hydro CRM",
  description:
    "Manage 4–5 star and 3 star cruise bookings: table + form with search, deck and date filters, sorting and pagination.",
};

/**
 * Bookings page: uses BookingClient which composes BookingTable (list, filters, actions)
 * and BookingForm (add/edit) in a single layout.
 */
export default function BookingsPage() {
  return <BookingClient />;
}

