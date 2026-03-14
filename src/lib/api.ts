/**
 * Base fetcher for API routes. Use with TanStack Query or standalone.
 * Throws on non-ok response with parsed message when possible.
 */
export async function apiFetcher<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { message?: string })?.message ?? "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export async function apiMutation<T = unknown>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  return apiFetcher<T>(url, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
