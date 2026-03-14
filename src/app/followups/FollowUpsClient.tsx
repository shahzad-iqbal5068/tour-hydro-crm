"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { MessageCircle, CheckCircle, Calendar, ExternalLink, Copy } from "lucide-react";
import Link from "next/link";
import { useFollowups } from "@/hooks/api";
import { Loader } from "@/components/ui/Loader";

function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "971" + digits.slice(1);
  return digits || "971";
}

type CategoryFilter = "all" | "4-5" | "3";

export default function FollowUpsClient() {
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const { data: rows, isLoading: loading, followUpDoneMutation } = useFollowups(date, categoryFilter);
  const doneId = followUpDoneMutation.isPending ? followUpDoneMutation.variables : null;

  const handleFollowUpDone = async (id: string) => {
    try {
      await followUpDoneMutation.mutateAsync(id);
      toast.success("Follow-up marked done");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark follow-up done");
    }
  };

  const waMessage = (guestName: string) =>
    encodeURIComponent(`Hello ${guestName}, just following up about your booking`);

  const copyNumber = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("Number copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <Toaster position="top-right" />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Follow-ups
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Pending follow-ups by date. Send WhatsApp or mark as done.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Booking type
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <option value="all">All WhatsApp bookings</option>
              <option value="4-5">4–5 Star</option>
              <option value="3">3 Star</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader block size="lg" label="Loading follow-ups…" />
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No follow-ups for this date. Set a follow-up date on a booking to see it here.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <th className="px-3 py-2 sm:px-4">Guest</th>
                <th className="px-3 py-2 sm:px-4">Phone</th>
                <th className="hidden px-3 py-2 sm:table-cell sm:px-4">Time</th>
                <th className="hidden px-3 py-2 sm:table-cell sm:px-4">Category</th>
                <th className="px-3 py-2 sm:px-4">Note</th>
                <th className="px-3 py-2 text-right sm:px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-zinc-800 dark:text-zinc-100 sm:px-4">
                    {row.guestName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-zinc-600 dark:text-zinc-300 sm:px-4">
                    <button
                      type="button"
                      onClick={() => copyNumber(row.phone)}
                      className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-sm hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                      title="Copy number"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {row.phone}
                    </button>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2 text-zinc-600 dark:text-zinc-300 sm:table-cell sm:px-4">
                    {row.time}
                  </td>
                  <td className="hidden px-3 py-2 sm:table-cell sm:px-4">
                    <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {row.category === "4-5" ? "4–5 Star" : "3 Star"}
                    </span>
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-2 text-zinc-600 dark:text-zinc-300 sm:px-4">
                    {row.followUpNote || "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right sm:px-4">
                    <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                      <a
                        href={`https://wa.me/${whatsappNumber(row.phone)}?text=${waMessage(row.guestName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-emerald-400 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200 dark:hover:bg-emerald-900/50"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleFollowUpDone(row._id)}
                        disabled={doneId === row._id}
                        className="inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-100 disabled:opacity-60 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-900/50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {/* {doneId === row._id ? "..." : "Follow up done"} */}
                      </button>
                      <Link
                        href="/bookings"
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        You can also mark follow-ups as done from the{" "}
        <Link href="/bookings" className="text-blue-600 underline dark:text-blue-400">
          Bookings
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
