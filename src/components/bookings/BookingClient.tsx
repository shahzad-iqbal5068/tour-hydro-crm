 "use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Pencil, Trash2, Search, ArrowUpDown, MessageCircle, CheckCircle } from "lucide-react";
import { useStarBookings, useUsersList } from "@/hooks/api";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

type BookingVariant = "4-5" | "3";
type ViewFilter = "all" | "4-5" | "3";

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
  followUpDate?: string | null;
  followUpSent?: boolean;
  followUpNote?: string | null;
  userId?: string | null;
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
  followUpDate: string;
  followUpNote: string;
  userId: string;
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
    followUpDate: "",
    followUpNote: "",
    userId: "",
  };
}

const TIME_PRESETS = [
  "4:30 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
] as const;

const DECK_PRESETS = ["Upper deck", "Lower deck"] as const;

const CALLING_REMARKS_PRESETS = [
  "Coming",
  "N/A",
  "No",
  "Not working",
  "Line busy",
  "Not confirm",
  "Plan change",
  "Booked with other company",
  "Not sure",
] as const;

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export default function BookingClient({
  initialVariant = "4-5",
}: {
  initialVariant?: BookingVariant;
}) {
  const [viewFilter, setViewFilter] = useState<ViewFilter>(initialVariant);
  const [formCategory, setFormCategory] = useState<BookingVariant>("4-5");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: rows,
    isLoading: loading,
    createMutation,
    updateMutation,
    deleteMutation,
    followUpDoneMutation,
  } = useStarBookings(viewFilter === "all" ? "all" : viewFilter);
  const { data: users = [] } = useUsersList();
  const deleteLoading = deleteMutation.isPending;
  const followUpDoneId = followUpDoneMutation.isPending ? followUpDoneMutation.variables ?? null : null;
  const [globalQuery, setGlobalQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [timeMode, setTimeMode] = useState<"preset" | "custom">("preset");
  const [timePreset, setTimePreset] = useState<string>("");
  const [callingMode, setCallingMode] = useState<"preset" | "custom">("preset");
  const [callingPreset, setCallingPreset] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<BookingFormValues>({
    defaultValues: makeEmptyValues(),
  });

  const isEditing = Boolean(selectedId);

  const handleEdit = (row: BookingRow) => {
    setSelectedId(row._id);
    setFormCategory(row.category);
    setViewFilter(row.category);
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
      followUpDate: row.followUpDate ? new Date(row.followUpDate).toISOString().slice(0, 10) : "",
      followUpNote: row.followUpNote || "",
      userId: row.userId || "",
    });
    if (TIME_PRESETS.includes(row.time as (typeof TIME_PRESETS)[number])) {
      setTimeMode("preset");
      setTimePreset(row.time);
    } else {
      setTimeMode("custom");
      setTimePreset("");
    }
    if (CALLING_REMARKS_PRESETS.includes((row.callingRemarks || "") as (typeof CALLING_REMARKS_PRESETS)[number])) {
      setCallingMode("preset");
      setCallingPreset(row.callingRemarks || "");
    } else {
      setCallingMode("custom");
      setCallingPreset("");
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    reset(makeEmptyValues());
    setFormCategory(viewFilter === "3" ? "3" : "4-5");
    setTimeMode("preset");
    setTimePreset("");
    setCallingMode("preset");
    setCallingPreset("");
    setFormCategory(viewFilter === "3" ? "3" : "4-5");
  };

  const onSubmit = async (values: BookingFormValues) => {
    const payload = {
      category: formCategory,
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
      reset(makeEmptyValues());
      setFormCategory(viewFilter === "all" ? "4-5" : viewFilter);
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

  const whatsappNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) return "971" + digits.slice(1);
    return digits || "971";
  };

  const columns = useMemo<ColumnDef<BookingRow>[]>(
    () => [
      ...(viewFilter === "all"
        ? [
            {
              accessorKey: "category" as const,
              header: "Category",
              cell: ({ row }: { row: { original: BookingRow } }) => (
                <span className="text-zinc-700 dark:text-zinc-200">
                  {row.original.category === "4-5" ? "4–5 Star" : "3 Star"}
                </span>
              ),
            } as ColumnDef<BookingRow>,
          ]
        : []),
      {
        accessorKey: "time",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1"
          >
            Time <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-zinc-800 dark:text-zinc-100">
            {row.original.time}
          </span>
        ),
      },
      { accessorKey: "pax", header: "Pax" },
      { accessorKey: "guestName", header: "Guest name" },
      { accessorKey: "phone", header: "Number" },
      {
        id: "collectionAmount",
        header: "Collection",
        accessorFn: (r) => r.collectionAmount ?? (r as { collection?: number }).collection ?? 0,
      },
      { accessorKey: "paid", header: "Paid" },
      { accessorKey: "balance", header: "Balance" },
      { accessorKey: "deck", header: "Deck" },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ row }) => (
          <span className="block max-w-[180px] truncate text-zinc-600 dark:text-zinc-300">
            {row.original.remarks || "—"}
          </span>
        ),
      },
      {
        accessorKey: "callingRemarks",
        header: "Calling remarks",
        cell: ({ row }) => (
          <span className="block max-w-[180px] truncate text-zinc-600 dark:text-zinc-300">
            {row.original.callingRemarks || "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="block text-right">Actions</span>,
        cell: ({ row }) => {
          const r = row.original;
          const hasFollowUp = r.followUpDate && !r.followUpSent;
          const waText = encodeURIComponent(
            `Hello ${r.guestName}, just following up about your booking`
          );
          return (
            <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
              <a
                href={`https://wa.me/${whatsappNumber(r.phone)}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-emerald-400 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-800 hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200 dark:hover:bg-emerald-900/50"
              >
                <MessageCircle className="h-3 w-3" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              {hasFollowUp && (
                <button
                  type="button"
                  onClick={() => handleFollowUpDone(r._id)}
                  disabled={followUpDoneId === r._id}
                  className="inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-800 hover:bg-blue-100 disabled:opacity-60 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-900/50"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {followUpDoneId === r._id ? "..." : "Follow up done"}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleEdit(r)}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-[10px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <Pencil className="h-3 w-3" />
                {/* <span className="hidden sm:inline">Edit</span> */}
              </button>
              <button
                type="button"
                onClick={() => openDeleteModal(r._id)}
                className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
              >
                <Trash2 className="h-3 w-3" />
                {/* <span className="hidden sm:inline">Delete</span> */}
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewFilter, rows, followUpDoneId]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter: globalQuery, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalQuery,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = normalizeText(filterValue).toLowerCase();
      if (!q) return true;
      const r = row.original;
      const hay = [
        r.category,
        r.time,
        r.guestName,
        r.phone,
        r.deck || "",
        r.remarks || "",
        r.callingRemarks || "",
        String(r.pax ?? ""),
        String(r.collectionAmount ?? ""),
        String(r.paid ?? ""),
        String(r.balance ?? ""),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <Toaster position="top-right" />

      {/* Table side */}
      <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Bookings
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Manage 4–5 Star and 3 Star cruise bookings (add, edit, delete).
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => {
                  setViewFilter("all");
                  setFormCategory("4-5");
                  handleNew();
                }}
                className={`rounded px-3 py-1.5 text-[11px] font-medium ${
                  viewFilter === "all"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewFilter("4-5");
                  setFormCategory("4-5");
                  handleNew();
                }}
                className={`rounded px-3 py-1.5 text-[11px] font-medium ${
                  viewFilter === "4-5"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                }`}
              >
                4–5 Star
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewFilter("3");
                  setFormCategory("3");
                  handleNew();
                }}
                className={`rounded px-3 py-1.5 text-[11px] font-medium ${
                  viewFilter === "3"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                }`}
              >
                3 Star
              </button>
            </div>
            <button
              type="button"
              onClick={handleNew}
              className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
            >
              + New booking
            </button>
          </div>
        </div>

        <div className="mb-3 grid gap-2 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              placeholder="Search name, number, time, deck, remarks..."
              className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
            />
          </div>
          <select
            value={(table.getColumn("deck")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("deck")?.setFilterValue(e.target.value || undefined)
            }
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          >
            <option value="">All decks</option>
            {DECK_PRESETS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[11px]">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr
                  key={hg.id}
                  className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-2 py-2 ${
                        header.id === "actions" ? "text-right" : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={table.getAllColumns().length} className="px-3 py-8">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading bookings…</span>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="px-3 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    {r.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-2 py-1.5 text-zinc-700 dark:text-zinc-200 ${
                          cell.column.id === "actions" ? "text-right" : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span>{" "}
            of <span className="font-medium">{table.getPageCount()}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-md border border-zinc-300 px-3 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-md border border-zinc-300 px-3 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Next
            </button>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-[11px] text-zinc-800 outline-none dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
            >
              {[10, 20, 30, 50].map((s) => (
                <option key={s} value={s}>
                  {s} / page
                </option>
              ))}
            </select>
          </div>
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
        <div>
          <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
            Category
          </label>
          <select
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value as BookingVariant)}
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          >
            <option value="4-5">4–5 Star</option>
            <option value="3">3 Star</option>
          </select>
          <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
            {isEditing ? "Booking category (from row)." : "Choose category for new booking."}
          </p>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
              Assigned to (employee)
            </label>
            <select
              className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              {...register("userId")}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
              For performance tracking
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Time
              </label>
              <div className="space-y-2">
                <select
                  value={timeMode === "preset" ? timePreset : "__CUSTOM__"}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "__CUSTOM__") {
                      setTimeMode("custom");
                      setTimePreset("");
                      setValue("time", "", { shouldValidate: true });
                      return;
                    }
                    setTimeMode("preset");
                    setTimePreset(v);
                    setValue("time", v, { shouldValidate: true });
                  }}
                  className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                >
                  <option value="">Select time</option>
                  {TIME_PRESETS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  <option value="__CUSTOM__">Custom time…</option>
                </select>
                {timeMode === "custom" && (
                  <input
                    type="text"
                    placeholder="e.g. 6:15 PM"
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                    {...register("time", { required: true })}
                  />
                )}
                {timeMode === "preset" && (
                  <input type="hidden" {...register("time", { required: true })} />
                )}
              </div>
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
              <select
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("deck")}
              >
                <option value="">Select deck</option>
                {DECK_PRESETS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
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
            <div className="space-y-2">
              <select
                value={callingMode === "preset" ? callingPreset : "__CUSTOM__"}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__CUSTOM__") {
                    setCallingMode("custom");
                    setCallingPreset("");
                    setValue("callingRemarks", "", { shouldValidate: true });
                    return;
                  }
                  setCallingMode("preset");
                  setCallingPreset(v);
                  setValue("callingRemarks", v, { shouldValidate: true });
                }}
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              >
                <option value="">Select calling remark</option>
                {CALLING_REMARKS_PRESETS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="__CUSTOM__">Custom…</option>
              </select>
              {callingMode === "custom" && (
                <textarea
                  rows={2}
                  placeholder="Write custom calling remark..."
                  className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                  {...register("callingRemarks")}
                />
              )}
              {callingMode === "preset" && (
                <input type="hidden" {...register("callingRemarks")} />
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Follow-up date
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("followUpDate")}
              />
              <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                Reminder date (optional)
              </p>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
                Follow-up note
              </label>
              <input
                type="text"
                placeholder="e.g. Call again, Send WhatsApp"
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("followUpNote")}
              />
            </div>
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

