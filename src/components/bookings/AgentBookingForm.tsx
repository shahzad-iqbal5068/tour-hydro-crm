"use client";

import { useState, type FormEvent } from "react";
import type { AgentBookingFormValues, CameStatus } from "./AgentBookingTypes";

type AgentBookingFormProps = {
  initialValues?: AgentBookingFormValues | null;
  onSubmit: (values: AgentBookingFormValues) => void;
  onCancel: () => void;
};

const emptyValues: AgentBookingFormValues = {
  customerName: "",
  cruiseName: "",
  pax: "",
  contact: "",
  date: "",
  time: "",
  payment: "",
  b2b: "",
  htCommission: "",
  agentCommission: "",
  cameStatus: "came",
  cameCustomText: "",
};

export default function AgentBookingForm({
  initialValues,
  onSubmit,
  onCancel,
}: AgentBookingFormProps) {
  const [values, setValues] = useState<AgentBookingFormValues>(
    initialValues ?? emptyValues
  );

  const handleChange =
    (field: keyof AgentBookingFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      if (field === "cameStatus") {
        setValues((prev) => ({
          ...prev,
          cameStatus: value as CameStatus,
          cameCustomText: value === "custom" ? prev.cameCustomText : "",
        }));
      } else {
        setValues((prev) => ({ ...prev, [field]: value }));
      }
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isCustom = values.cameStatus === "custom";

  return (
    <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Add agent booking
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Customer name
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.customerName}
            onChange={handleChange("customerName")}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Cruise name
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.cruiseName}
            onChange={handleChange("cruiseName")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Pax
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.pax}
            onChange={handleChange("pax")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Contact
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.contact}
            onChange={handleChange("contact")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.date}
            onChange={handleChange("date")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Time
          </label>
          <input
            type="time"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.time}
            onChange={handleChange("time")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Payment
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.payment}
            onChange={handleChange("payment")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            B2B
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.b2b}
            onChange={handleChange("b2b")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            HT commission
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.htCommission}
            onChange={handleChange("htCommission")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Agent commission
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={values.agentCommission}
            onChange={handleChange("agentCommission")}
          />
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Came status
          </label>
          <div className="flex gap-2">
            <select
              className="w-32 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              value={values.cameStatus}
              onChange={handleChange("cameStatus")}
            >
              <option value="came">Came</option>
              <option value="not_came">Not came</option>
              <option value="custom">Custom</option>
            </select>
            {isCustom && (
              <input
                type="text"
                placeholder="Enter custom status"
                className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                value={values.cameCustomText}
                onChange={handleChange("cameCustomText")}
              />
            )}
          </div>
        </div>

        <div className="col-span-2 mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

