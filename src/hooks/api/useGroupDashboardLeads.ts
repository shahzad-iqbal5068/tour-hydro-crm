"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetcher, apiMutation } from "@/lib/api";

export type GroupDashboardLeadRow = {
  _id: string;
  dateAdded?: string;
  whatsapp: string;
  customerName: string;
  phone: string;
  groupSize: number;
  location: string;
  travelDate: string;
  bookingStatus: string;
  visitReminderStatus?: string;
  reminderVisitStatus?: string;
  visitStatus?: string;
  lastFollowUpDate?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  followUpPriority?: string;
  assignedAgent?: string;
  updatedByEmail?: string;
  updateTimestamp?: string;
  reminderDone?: boolean;
  reminderTriggered?: boolean;
  popupAlertStatus?: string;
  notes?: string;
};

type GroupDashboardLeadsResponse = { data: GroupDashboardLeadRow[] };

export function useGroupDashboardLeads() {
  const [data, setData] = useState<GroupDashboardLeadRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await apiFetcher<GroupDashboardLeadsResponse>("/api/group-dashboard-leads");
      setData(res?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(() => fetchData(), [fetchData]);

  const createMutation = {
    mutateAsync: (body: Record<string, unknown>) =>
      apiMutation<GroupDashboardLeadRow>("/api/group-dashboard-leads", "POST", body).then(
        () => invalidate()
      ),
    isPending: false,
  };

  return {
    data,
    isLoading,
    error,
    invalidate,
    createMutation,
  };
}
