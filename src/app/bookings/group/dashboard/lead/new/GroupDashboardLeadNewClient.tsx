"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import GroupDashboardForm from "@/components/group-dashboard/GroupDashboardForm";
import { useGroupDashboardLeads, useUsersList } from "@/hooks/api";
import type { GroupDashboardFormValues } from "@/types/groupDashboard";

export default function GroupDashboardLeadNewClient() {
  const router = useRouter();
  const { createMutation } = useGroupDashboardLeads();
  const { data: users = [] } = useUsersList();

  const handleSubmit = async (values: GroupDashboardFormValues) => {
    const assignedName =
      values.assignedPerson &&
      users.find((u) => u.id === values.assignedPerson)?.name;
    try {
      await createMutation.mutateAsync({
        inquiryDate: values.inquiryDate || undefined,
        whatsapp: values.whatsapp,
        assignedAgent: assignedName || values.assignedPerson || undefined,
        confirmBookingDate: values.confirmBookingDate || undefined,
        customerName: values.customerName,
        contact: values.contact,
        numberOfPersons: values.numberOfPersons,
        cruiseName: values.cruiseName || undefined,
        slotTiming: values.slotTiming || undefined,
        location: values.location,
        groupNo: values.groupNo || undefined,
        bookingStatus: values.bookingStatus,
        lastFollowUpDate: values.lastFollowUpDate || undefined,
        remarks: values.remarks || undefined,
        callingDate: values.callingDate || undefined,
        totalAmount: values.totalAmount,
        advancePaid: values.advancePaid,
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
