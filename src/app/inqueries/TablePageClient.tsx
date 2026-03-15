"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Pencil, Trash2, Search, ArrowUpDown } from "lucide-react";
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
import type { InquiryRow, InquiryFormValues as FormValues } from "@/types";
import { useInquiries, useInquiry, useUsersList } from "@/hooks/api";
import { PageLoader } from "@/components/ui/PageLoader";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export default function TablePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");

  const { data: rows, isLoading: loading, error: inquiriesError, createMutation, updateMutation, deleteMutation } = useInquiries();
  const { data: inquiry, isLoading: loadingExisting } = useInquiry(editingId);
  const { data: users = [] } = useUsersList();

  const [globalQuery, setGlobalQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteLoading = deleteMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      shift: "",
      whatsappName: "",
      remarks: "",
      userId: "",
    },
  });

  useEffect(() => {
    if (!editingId) {
      reset({
        date: new Date().toISOString().split("T")[0],
        shift: "",
        whatsappName: "",
        remarks: "",
        userId: "",
      });
      return;
    }
    if (inquiry) {
      reset({
        date: inquiry.date ? new Date(inquiry.date).toISOString().slice(0, 10) : "",
        shift: inquiry.shift || "",
        whatsappName: inquiry.whatsappName || "",
        remarks: inquiry.remarks || "",
        userId: inquiry.userId || "",
      });
    }
  }, [editingId, inquiry, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      date: values.date,
      shift: values.shift,
      whatsappName: values.whatsappName,
      remarks: values.remarks,
      userId: values.userId || undefined,
    };
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, body: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      toast.success(editingId ? "Inquiry updated successfully" : "Inquiry created successfully");
      if (!editingId) {
        reset({
          date: new Date().toISOString().split("T")[0],
          shift: "",
          whatsappName: "",
          remarks: "",
          userId: "",
        });
      } else {
        router.push("/inqueries");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save inquiry");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/inqueries?id=${id}`);
  };

  const openDeleteModal = (id: string) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Inquiry deleted");
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    }
  };

  const error = inquiriesError ? (inquiriesError as Error).message : null;

  const handleNewClick = () => {
    router.push("/inqueries");
    reset({
      date: new Date().toISOString().split("T")[0],
      shift: "",
      whatsappName: "",
      remarks: "",
      userId: "",
    });
  };

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
            {row.original.date
              ? new Date(row.original.date).toLocaleDateString()
              : "—"}
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
              onClick={() => handleEdit(row.original._id)}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-[11px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Pencil className="h-3 w-3" />
              {/* <span className="hidden sm:inline">Edit</span> */}
            </button>
            <button
              type="button"
              onClick={() => openDeleteModal(row.original._id)}
              className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
            >
              <Trash2 className="h-3 w-3" />
              {/* <span className="hidden sm:inline">Delete</span> */}
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        r.shift,
        r.whatsappName,
        r.remarks ?? "",
      ].join(" ").toLowerCase();
      return hay.includes(q);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <Toaster position="top-right" />
        <PageLoader message="Loading inquiries…" fullScreen />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
      <Toaster position="top-right" />

      <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Inquiries
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              All submissions from the WhatsApp Name form.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleNewClick}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              New Inquiry
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Print
            </button>
          </div>
        </div>

        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              placeholder="Search date, name, shift, WhatsApp, remarks..."
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
                      className={`px-3 py-2 sm:px-4 ${header.id === "actions" ? "text-right" : ""}`}
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
            Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{" "}
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
      </div>

      <div className="w-full shrink-0 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5 lg:max-w-sm">
        <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {editingId ? "Edit inquiry" : "New inquiry"}
        </h2>
        <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400">
          Capture tourist cruise inquiry details, assign a user (name), WhatsApp Name, shift and remarks.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
                Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="mt-1 text-[11px] text-red-500">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
                Shift
              </label>
              <select
                className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("shift", { required: "Shift is required" })}
              >
                <option value="">Select shift</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
              {errors.shift && (
                <p className="mt-1 text-[11px] text-red-500">{errors.shift.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
              Name
            </label>
            <select
              className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              {...register("userId")}
            >
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
              Users created by admin. Optional.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
              WhatsApp Name
            </label>
            <select
              className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              {...register("whatsappName", { required: "WhatsApp Name is required" })}
            >
              <option value="">Select WhatsApp Name</option>
              <option value="dow-cruise-tripn">Dow Cruise Trip</option>
              <option value="cruise-express">Cruise Express</option>
              <option value="fun-and-fun">Fun &amp; Fun</option>
              <option value="yacht-cruise">Yacht &amp; Cruise</option>
              <option value="blue-world">Blue World</option>
              <option value="fun-factory">Fun Factory</option>
              <option value="dubai-deals">Dubai Deals</option>
            </select>
            {errors.whatsappName && (
              <p className="mt-1 text-[11px] text-red-500">{errors.whatsappName.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
              Remarks
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              placeholder="Type remarks or notes here"
              {...register("remarks")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting || loadingExisting}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting || loadingExisting
                ? editingId ? "Saving..." : "Submitting..."
                : editingId ? "Save changes" : "Submit"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleNewClick}
                className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
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
                Delete inquiry?
              </h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                This will permanently remove this inquiry from the list. You can&apos;t undo this action.
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
