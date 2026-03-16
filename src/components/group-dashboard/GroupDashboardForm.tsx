"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { GroupDashboardFormValues } from "@/types/groupDashboard";
import {
  GROUP_DASHBOARD_WHATSAPP_OPTIONS,
  GROUP_DASHBOARD_BOOKING_STATUS_OPTIONS,
  GROUP_DASHBOARD_LOCATION_OPTIONS,
} from "@/types/groupDashboard";
import { useUsersList } from "@/hooks/api/useUsersList";
import { Button } from "@/components/ui/Button";

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDefaultGroupDashboardFormValues(): GroupDashboardFormValues {
  return {
    inquiryDate: getTodayISO(),
    whatsapp: "Fun Factory",
    assignedPerson: "",
    confirmBookingDate: "",
    customerName: "",
    contact: "",
    numberOfPersons: 0,
    cruiseName: "",
    slotTiming: "",
    location: "Canal",
    groupNo: "",
    bookingStatus: "Not done",
    lastFollowUpDate: "",
    remarks: "",
    callingDate: "",
    totalAmount: 0,
    advancePaid: 0,
    remainingAmount: 0,
    updateTimestamp: "",
  };
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500";
const labelClass =
  "mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200";

export type GroupDashboardFormProps = {
  initialValues?: GroupDashboardFormValues | null;
  onSubmit: (values: GroupDashboardFormValues) => Promise<void>;
  onCancel?: () => void;
  /** When true, show Update Timestamp and make it read-only */
  isEditing?: boolean;
};

export default function GroupDashboardForm({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
}: GroupDashboardFormProps) {
  const { data: users = [] } = useUsersList();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<GroupDashboardFormValues>({
    defaultValues: initialValues ?? getDefaultGroupDashboardFormValues(),
  });

  const totalAmount = watch("totalAmount");
  const advancePaid = watch("advancePaid");

  useEffect(() => {
    const total = Number(totalAmount) || 0;
    const advance = Number(advancePaid) || 0;
    setValue("remainingAmount", Math.max(0, total - advance));
  }, [totalAmount, advancePaid, setValue]);

  useEffect(() => {
    reset(initialValues ?? getDefaultGroupDashboardFormValues());
  }, [initialValues, reset]);

  const handleFormSubmit = async (values: GroupDashboardFormValues) => {
    await onSubmit(values);
    reset(getDefaultGroupDashboardFormValues());
  };

  const today = getTodayISO();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {isEditing ? "Edit Group Lead" : "Add Group Lead"}
      </h2>
      <p className="mb-4 text-[11px] text-zinc-600 dark:text-zinc-400">
        Enter all details of group lead to store in the database. Data will appear in the
        master group booking dashboard after save.
      </p>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Inquiry Date</label>
            <input
              type="date"
              className={inputClass}
              min={today}
              {...register("inquiryDate", { required: true })}
            />
          </div>

          <div>
            <label className={labelClass}>WhatsApp</label>
            <select
              className={inputClass}
              {...register("whatsapp", { required: true })}
            >
              {GROUP_DASHBOARD_WHATSAPP_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Assigned Person</label>
            <select className={inputClass} {...register("assignedPerson")}>
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Confirm booking date</label>
            <input
              type="date"
              className={inputClass}
              {...register("confirmBookingDate")}
            />
          </div>

          <div>
            <label className={labelClass}>Customer Name</label>
            <input
              type="text"
              className={inputClass}
              {...register("customerName", { required: true })}
              placeholder="e.g. Farhan Traders"
            />
          </div>

          <div>
            <label className={labelClass}>Contact</label>
            <input
              type="text"
              className={inputClass}
              {...register("contact", { required: true })}
              placeholder="+9715xxxx"
            />
          </div>

          <div>
            <label className={labelClass}>No. of persons</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("numberOfPersons", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className={labelClass}>Cruise Name</label>
            <input
              type="text"
              className={inputClass}
              {...register("cruiseName")}
              placeholder="Cruise name"
            />
          </div>

          <div>
            <label className={labelClass}>Slot timing</label>
            <input
              type="text"
              className={inputClass}
              {...register("slotTiming")}
              placeholder="e.g. 6:30 PM"
            />
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <select
              className={inputClass}
              {...register("location", { required: true })}
            >
              {GROUP_DASHBOARD_LOCATION_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Group No.</label>
            <input
              type="text"
              className={inputClass}
              {...register("groupNo")}
              placeholder="Group number"
            />
          </div>

          <div>
            <label className={labelClass}>Booking Status</label>
            <select
              className={inputClass}
              {...register("bookingStatus", { required: true })}
            >
              {GROUP_DASHBOARD_BOOKING_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Last Follow Up Date</label>
            <input
              type="date"
              className={inputClass}
              {...register("lastFollowUpDate")}
            />
          </div>

          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <label className={labelClass}>Remarks</label>
            <textarea
              rows={3}
              className={inputClass}
              {...register("remarks")}
              placeholder="Notes, remarks, etc."
            />
          </div>

          <div>
            <label className={labelClass}>Calling date</label>
            <input
              type="date"
              className={inputClass}
              {...register("callingDate")}
            />
          </div>

          <div>
            <label className={labelClass}>Total amount</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              {...register("totalAmount", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className={labelClass}>Advance Paid</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              {...register("advancePaid", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className={labelClass}>Remaining Amount</label>
            <input
              type="number"
              readOnly
              className={`${inputClass} bg-zinc-100 dark:bg-zinc-800`}
              {...register("remainingAmount", { valueAsNumber: true })}
            />
            <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
              Auto: Total amount − Advance paid
            </p>
          </div>
        </div>

        {isEditing && (
          <div>
            <label className={labelClass}>Update Timestamp</label>
            <input
              type="text"
              className={`${inputClass} bg-zinc-100 dark:bg-zinc-800`}
              readOnly
              {...register("updateTimestamp")}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save Group Lead"}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" size="md" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
