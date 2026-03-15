/**
 * Geocoding (reverse) via OpenStreetMap Nominatim. Used for attendance location display.
 */

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "en",
      "User-Agent": "HydroCRM-Attendance/1.0",
    },
  });
  if (!res.ok) return "";
  const data = (await res.json()) as { display_name?: string };
  return data.display_name?.trim() ?? "";
}
