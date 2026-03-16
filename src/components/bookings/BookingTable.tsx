"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Search, ArrowUpDown, MessageCircle, CheckCircle, Star } from "lucide-react";
import type { BookingVariantOption } from "@/types/booking";
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

export type BookingTableRow = {
  _id: string;
  category: string;
  date?: string | null;
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

const DECK_PRESETS = ["Upper deck", "Lower deck"] as const;

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function formatRowDate(row: BookingTableRow): string {
  const d = row.date ?? (row as { createdAt?: string }).createdAt;
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "971" + digits.slice(1);
  return digits || "971";
}

export type BookingTableProps = {
  data: BookingTableRow[];
  isLoading: boolean;
  variants: BookingVariantOption[];
  viewFilter: string;
  onViewFilterChange: (filter: string) => void;
  onNewBooking: () => void;
  onEdit: (row: BookingTableRow) => void;
  onDeleteClick: (id: string) => void;
  onFollowUpDone: (id: string) => void;
  followUpDoneId: string | null;
};

function getCategoryLabel(variants: BookingVariantOption[], category: string): string {
  return variants.find((v) => v.value === category)?.label ?? category;
}

export default function BookingTable({
  data,
  isLoading,
  variants,
  viewFilter,
  onViewFilterChange,
  onNewBooking,
  onEdit,
  onDeleteClick,
  onFollowUpDone,
  followUpDoneId,
}: BookingTableProps) {
  const [globalQuery, setGlobalQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const filteredData = useMemo(
    () => (viewFilter === "all" ? data : data.filter((row) => row.category === viewFilter)),
    [data, viewFilter]
  );

  const columns = useMemo<ColumnDef<BookingTableRow>[]>(
    () => [
      ...(viewFilter === "all"
        ? [
            {
              accessorKey: "category" as const,
              header: "Category",
              cell: ({ row }: { row: { original: BookingTableRow } }) => (
                <span className="text-zinc-700 dark:text-zinc-200">
                  {getCategoryLabel(variants, row.original.category)}
                </span>
              ),
            } as ColumnDef<BookingTableRow>,
          ]
        : []),
      {
        accessorKey: "date",
        header: "Date",
        accessorFn: (row) => formatRowDate(row),
        filterFn: (row, _columnId, filterValue) => {
          if (!filterValue) return true;
          const rowDate = formatRowDate(row.original);
          return rowDate === filterValue;
        },
        cell: ({ row }) => {
          const d = formatRowDate(row.original);
          return (
            <span className="whitespace-nowrap text-zinc-800 dark:text-zinc-100">
              {d || "—"}
            </span>
          );
        },
      },
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
                  onClick={() => onFollowUpDone(r._id)}
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
                onClick={() => onEdit(r)}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-[10px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteClick(r._id)}
                className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          );
        },
      },
    ],
    [viewFilter, variants, onEdit, onDeleteClick, onFollowUpDone, followUpDoneId]
  );

  // TanStack Table returns stable APIs; suppress incompatible-library for this known pattern
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter: globalQuery, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalQuery,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = normalizeText(filterValue).toLowerCase();
      if (!q) return true;
      const r = row.original;
      const dateStr = formatRowDate(r);
      const hay = [
        r.category,
        dateStr,
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

  const deckFilter = (table.getColumn("deck")?.getFilterValue() as string) ?? "";
  const dateFilter = (table.getColumn("date")?.getFilterValue() as string) ?? "";

  return (
    <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Bookings</h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Manage 4–5 Star and 3 Star cruise bookings (add, edit, delete).
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="inline-flex flex-wrap gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => onViewFilterChange("all")}
              className={`rounded px-3 py-1.5 text-[11px] font-medium ${
                viewFilter === "all"
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-600 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              }`}
            >
              All
            </button>
            {variants.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => onViewFilterChange(v.value)}
                className={`flex items-center gap-1 rounded px-2 py-1.5 text-[11px] font-medium ${
                  viewFilter === v.value
                    ? "bg-blue-600 text-white shadow-sm dark:bg-blue-600 dark:text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                }`}
              >
                {v.label}
                {v.value === "4-5" || v.value === "3" ? (
                  <Star className="h-3 w-3 fill-current opacity-80" />
                ) : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onNewBooking}
            className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
          >
            + New booking
          </button>
        </div>
      </div>

      {/* Filters: search, deck, date */}
      <div className="mb-3 max-w-md grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            placeholder="Search name, number, time, deck, remarks..."
            className={`${inputClass} pl-8`}
          />
        </div>
        <select
          value={deckFilter}
          onChange={(e) => table.getColumn("deck")?.setFilterValue(e.target.value || undefined)}
          className={inputClass}
        >
          <option value="">All decks</option>
          {DECK_PRESETS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => table.getColumn("date")?.setFilterValue(e.target.value || undefined)}
          className={inputClass}
          title="Filter by booking date"
        />
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
                    className={`px-2 py-2 ${header.id === "actions" ? "text-right" : ""}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-3 py-8">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Loading bookings…
                  </span>
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{" "}
          <span className="font-medium">{table.getPageCount()}</span>
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
            className={inputClass}
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
  );
}
