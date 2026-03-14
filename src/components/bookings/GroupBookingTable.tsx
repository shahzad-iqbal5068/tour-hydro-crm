"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Search, MessageCircle } from "lucide-react";
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
import type { GroupBookingRow } from "@/hooks/api";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(v: string | null | undefined): string {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toISOString().slice(0, 10);
}

function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "971" + digits.slice(1);
  return digits || "971";
}

export type GroupBookingTableProps = {
  data: GroupBookingRow[];
  isLoading: boolean;
  onNewBooking: () => void;
  onEdit: (row: GroupBookingRow) => void;
  onDeleteClick: (id: string) => void;
};

export default function GroupBookingTable({
  data,
  isLoading,
  onNewBooking,
  onEdit,
  onDeleteClick,
}: GroupBookingTableProps) {
  const [globalQuery, setGlobalQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<GroupBookingRow>[]>(
    () => [
      { accessorKey: "groupBookingName", header: "Group name", cell: ({ getValue }) => <span className="font-medium">{String(getValue() ?? "—")}</span> },
      { accessorKey: "guestName", header: "Guest name" },
      {
        accessorKey: "contactWhatsapp",
        header: "Contact / WhatsApp",
        cell: ({ row }) => {
          const phone = row.original.contactWhatsapp;
          const waText = encodeURIComponent(`Hello ${row.original.guestName}, regarding your group booking`);
          return (
            <a
              href={`https://wa.me/${whatsappNumber(phone)}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <MessageCircle className="h-3 w-3" />
              {phone || "—"}
            </a>
          );
        },
      },
      { accessorKey: "groupsCount", header: "Groups #" },
      { accessorKey: "cruiseName", header: "Cruise name" },
      { accessorKey: "numberOfPax", header: "Pax" },
      { accessorKey: "timeSlot", header: "Time slot" },
      {
        accessorKey: "inquiryDate",
        header: "Inquiry date",
        accessorFn: (r) => formatDate(r.inquiryDate ?? null),
        cell: ({ row }) => formatDate(row.original.inquiryDate ?? null),
      },
      {
        accessorKey: "confirmDate",
        header: "Confirm date",
        accessorFn: (r) => formatDate(r.confirmDate ?? null),
        cell: ({ row }) => formatDate(row.original.confirmDate ?? null),
      },
      {
        accessorKey: "bookingStatusRemarks",
        header: "Status / remarks",
        cell: ({ row }) => (
          <span className="max-w-[120px] truncate block" title={row.original.bookingStatusRemarks ?? ""}>
            {row.original.bookingStatusRemarks || "—"}
          </span>
        ),
      },
      { accessorKey: "totalAmount", header: "Total" },
      { accessorKey: "advancePaid", header: "Advance" },
      { accessorKey: "remainingAmount", header: "Remaining" },
      {
        accessorKey: "callingDate",
        header: "Calling date",
        accessorFn: (r) => formatDate(r.callingDate ?? null),
        filterFn: (row, _col, filterValue) => {
          if (!filterValue) return true;
          return formatDate(row.original.callingDate ?? null) === filterValue;
        },
        cell: ({ row }) => formatDate(row.original.callingDate ?? null),
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ row }) => (
          <span className="max-w-[120px] truncate block" title={row.original.remarks ?? ""}>
            {row.original.remarks || "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="block text-right">Actions</span>,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="inline-flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(r)}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-[10px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteClick(r._id)}
                className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDeleteClick]
  );

  const table = useReactTable({
    data,
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
        r.groupBookingName,
        r.guestName,
        r.contactWhatsapp,
        r.cruiseName,
        r.timeSlot,
        r.bookingStatusRemarks,
        r.remarks,
        String(r.groupsCount),
        String(r.numberOfPax),
        String(r.totalAmount),
        String(r.advancePaid),
        String(r.remainingAmount),
        formatDate(r.inquiryDate ?? null),
        formatDate(r.confirmDate ?? null),
        formatDate(r.callingDate ?? null),
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

  const dateFilter = (table.getColumn("callingDate")?.getFilterValue() as string) ?? "";

  return (
    <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Group bookings</h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Manage group bookings: guest, cruise, amounts and dates.
          </p>
        </div>
        <button
          type="button"
          onClick={onNewBooking}
          className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
        >
          + New group booking
        </button>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            placeholder="Search name, contact, cruise, remarks..."
            className={`${inputClass} pl-8`}
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => table.getColumn("callingDate")?.setFilterValue(e.target.value || undefined)}
          className={inputClass}
          title="Filter by calling date"
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
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading group bookings…</span>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-3 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  No group bookings found.
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
