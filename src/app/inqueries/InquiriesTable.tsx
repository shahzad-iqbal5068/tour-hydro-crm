"use client";

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
import { useMemo, useState } from "react";
import { Pencil, Trash2, Search, ArrowUpDown, Copy } from "lucide-react";
import type { InquiryRow } from "@/types";
import { Toaster, toast } from "react-hot-toast";

type InquiriesTableProps = {
  rows: InquiryRow[];
  error: string | null;
  onEdit: (id: string) => void;
  onRequestDelete: (id: string) => void;
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function InquiriesTable({ rows, error, onEdit, onRequestDelete }: InquiriesTableProps) {
  const [globalQuery, setGlobalQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<InquiryRow>[]>(
    () => [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1"
          >
            Date <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-zinc-700 dark:text-zinc-200">
            {row.original.date ? new Date(row.original.date).toLocaleDateString() : "—"}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="text-zinc-700 dark:text-zinc-200">
            {row.original.name || "—"}
          </span>
        ),
      },
      {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => {
          const contact = row.original.contact || "";
          if (!contact) {
            return <span className="text-zinc-400 dark:text-zinc-600">—</span>;
          }
          const handleCopy = async () => {
            try {
              await navigator.clipboard.writeText(contact);
              toast.success("Contact copied");
            } catch (err) {
              console.error(err);
              toast.error("Failed to copy");
            }
          };
          return (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-0.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <span className="max-w-[120px] truncate">{contact}</span>
              <Copy className="h-3 w-3" aria-hidden />
            </button>
          );
        },
      },
      { accessorKey: "shift", header: "Shift" },
      {
        accessorKey: "whatsappName",
        header: "WhatsApp Name",
        cell: ({ row }) => (
          <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {row.original.whatsappName}
          </span>
        ),
      },
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
        id: "actions",
        header: () => <span className="block text-right">Actions</span>,
        cell: ({ row }) => (
          <div className="inline-flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onEdit(row.original._id)}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-[11px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onRequestDelete(row.original._id)}
              className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ),
      },
    ],
    []
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
        r.date,
        r.name ?? "",
        r.contact ?? "",
        r.shift,
        r.whatsappName,
        r.remarks ?? "",
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
    <>
      <Toaster position="top-right" />

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            placeholder="Search date, name, contact, shift, WhatsApp, remarks..."
            className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          />
        </div>
        <select
          value={(table.getColumn("whatsappName")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("whatsappName")?.setFilterValue(e.target.value || undefined)
          }
          className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
        >
          <option value="">All WhatsApp Names</option>
          <option value="dow-cruise-tripn">Dow Cruise Trip N</option>
          <option value="cruise-express">Cruise Express</option>
          <option value="fun-and-fun">Fun &amp; Fun</option>
          <option value="yacht-cruise">Yacht &amp; Cruise</option>
          <option value="blue-world">Blue World</option>
          <option value="fun-factory">Fun Factory</option>
          <option value="dubai-deals">Dubai Deals</option>
        </select>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-full text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-3 py-2 sm:px-4 ${
                      header.id === "actions" ? "text-right" : ""
                    }`}
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
            {error ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-4 py-6 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No inquiries found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-3 py-2 text-zinc-700 dark:text-zinc-200 sm:px-4 ${
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

      <div className="mt-3 flex flex-col items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400 print:hidden sm:flex-row">
        <div>
          Page{" "}
          <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{" "}
          <span className="font-medium">{table.getPageCount()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-md border border-zinc-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-md border border-zinc-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
          >
            Next
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          >
            {[10, 20, 30, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

