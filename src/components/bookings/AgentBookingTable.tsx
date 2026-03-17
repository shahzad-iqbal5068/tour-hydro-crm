"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { AgentBookingRow } from "@/types/AgentBookingTypes";

type AgentBookingTableProps = {
  data: AgentBookingRow[];
  onAddAgentClick: () => void;
  onEdit: (row: AgentBookingRow) => void;
  onDelete: (row: AgentBookingRow) => void;
};

export default function AgentBookingTable({
  data,
  onAddAgentClick,
  onEdit,
  onDelete,
}: AgentBookingTableProps) {
  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Agent bookings
          </h1>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Track customer, cruise, commissions and attendance status.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddAgentClick}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-indigo-500"
        >
          Add agent
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <th className="whitespace-nowrap px-2 py-2 text-left">Sr. No</th>
              <th className="whitespace-nowrap px-2 py-2 text-left">
                Customer name
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-left">
                Cruise name
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-right">Pax</th>
              <th className="whitespace-nowrap px-2 py-2 text-left">
                Contact
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-left">Date</th>
              <th className="whitespace-nowrap px-2 py-2 text-left">Time</th>
              <th className="whitespace-nowrap px-2 py-2 text-left">
                Payment
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-left">B2B</th>
              <th className="whitespace-nowrap px-2 py-2 text-left">
                HT commission
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-left">
                Agent commission
              </th>
              <th className="whitespace-nowrap px-2 py-2 text-left">Came</th>
              <th className="whitespace-nowrap px-2 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="px-2 py-6 text-center text-[11px] text-zinc-500 dark:text-zinc-400"
                >
                  No agent bookings yet. Click &quot;Add agent&quot; to create
                  one.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-100 text-[11px] text-zinc-700 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900/60"
                >
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.customerName}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.cruiseName}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right">
                    {row.pax}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.contact}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.date}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.time}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.payment}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.b2b}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.htCommission}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.agentCommission}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-left">
                    {row.cameStatus === "custom"
                      ? row.cameCustomText || "Custom"
                      : row.cameStatus === "came"
                      ? "Came"
                      : "Not came"}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-[10px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        title="Edit"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-200 text-[10px] text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

