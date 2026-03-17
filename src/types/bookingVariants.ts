import type { BookingVariantOption } from "@/types/booking";

/** Canal: 3 Star and 4–5 Star */
export const CANAL_VARIANTS: BookingVariantOption[] = [
  { value: "4-5", label: "4–5 Star" },
  { value: "3", label: "3 Star" },
];

/** Marina: Heaven on Sea, Boonmax Carnival */
export const MARINA_VARIANTS: BookingVariantOption[] = [
  { value: "heaven-on-sea", label: "Heaven" },
  { value: "boonmax-carnival", label: "Carnival" },
];

/** Creek: Rustar, Najom */
export const CREEK_VARIANTS: BookingVariantOption[] = [
  { value: "rustar", label: "Rustar" },
  { value: "najom", label: "Najom" },
];
