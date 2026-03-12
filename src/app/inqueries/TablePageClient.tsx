"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { InquiryRow } from "@/types";

export default function TablePageClient() {
  const router = useRouter();

  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [packageFilter, setPackageFilter] = useState<string>("");
  const [sortDate, setSortDate] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortDate, packageFilter, search]);

  const handleEdit = (id: string) => {
      router.push(`/inqueries/form?id=${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
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
          <div className="flex min-w-0 flex-1 items-center gap-1 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 sm:min-w-0 sm:flex-initial">
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
          <button
            type="button"
            onClick={() => router.push("/inqueries/form")}
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
                    <button
                      type="button"
                      onClick={() => handleEdit(row._id)}
                      className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
                    >
                      ✏️ <span className="hidden sm:inline">Edit</span>
                    </button>
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
  );
}
