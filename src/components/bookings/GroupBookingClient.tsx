"use client";

import { useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useGroupBookings } from "@/hooks/api";
import { PageLoader } from "@/components/ui/PageLoader";
import GroupBookingForm, {
  getDefaultGroupBookingFormValues,
  type GroupBookingFormValues,
} from "./GroupBookingForm";
import GroupBookingTable from "./GroupBookingTable";
import type { GroupBookingRow } from "@/hooks/api";

function mapRowToFormValues(row: GroupBookingRow): GroupBookingFormValues {
  return {
    groupBookingName: row.groupBookingName ?? "",
    guestName: row.guestName ?? "",
    contactWhatsapp: row.contactWhatsapp ?? "",
    groupsCount: row.groupsCount ?? 1,
    cruiseName: row.cruiseName ?? "",
    numberOfPax: row.numberOfPax ?? 0,
    timeSlot: row.timeSlot ?? "",
    inquiryDate: row.inquiryDate ? new Date(row.inquiryDate).toISOString().slice(0, 10) : "",
    confirmDate: row.confirmDate ? new Date(row.confirmDate).toISOString().slice(0, 10) : "",
    bookingStatusRemarks: row.bookingStatusRemarks ?? "",
    totalAmount: row.totalAmount ?? 0,
    advancePaid: row.advancePaid ?? 0,
    remainingAmount: row.remainingAmount ?? 0,
    callingDate: row.callingDate ? new Date(row.callingDate).toISOString().slice(0, 10) : "",
    remarks: row.remarks ?? "",
  };
}

export default function GroupBookingClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: rows,
    isLoading: loading,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useGroupBookings();

  const deleteLoading = deleteMutation.isPending;
  const isEditing = Boolean(selectedId);
  const formInitialValues = useMemo(() => {
    if (!selectedId) return null;
    const row = rows.find((r) => r._id === selectedId);
    return row ? mapRowToFormValues(row) : null;
  }, [selectedId, rows]);

  const handleEdit = (row: GroupBookingRow) => {
    setSelectedId(row._id);
  };

  const handleNew = () => {
    setSelectedId(null);
  };

  const handleFormSubmit = async (values: GroupBookingFormValues) => {
    const payload = {
      groupBookingName: values.groupBookingName,
      guestName: values.guestName,
      contactWhatsapp: values.contactWhatsapp,
      groupsCount: values.groupsCount,
      cruiseName: values.cruiseName,
      numberOfPax: values.numberOfPax,
      timeSlot: values.timeSlot,
      inquiryDate: values.inquiryDate || undefined,
      confirmDate: values.confirmDate || undefined,
      bookingStatusRemarks: values.bookingStatusRemarks || undefined,
      totalAmount: values.totalAmount,
      advancePaid: values.advancePaid,
      remainingAmount: values.remainingAmount,
      callingDate: values.callingDate || undefined,
      remarks: values.remarks || undefined,
    };

    try {
      if (selectedId) {
        await updateMutation.mutateAsync({ id: selectedId, body: payload });
        toast.success("Group booking updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Group booking added");
      }
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save group booking");
    }
  };

  const openDeleteModal = (id: string) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Group booking deleted");
      setDeleteId(null);
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete group booking");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <Toaster position="top-right" />
        <PageLoader message="Loading group bookings…" fullScreen />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
      <Toaster position="top-right" />

      <GroupBookingTable
        data={rows}
        isLoading={false}
        onNewBooking={handleNew}
        onEdit={handleEdit}
        onDeleteClick={openDeleteModal}
      />

      <GroupBookingForm
        key={selectedId ?? "new"}
        initialValues={formInitialValues}
        isEditing={isEditing}
        onSubmit={handleFormSubmit}
        onCancel={handleNew}
      />

      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-lg dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
            <div className="mb-3">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Delete group booking?
              </h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                This will permanently remove this group booking. You can&apos;t undo this action.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="rounded-md bg-red-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
