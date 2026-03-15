"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import GroupDashboardForm from "@/components/group-dashboard/GroupDashboardForm";
import { useGroupDashboardLeads } from "@/hooks/api";
import type { GroupDashboardFormValues } from "@/types/groupDashboard";

export default function GroupDashboardLeadNewClient() {
  const router = useRouter();
  const { createMutation } = useGroupDashboardLeads();

  const handleSubmit = async (values: GroupDashboardFormValues) => {
    try {
      await createMutation.mutateAsync({
        dateAdded: values.dateAdded || undefined,
        whatsapp: values.whatsapp,
        customerName: values.customerName,
        phone: values.phone,
        groupSize: values.groupSize,
        location: values.location,
        travelDate: values.travelDate,
        bookingStatus: values.bookingStatus,
        lastFollowUpDate: values.lastFollowUpDate || undefined,
        nextFollowUpDate: values.nextFollowUpDate || undefined,
        nextFollowUpTime: values.nextFollowUpTime || undefined,
        followUpPriority: values.followUpPriority,
        assignedAgent: values.assignedAgent || undefined,
        updatedByEmail: values.updatedByEmail || undefined,
        reminderDone: values.reminderDone,
        reminderTriggered: values.reminderTriggered,
        popupAlertStatus: values.popupAlertStatus,
        reminderVisitStatus: values.reminderVisitStatus,
        visitStatus: values.visitStatus,
        notes: values.notes || undefined,
      });
      toast.success("Group lead saved. Redirecting to dashboard…");
      router.push("/bookings/group/dashboard");
    } catch {
      toast.error("Failed to save group lead");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Add Group Lead
          </h1>
          <Link
            href="/bookings/group/dashboard"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            ← Back to dashboard
          </Link>
        </div>
        <GroupDashboardForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/bookings/group/dashboard")}
        />
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
