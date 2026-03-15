/**
 * Booking types (star bookings, group bookings).
 */

/** Star booking category filter / form value */
export type StarBookingCategory = "4-5" | "3" | "all";

/** Star booking row from API (category = star tier or cruise/location variant) */
export type StarBookingRow = {
  _id: string;
  category: string;
  date?: string | null;
  time: string;
  pax: number;
  guestName: string;
  phone: string;
  collectionAmount: number;
  paid: number;
  balance: number;
  deck?: string;
  remarks?: string;
  callingRemarks?: string;
  followUpDate?: string | null;
  followUpSent?: boolean;
  followUpNote?: string | null;
};

/** Group booking row from API */
export type GroupBookingRow = {
  _id: string;
  groupBookingName: string;
  guestName: string;
  contactWhatsapp: string;
  groupsCount: number;
  cruiseName: string;
  numberOfPax: number;
  timeSlot: string;
  inquiryDate?: string | null;
  confirmDate?: string | null;
  bookingStatusRemarks?: string | null;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  callingDate?: string | null;
  remarks?: string | null;
};

/** Variant option for location-based booking tabs (Canal, Marina, Creek) */
export type BookingVariantOption = { value: string; label: string };
