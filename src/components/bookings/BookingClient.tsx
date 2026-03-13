 "use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

type BookingVariant = "4-5" | "3";

type BookingRow = {
  _id: string;
  category: BookingVariant;
  time: string;
  pax: number;
  guestName: string;
  phone: string;
  collectionAmount: number;
  paid: number;
  balance: number;
  deck?: string;
  remarks?: string;
  callingRemarks?: string;
};

type BookingFormValues = {
  time: string;
  pax: number;
  guestName: string;
  phone: string;
  collection: number;
  paid: number;
  balance: number;
  deck: string;
  remarks: string;
  callingRemarks: string;
};

function makeEmptyValues(): BookingFormValues {
  return {
    time: "",
    pax: 1,
    guestName: "",
    phone: "",
    collection: 0,
    paid: 0,
    balance: 0,
    deck: "",
    remarks: "",
    callingRemarks: "",
  };
}

export default function BookingClient({ variant }: { variant: BookingVariant }) {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<BookingFormValues>({
    defaultValues: makeEmptyValues(),
  });

  const isEditing = Boolean(selectedId);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/star-bookings?category=${variant}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to load bookings");
        return;
      }
      setRows(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const handleEdit = (row: BookingRow) => {
    setSelectedId(row._id);
    reset({
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
    });
  };

  const handleNew = () => {
    setSelectedId(null);
    reset(makeEmptyValues());
  };

  const onSubmit = async (values: BookingFormValues) => {
    const payload = {
      category: variant,
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
    };

    try {
      const res = await fetch(
        selectedId ? `/api/star-bookings/${selectedId}` : "/api/star-bookings",
        {
          method: selectedId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to save booking");
        return;
      }

      toast.success(isEditing ? "Booking updated" : "Booking added");
      setSelectedId(null);
      reset(makeEmptyValues());
      void loadBookings();
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
      setDeleteLoading(true);
      const res = await fetch(`/api/star-bookings/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete booking");
        return;
      }
      toast.success("Booking deleted");
      setDeleteId(null);
      void loadBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
    } finally {
      setDeleteLoading(false);
    }
  };

  const title =
    variant === "4-5" ? "4–5 Stars Booking" : "3 Stars Booking";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <Toaster position="top-right" />

      {/* Table side */}
      <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Manage today&apos;s cruise bookings for this category.
            </p>
          </div>
          <button
            type="button"
            onClick={handleNew}
            className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
          >
            + New booking
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">Pax</th>
                <th className="px-2 py-2">Guest name</th>
                <th className="px-2 py-2">Number</th>
                <th className="px-2 py-2">Collection</th>
                <th className="px-2 py-2">Paid</th>
                <th className="px-2 py-2">Balance</th>
                <th className="px-2 py-2">Deck</th>
                <th className="hidden px-2 py-2 md:table-cell">
                  Remarks
                </th>
                <th className="hidden px-2 py-2 lg:table-cell">
                  Calling remarks
                </th>
                <th className="px-2 py-2 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-3 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-3 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <td className="whitespace-nowrap px-2 py-1.5 text-zinc-800 dark:text-zinc-100">
                      {row.time}
                    </td>
                    <td className="px-2 py-1.5 text-zinc-700 dark:text-zinc-200">
                      {row.pax}
                    </td>
                    <td className="px-2 py-1.5 font-medium text-zinc-900 dark:text-zinc-50">
                      {row.guestName}
                    </td>
                    <td className="px-2 py-1.5 text-zinc-700 dark:text-zinc-200">
                      {row.phone}
                    </td>
                    <td className="px-2 py-1.5 text-zinc-700 dark:text-zinc-200">
                      {row.collectionAmount ?? (row as { collection?: number }).collection ?? 0}
                    </td>
                    <td className="px-2 py-1.5 text-zinc-700 dark:text-zinc-200">
                      {row.paid}
                    </td>
                    <td className="px-2 py-1.5 text-zinc-700 dark:text-zinc-200">
                      {row.balance}
                    </td>
                    <td className="px-2 py-1.5 text-zinc-700 dark:text-zinc-200">
                      {row.deck || "—"}
                    </td>
                    <td className="hidden max-w-[140px] truncate px-2 py-1.5 text-zinc-600 dark:text-zinc-300 md:table-cell">
                      {row.remarks || "—"}
                    </td>
                    <td className="hidden max-w-[160px] truncate px-2 py-1.5 text-zinc-600 dark:text-zinc-300 lg:table-cell">
                      {row.callingRemarks || "—"}
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-[10px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
                        >
                          <Pencil className="h-3 w-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(row._id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form side */}
      <div className="w-full shrink-0 rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5 lg:max-w-sm">
        <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {isEditing ? "Edit booking" : "New booking"}
        </h2>
        <p className="mb-4 text-[11px] text-zinc-600 dark:text-zinc-400">
          Fill in booking time, guest details and payment information.
        </p>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Time
              </label>
              <input
                type="text"
                placeholder="6:00 PM"
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("time", { required: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Pax
              </label>
              <input
                type="number"
                min={1}
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("pax", { required: true, valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Guest name
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("guestName", { required: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Number
              </label>
              <input
                type="text"
                placeholder="05x xxx xxxx"
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("phone", { required: true })}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Collection
              </label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("collection", { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Paid
              </label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("paid", { required: true, valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Balance
              </label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("balance", { required: true, valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Deck
              </label>
              <input
                type="text"
                placeholder="Upper / Lower / VIP"
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("deck")}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
              Remarks
            </label>
            <textarea
              rows={2}
              className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              {...register("remarks")}
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
              Calling remarks
            </label>
            <textarea
              rows={2}
              className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              {...register("callingRemarks")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Submitting..."
                : isEditing
                  ? "Save changes"
                  : "Submit"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleNew}
                className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-lg dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
            <div className="mb-3">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Delete booking?
              </h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                This will permanently remove this booking from{" "}
                {variant === "4-5" ? "4–5 Stars" : "3 Stars"} list. You can&apos;t
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

