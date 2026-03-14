import { QueryClient } from "@tanstack/react-query";

/**
 * Default staleTime: 60s — data stays fresh when navigating away/back (no refetch).
 * gcTime (cacheTime): 5 min — keep unused data in cache.
 * refetchOnWindowFocus: true — refetch when user returns to tab (optional; set false to rely only on cache).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min — consider data fresh, no refetch on remount
      gcTime: 5 * 60 * 1000, // 5 min — keep in cache after unmount
      refetchOnWindowFocus: false, // set true if you want refetch when tab focused
      retry: 1,
    },
  },
});
