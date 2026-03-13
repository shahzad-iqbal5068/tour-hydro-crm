"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import type { InquiryRow, InquiryFormValues as FormValues } from "@/types";

export default function TablePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");

  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [packageFilter, setPackageFilter] = useState<string>("");
  const [sortDate, setSortDate] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const [loadingExisting, setLoadingExisting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    },
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sortDate", sortDate);
      if (packageFilter) {
        params.set("package", packageFilter);
      }
      if (search) {
        params.set("q", search);
      }

      const res = await fetch(`/api/inquiries?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load data");
      }
      const json = await res.json();
      setRows(json.data || []);
      setTotal(json.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortDate, packageFilter, search]);

  useEffect(() => {
    const fetchInquiry = async () => {
      if (!editingId) {
        reset({
          date: new Date().toISOString().split("T")[0],
          shift: "",
          whatsappName: "",
          remarks: "",
        });
        return;
      }
      try {
        setLoadingExisting(true);
        const res = await fetch(`/api/inquiries/${editingId}`);
        if (!res.ok) {
          throw new Error("Failed to load inquiry");
        }
        const data = await res.json();
        reset({
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
          shift: data.shift || "",
          whatsappName: data.whatsappName || "",
          remarks: data.remarks || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load inquiry");
      } finally {
        setLoadingExisting(false);
      }
    };

    void fetchInquiry();
  }, [editingId, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      date: values.date,
      shift: values.shift,
      whatsappName: values.whatsappName,
      remarks: values.remarks,
    };

    try {
      const res = await fetch(
        editingId ? `/api/inquiries/${editingId}` : "/api/inquiries",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      console.log("Form submitted:", data);
      toast.success(
        editingId ? "Inquiry updated successfully" : "Inquiry created successfully"
      );

      // refresh table
      void fetchInquiries();

      if (!editingId) {
        reset({
          date: new Date().toISOString().split("T")[0],
          shift: "",
          whatsappName: "",
          remarks: "",
        });
      } else {
        router.push("/inqueries");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save inquiry");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/inqueries?id=${id}`);
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
      const res = await fetch(`/api/inquiries/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete inquiry");
        return;
      }
      toast.success("Inquiry deleted");
      setDeleteId(null);
      void fetchInquiries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleNewClick = () => {
    router.push("/inqueries");
    reset({
      date: new Date().toISOString().split("T")[0],
      shift: "",
      whatsappName: "",
      remarks: "",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
      <Toaster position="top-right" />

      {/* Table side */}
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
        <div className="flex sm:flex-col  flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-1 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <span>🔍</span>
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search name/email/remarks..."
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 sm:w-40"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleNewClick}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            New Inquiry
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Print
          </button>
          </div>
        </div>
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 sm:min-w-[14rem]">
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            WhatsApp Name
          </label>
          <select
            value={packageFilter}
            onChange={(e) => {
              setPage(1);
              setPackageFilter(e.target.value);
            }}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
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
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Date sort
          </label>
          <div className="inline-flex overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setSortDate("asc");
              }}
              className={`px-3 py-1.5 text-xs ${
                sortDate === "asc"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              }`}
            >
              Oldest first
            </button>
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setSortDate("desc");
              }}
              className={`border-l border-zinc-300 px-3 py-1.5 text-xs dark:border-zinc-700 ${
                sortDate === "desc"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              }`}
            >
              Newest first
            </button>
          </div>
        </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <th className="px-3 py-2 sm:px-4">Date</th>
              <th className="px-3 py-2 sm:px-4">Shift</th>
              <th className="px-3 py-2 sm:px-4">WhatsApp Name</th>
              <th className="hidden px-3 py-2 md:table-cell md:px-4">Remarks</th>
              <th className="px-3 py-2 text-right sm:px-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td 
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No inquiries found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-200 sm:px-4">
                    {row.date
                      ? new Date(row.date).toLocaleDateString()
                      : "-"}
                  </td>
                  
                  <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-200 sm:px-4">
                    {row.shift}
                  </td>
                  <td className="hidden sm:table-cell sm:px-4 sm:py-2">
                    <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {row.whatsappName}
                    </span>
                  </td>
                  <td className="hidden max-w-[120px] truncate px-3 py-2 text-zinc-700 dark:text-zinc-200 md:table-cell md:max-w-none md:px-4">
                    {row.remarks || "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right sm:px-4">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(row._id)}
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-[11px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <Pencil className="h-3 w-3" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(row._id)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
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

        <div className="mt-4 flex flex-col gap-3 text-xs text-zinc-600 dark:text-zinc-400 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div>
          Page {page} of {totalPages} &middot; {total} records
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
          >
            Next
          </button>
        </div>
      </div>
      </div>

      {/* Form side */}
      <div className="w-full shrink-0 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5 lg:max-w-sm">
        <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {editingId ? "Edit inquiry" : "New inquiry"}
        </h2>
        <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400">
          Capture tourist cruise inquiry details, WhatsApp Name, shift and remarks.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="date"
                className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200"
              >
                Date
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  📅
                </span>
                <input
                  id="date"
                  type="date"
                  className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                  {...register("date", { required: "Date is required" })}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-[11px] text-red-500">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="shift"
                className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200"
              >
                Shift
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  🕒
                </span>
                <select
                  id="shift"
                  className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                  {...register("shift", { required: "Shift is required" })}
                >
                  <option value="">Select shift</option>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              {errors.shift && (
                <p className="mt-1 text-[11px] text-red-500">{errors.shift.message}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="package"
              className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200"
            >
              WhatsApp Name
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                🛳️
              </span>
              <select
                id="package"
                className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("whatsappName", {
                  required: "WhatsApp Name is required",
                })}
              >
                <option value="">Select WhatsApp Name</option>
                <option value="dow-cruise-tripn">Dow Cruise Trip </option>
                <option value="cruise-express">Cruise Express</option>
                <option value="fun-and-fun">Fun  &amp; Fun</option>
                <option value="yacht-cruise">Yacht &amp; Cruise</option>
                <option value="blue-world">Blue World</option>
                <option value="fun-factory">Fun Factory</option>
                <option value="dubai-deals">Dubai Deals</option>
              </select>
            </div>
            {errors.whatsappName && (
              <p className="mt-1 text-[11px] text-red-500">
                {errors.whatsappName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="remarks"
              className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200"
            >
              Remarks
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1.5 text-zinc-400">
                📝
              </span>
              <textarea
                id="remarks"
                rows={3}
                className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-8 pr-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                placeholder="Type remarks or notes here"
                {...register("remarks")}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting || loadingExisting}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting || loadingExisting
                ? editingId
                  ? "Saving..."
                  : "Submitting..."
                : editingId
                  ? "Save changes"
                  : "Submit"}
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
                This will permanently remove this inquiry from the list. You
                can&apos;t undo this action.
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
