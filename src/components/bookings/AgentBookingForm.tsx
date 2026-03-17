"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { AgentBookingFormValues } from "@/types/AgentBookingTypes";

type AgentBookingFormProps = {
  initialValues?: AgentBookingFormValues | null;
  onSubmit: (values: AgentBookingFormValues) => void;
  onCancel: () => void;
};

const defaultValues: AgentBookingFormValues = {
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
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgentBookingFormValues>({
    defaultValues: initialValues ?? defaultValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset(defaultValues);
    }
  }, [initialValues, reset]);

  const cameStatus = watch("cameStatus");
  const isCustom = cameStatus === "custom";

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-3"
      >
        <div className="col-span-2">
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Customer name
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("customerName", {
              required: "Customer name is required",
              minLength: {
                value: 2,
                message: "Customer name must be at least 2 characters",
              },
            })}
          />
          {errors.customerName && (
            <p className="mt-0.5 text-[10px] text-red-500">
              {errors.customerName.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Cruise name
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("cruiseName")}
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
            {...register("pax", {
              required: "Pax is required",
              validate: (value) =>
                Number(value) > 0 || "Pax must be greater than 0",
            })}
          />
          {errors.pax && (
            <p className="mt-0.5 text-[10px] text-red-500">
              {errors.pax.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Contact
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("contact", {
              required: "Contact is required",
              minLength: {
                value: 5,
                message: "Contact seems too short",
              },
            })}
          />
          {errors.contact && (
            <p className="mt-0.5 text-[10px] text-red-500">
              {errors.contact.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("date")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Time
          </label>
          <input
            type="time"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("time")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Payment
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("payment")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            B2B
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("b2b")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            HT commission
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("htCommission")}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Agent commission
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            {...register("agentCommission")}
          />
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
            Came status
          </label>
          <div className="flex gap-2">
            <select
              className="w-32 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none ring-0 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              {...register("cameStatus", { required: true })}
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
                {...register("cameCustomText", {
                  validate: (value) =>
                    cameStatus !== "custom" ||
                    value.trim().length > 0 ||
                    "Custom status is required when 'Custom' is selected",
                })}
              />
            )}
          </div>
          {errors.cameCustomText && (
            <p className="mt-0.5 text-[10px] text-red-500">
              {errors.cameCustomText.message}
            </p>
          )}
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
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

