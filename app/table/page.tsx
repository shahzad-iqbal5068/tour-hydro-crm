 "use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BookingRow = {
  _id: string;
  date: string;
  shift: string;
  name: string;
  email: string;
  whatsappPackage: string;
  remarks?: string;
};

export default function TablePage() {
  const router = useRouter();

  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [packageFilter, setPackageFilter] = useState<string>("");
  const [sortDate, setSortDate] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const fetchBookings = async () => {
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

      const res = await fetch(`/api/bookings?${params.toString()}`);
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
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortDate, packageFilter]);

  const handleEdit = (id: string) => {
    router.push(`/form?id=${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl rounded-lg border border-zinc-200 bg-white dark:bg-black p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Bookings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            All submissions from the WhatsApp package form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/form")}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            New Booking
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Print
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            WhatsApp Package
          </label>
          <select
            value={packageFilter}
            onChange={(e) => {
              setPage(1);
              setPackageFilter(e.target.value);
            }}
            className="w-56 rounded-md border border-zinc-300 bg-white dark:bg-black px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All packages</option>
            <option value="dow-cruise-tripn">Dow Cruise Trip N</option>
            <option value="cruise-express">Cruise Express</option>
            <option value="fun-and-fun">Fun and Fun</option>
            <option value="yacht-cruise">Yacht &amp; Cruise</option>
            <option value="blue-world">Blue World</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Date sort
          </label>
          <div className="inline-flex overflow-hidden rounded-md border border-zinc-300">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setSortDate("asc");
              }}
              className={`px-3 py-1.5 text-xs ${
                sortDate === "asc"
                  ? "bg-zinc-900 text-white"
                  : "bg-white dark:bg-black text-zinc-800 dark:text-zinc-50"
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
              className={`border-l border-zinc-300 px-3 py-1.5 text-xs ${
                sortDate === "desc"
                  ? "bg-zinc-900 text-white"
                  : "bg-white dark:bg-black text-zinc-800 dark:text-zinc-50"
              }`}
            >
              Newest first
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Shift</th>
              <th className="px-4 py-2">Package</th>
              <th className="px-4 py-2">Remarks</th>
              <th className="px-4 py-2 text-right">Actions</th>
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
                  No bookings found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <td className="px-4 py-2 text-zinc-700 dark:text-zinc-200">
                    {row.date
                      ? new Date(row.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-zinc-900 dark:text-zinc-50">
                    {row.name}
                  </td>
                  <td className="px-4 py-2 text-zinc-700 dark:text-zinc-200">
                    {row.email}
                  </td>
                  <td className="px-4 py-2 text-zinc-700 dark:text-zinc-200">
                    {row.shift}
                  </td>
                  <td className="px-4 py-2">
                    <span className="inline-flex rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-700 dark:text-zinc-200">
                      {row.whatsappPackage}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-zinc-700 dark:text-zinc-200">
                    {row.remarks || "-"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleEdit(row._id)}
                      className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 print:hidden">
        <div>
          Page {page} of {totalPages} &middot; {total} records
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

