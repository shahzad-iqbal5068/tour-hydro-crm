"use client";

import { useState } from "react";
import { Copy, Trash2, Pencil, MessageCircle } from "lucide-react";
import type { MasterGroupRow } from "@/data/groupBookingDashboardData";
import { STATUS_FILTER_OPTIONS } from "@/data/groupBookingDashboardData";
import {
  GROUP_DASHBOARD_LOCATION_OPTIONS,
  GROUP_DASHBOARD_WHATSAPP_OPTIONS,
} from "@/types/groupDashboard";
import { Badge } from "@/components/ui/Badge";

type MasterGroupBookingTableProps = {
  rows: MasterGroupRow[];
  onEdit?: (row: MasterGroupRow) => void;
  onDelete?: (row: MasterGroupRow) => void;
};

const filterSelectClass =
  "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500";
const filterInputClass =
  "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500";

function cellValue(value: number | string): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "number" && Number.isNaN(value)) return "—";
  return String(value);
}

/** Search across all visible table fields (every form field). */
function rowMatchesSearch(r: MasterGroupRow, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  const str = (v: unknown) => (v != null ? String(v).toLowerCase() : "");
  return (
    str(r.inquiryDate).includes(lower) ||
    str(r.whatsapp).includes(lower) ||
    str(r.assignedPerson).includes(lower) ||
    str(r.confirmBookingDate).includes(lower) ||
    str(r.customerName).includes(lower) ||
    str(r.contact).includes(lower) ||
    str(r.numberOfPersons).includes(lower) ||
    str(r.cruiseName).includes(lower) ||
    str(r.slotTiming).includes(lower) ||
    str(r.location).includes(lower) ||
    str(r.groupNo).includes(lower) ||
    str(r.bookingStatus).includes(lower) ||
    str(r.lastFollowUpDate).includes(lower) ||
    str(r.remarks).includes(lower) ||
    str(r.callingDate).includes(lower) ||
    str(r.totalAmount).includes(lower) ||
    str(r.advancePaid).includes(lower) ||
    str(r.remainingAmount).includes(lower)
  );
}

export default function MasterGroupBookingTable({ rows, onEdit, onDelete }: MasterGroupBookingTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [locationFilter, setLocationFilter] = useState("all");
  const [waFilter, setWaFilter] = useState("all");

  const filtered = rows.filter((r) => {
    const matchSearch = rowMatchesSearch(r, search.trim());
    const matchStatus =
      statusFilter === "All Statuses" || r.bookingStatus === statusFilter;
    const matchLocation = locationFilter === "all" || r.location === locationFilter;
    const matchWa = waFilter === "all" || r.whatsapp === waFilter;
    return matchSearch && matchStatus && matchLocation && matchWa;
  });

  const columns: { key: keyof MasterGroupRow | "actions"; label: string }[] = [
    { key: "inquiryDate", label: "Inquiry Date" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "assignedPerson", label: "Assigned Person" },
    { key: "confirmBookingDate", label: "Confirm booking date" },
    { key: "customerName", label: "Customer Name" },
    { key: "contact", label: "Contact" },
    { key: "numberOfPersons", label: "No. of persons" },
    { key: "cruiseName", label: "Cruise Name" },
    { key: "slotTiming", label: "Slot timing" },
    { key: "location", label: "Location" },
    { key: "groupNo", label: "Group No." },
    { key: "bookingStatus", label: "Booking Status" },
    { key: "lastFollowUpDate", label: "Last Follow Up Date" },
    { key: "remarks", label: "Remarks" },
    { key: "callingDate", label: "Calling Date" },
    { key: "totalAmount", label: "Total amount" },
    { key: "advancePaid", label: "Advance Paid" },
    { key: "remainingAmount", label: "Remaining Amount" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Master Group Booking Dashboard
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all fields…"
            className={`${filterInputClass} min-w-[200px] flex-1 max-w-md`}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={filterSelectClass}
          >
            {STATUS_FILTER_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className={filterSelectClass}
          >
            <option value="all">All Locations</option>
            {GROUP_DASHBOARD_LOCATION_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={waFilter}
            onChange={(e) => setWaFilter(e.target.value)}
            className={filterSelectClass}
          >
            <option value="all">All WhatsApp</option>
            {GROUP_DASHBOARD_WHATSAPP_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-3 ${col.key === "actions" ? "text-right" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <td className="whitespace-nowrap px-4 py-3 text-zinc-700 dark:text-zinc-200">
                  {cellValue(r.inquiryDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{r.whatsapp}</td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.assignedPerson)}</td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.confirmBookingDate)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium">{r.customerName}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!r.contact) return;
                      navigator.clipboard
                        .writeText(String(r.contact))
                        .catch(() => {
                          // ignore clipboard errors
                        });
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <span>{cellValue(r.contact)}</span>
                    <Copy className="h-3 w-3" aria-hidden />
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.numberOfPersons)}</td>
                <td className="max-w-[140px] truncate px-4 py-3" title={r.cruiseName}>
                  {cellValue(r.cruiseName)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.slotTiming)}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.location}</td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.groupNo)}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Badge
                    variant="soft"
                    color={
                      r.bookingStatus === "Done"
                        ? "success"
                        : r.bookingStatus === "Not done"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {r.bookingStatus}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.lastFollowUpDate)}</td>
                <td className="max-w-[160px] truncate px-4 py-3" title={r.remarks}>
                  {cellValue(r.remarks)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.callingDate)}</td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.totalAmount)}</td>
                <td className="whitespace-nowrap px-4 py-3">{cellValue(r.advancePaid)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium">{cellValue(r.remainingAmount)}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-[10px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      title="Edit"
                      onClick={() => onEdit?.(r)}
                    >
                      <Pencil className="h-3 w-3" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-[10px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      title="Open WhatsApp"
                      onClick={() => {
                        if (!r.contact) return;
                        const phone = String(r.contact).replace(/[^0-9+]/g, "");
                        const url = `https://wa.me/${phone}`;
                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <MessageCircle className="h-3 w-3" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-200 text-[10px] text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                      title="Delete"
                      onClick={() => onDelete?.(r)}
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
