"use client";

import { useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useStarBookings, useUsersList } from "@/hooks/api";
import { PageLoader } from "@/components/ui/PageLoader";
import type { BookingVariantOption } from "@/types/booking";
import { CANAL_VARIANTS } from "../../types/bookingVariants";
import BookingForm, { type BookingFormValues } from "./BookingForm";
import BookingTable, { type BookingTableRow } from "./BookingTable";

function mapRowToFormValues(row: BookingTableRow): BookingFormValues {
  const rowDate = row.date ?? (row as { createdAt?: string }).createdAt;
  return {
    date: rowDate ? new Date(rowDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    time: row.time,
    pax: row.pax,
    guestName: row.guestName,
    phone: row.phone,
    collection: row.collectionAmount ?? (row as { collection?: number }).collection ?? 0,
    paid: row.paid,
    balance: row.balance,
    deck: row.deck || "",
    remarks: row.remarks || "",
    callingRemarks: row.callingRemarks || "",
    followUpDate: row.followUpDate ? new Date(row.followUpDate).toISOString().slice(0, 10) : "",
    followUpNote: row.followUpNote || "",
    userId: row.userId || "",
  };
}

export default function BookingClient({
  variants = CANAL_VARIANTS,
  initialVariant,
}: {
  /** Variant options for this location (Canal, Marina, Creek). Defaults to Canal (3 Star, 4–5 Star). */
  variants?: BookingVariantOption[];
  /** Initial view filter (variant value or "all"). Defaults to first variant. */
  initialVariant?: string;
}) {
  const categoryValues = variants.map((v) => v.value);
  const [viewFilter, setViewFilter] = useState<string>(initialVariant ?? (categoryValues[0] ?? "all"));
  const [formCategory, setFormCategory] = useState<string>(initialVariant ?? categoryValues[0] ?? "4-5");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: rows,
    isLoading: loading,
    createMutation,
    updateMutation,
    deleteMutation,
    followUpDoneMutation,
  } = useStarBookings(categoryValues);
  const { data: users = [] } = useUsersList();
  const deleteLoading = deleteMutation.isPending;
  const followUpDoneId = followUpDoneMutation.isPending ? followUpDoneMutation.variables ?? null : null;

  const isEditing = Boolean(selectedId);
  const formInitialValues = useMemo(() => {
    if (!selectedId) return null;
    const row = rows.find((r) => r._id === selectedId);
    return row ? mapRowToFormValues(row) : null;
  }, [selectedId, rows]);

  const handleEdit = (row: BookingTableRow) => {
    setSelectedId(row._id);
    setFormCategory(row.category);
    setViewFilter(row.category);
  };

  const handleNew = () => {
    setSelectedId(null);
    setFormCategory(viewFilter === "all" ? categoryValues[0] ?? "4-5" : viewFilter);
  };

  const handleViewFilterChange = (filter: string) => {
    setViewFilter(filter);
    setFormCategory(filter === "all" ? categoryValues[0] ?? "4-5" : filter);
    handleNew();
  };

  const handleFormSubmit = async (values: BookingFormValues) => {
    const payload = {
      category: formCategory,
      date: values.date || undefined,
      time: values.time,
      pax: Number(values.pax) || 0,
      guestName: values.guestName,
      phone: values.phone,
      collectionAmount: Number(values.collection) || 0,
      paid: Number(values.paid) || 0,
      balance: Number(values.balance) || 0,
      deck: values.deck,
      remarks: values.remarks,
      callingRemarks: values.callingRemarks,
      followUpDate: values.followUpDate || undefined,
      followUpNote: values.followUpNote || undefined,
      userId: values.userId || undefined,
    };

    try {
      if (selectedId) {
        await updateMutation.mutateAsync({ id: selectedId, body: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      toast.success(isEditing ? "Booking updated" : "Booking added");
      setSelectedId(null);
      setFormCategory(viewFilter === "all" ? categoryValues[0] ?? "4-5" : viewFilter);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save booking");
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Booking deleted");
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
    }
  };

  const handleFollowUpDone = async (id: string) => {
    try {
      await followUpDoneMutation.mutateAsync(id);
      toast.success("Follow-up marked done");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark follow-up done");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <Toaster position="top-right" />
        <PageLoader message="Loading bookings…" fullScreen />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <Toaster position="top-right" />

      <BookingTable
        data={rows}
        isLoading={false}
        variants={variants}
        viewFilter={viewFilter}
        onViewFilterChange={handleViewFilterChange}
        onNewBooking={handleNew}
        onEdit={handleEdit}
        onDeleteClick={openDeleteModal}
        onFollowUpDone={handleFollowUpDone}
        followUpDoneId={followUpDoneId}
      />

      <BookingForm
        key={selectedId ?? "new"}
        initialValues={formInitialValues}
        variants={variants}
        formCategory={formCategory}
        onFormCategoryChange={setFormCategory}
        isEditing={isEditing}
        users={users}
        onSubmit={handleFormSubmit}
        onCancel={handleNew}
      />
      
      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-lg dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
            <div className="mb-3">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Delete booking?
              </h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                This will permanently remove this booking. You can&apos;t
                undo this action.
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
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

