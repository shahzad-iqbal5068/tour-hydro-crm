/**
 * Ensure image URL is absolute and uses HTTPS so it loads on any device (e.g. other laptops, different origins).
 */
export function ensureImageUrl(url: string | undefined | null): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("http://")) return trimmed.replace(/^http:\/\//i, "https://");
  if (trimmed.startsWith("https://")) return trimmed;
  return undefined;
}
