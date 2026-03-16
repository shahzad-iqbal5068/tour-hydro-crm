"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import GroupDashboardForm, {
  getDefaultGroupDashboardFormValues,
} from "@/components/group-dashboard/GroupDashboardForm";
import { useGroupDashboardLeads, useUsersList } from "@/hooks/api";
import type {
  GroupDashboardFormValues,
  GroupDashboardLeadRow,
} from "@/types/groupDashboard";

function mapRowToFormValues(row: GroupDashboardLeadRow): GroupDashboardFormValues {
  const defaults = getDefaultGroupDashboardFormValues();
  return {
    inquiryDate: row.inquiryDate ?? row.dateAdded ?? defaults.inquiryDate,
    whatsapp: row.whatsapp as GroupDashboardFormValues["whatsapp"],
    assignedPerson: row.assignedPerson ?? "",
    confirmBookingDate: row.confirmBookingDate ?? "",
    customerName: row.customerName,
    contact: row.contact ?? row.phone,
    numberOfPersons: row.numberOfPersons ?? row.groupSize ?? 0,
    cruiseName: row.cruiseName ?? "",
    slotTiming: row.slotTiming ?? "",
    location: row.location as GroupDashboardFormValues["location"],
    groupNo: row.groupNo ?? "",
    bookingStatus: row.bookingStatus as GroupDashboardFormValues["bookingStatus"],
    lastFollowUpDate: row.lastFollowUpDate ?? "",
    remarks: row.remarks ?? row.notes ?? "",
    callingDate: row.callingDate ?? "",
    totalAmount: row.totalAmount ?? 0,
    advancePaid: row.advancePaid ?? 0,
    remainingAmount: row.remainingAmount ?? 0,
    updateTimestamp: row.updateTimestamp ?? "",
  };
}

export default function GroupDashboardLeadNewClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { data: leads, createMutation, updateMutation } = useGroupDashboardLeads();
  const { data: users = [] } = useUsersList();

  const editingRow = editId ? leads.find((l) => l._id === editId) ?? null : null;
  const initialValues = editingRow ? mapRowToFormValues(editingRow) : null;
  const isEditing = Boolean(editId && editingRow);

  const handleSubmit = async (values: GroupDashboardFormValues) => {
    const assignedName =
      values.assignedPerson &&
      users.find((u) => u.id === values.assignedPerson)?.name;

    const payload = {
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
    };

    try {
      if (isEditing && editId) {
        await updateMutation.mutateAsync({ id: editId, body: payload });
        toast.success("Group lead updated. Redirecting to dashboard…");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Group lead saved. Redirecting to dashboard…");
      }
      router.push("/bookings/group");
    } catch {
      toast.error("Failed to save group lead");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {isEditing ? "Edit Group Lead" : "Add Group Lead"}
          </h1>
          <Link
            href="/bookings/group/"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            ← Back to dashboard
          </Link>
        </div>
        <GroupDashboardForm
          initialValues={initialValues ?? undefined}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/bookings/group/")}
        />
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
