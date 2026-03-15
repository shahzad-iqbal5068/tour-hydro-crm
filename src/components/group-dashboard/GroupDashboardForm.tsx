"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { GroupDashboardFormValues } from "@/types/groupDashboard";
import {
  GROUP_DASHBOARD_WHATSAPP_OPTIONS,
  GROUP_DASHBOARD_STATUS_OPTIONS,
  GROUP_DASHBOARD_LOCATION_OPTIONS,
  GROUP_DASHBOARD_VISIT_STATUS_OPTIONS,
  GROUP_DASHBOARD_REMINDER_OPTIONS,
  GROUP_DASHBOARD_FOLLOW_UP_PRIORITY_OPTIONS,
  GROUP_DASHBOARD_POPUP_ALERT_OPTIONS,
} from "@/types/groupDashboard";

export function getDefaultGroupDashboardFormValues(): GroupDashboardFormValues {
  return {
    dateAdded: new Date().toISOString().slice(0, 10),
    whatsapp: "WA-1",
    customerName: "",
    phone: "",
    groupSize: 0,
    location: "Canal",
    travelDate: "",
    bookingStatus: "New Inquiry",
    lastFollowUpDate: "",
    nextFollowUpDate: "",
    nextFollowUpTime: "",
    followUpPriority: "Medium",
    assignedAgent: "",
    updatedByEmail: "",
    updateTimestamp: "",
    reminderDone: false,
    reminderTriggered: false,
    popupAlertStatus: "Pending",
    reminderVisitStatus: "No Visit",
    visitStatus: "No Visit",
    notes: "",
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<GroupDashboardFormValues>({
    defaultValues: initialValues ?? getDefaultGroupDashboardFormValues(),
  });

  useEffect(() => {
    reset(initialValues ?? getDefaultGroupDashboardFormValues());
  }, [initialValues, reset]);

  const handleFormSubmit = async (values: GroupDashboardFormValues) => {
    await onSubmit(values);
    reset(getDefaultGroupDashboardFormValues());
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {isEditing ? "Edit Group Lead" : "Add Group Lead"}
      </h2>
      <p className="mb-4 text-[11px] text-zinc-600 dark:text-zinc-400">
        Enter all details to store in the database. Data will appear in the
        master group booking dashboard after save.
      </p>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div>
          <label className={labelClass}>Date Added</label>
          <input
            type="date"
            className={inputClass}
            {...register("dateAdded", { required: true })}
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
          <label className={labelClass}>Customer Name</label>
          <input
            type="text"
            className={inputClass}
            {...register("customerName", { required: true })}
            placeholder="e.g. Farhan Traders"
          />
        </div>

        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="text"
            className={inputClass}
            {...register("phone", { required: true })}
            placeholder="+9715xxxx"
          />
        </div>

        <div>
          <label className={labelClass}>Group Size</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            {...register("groupSize", { valueAsNumber: true })}
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
          <label className={labelClass}>Travel Date</label>
          <input
            type="date"
            className={inputClass}
            {...register("travelDate", { required: true })}
          />
        </div>

        <div>
          <label className={labelClass}>Booking Status</label>
          <select
            className={inputClass}
            {...register("bookingStatus", { required: true })}
          >
            {GROUP_DASHBOARD_STATUS_OPTIONS.map((s) => (
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

        <div>
          <label className={labelClass}>Next Follow Up Date</label>
          <input
            type="date"
            className={inputClass}
            {...register("nextFollowUpDate")}
          />
        </div>

        <div>
          <label className={labelClass}>Next Follow Up Time</label>
          <input
            type="text"
            className={inputClass}
            {...register("nextFollowUpTime")}
            placeholder="e.g. 6:30 PM"
          />
        </div>

        <div>
          <label className={labelClass}>Follow Up Priority</label>
          <select className={inputClass} {...register("followUpPriority")}>
            {GROUP_DASHBOARD_FOLLOW_UP_PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Assigned Agent</label>
          <input
            type="text"
            className={inputClass}
            {...register("assignedAgent")}
            placeholder="Agent name"
          />
        </div>

        <div>
          <label className={labelClass}>Updated By Email</label>
          <input
            type="email"
            className={inputClass}
            {...register("updatedByEmail")}
            placeholder="agent@company.com"
          />
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

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300"
              {...register("reminderDone")}
            />
            <span className={labelClass}>Reminder Done</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300"
              {...register("reminderTriggered")}
            />
            <span className={labelClass}>Reminder Triggered</span>
          </label>
        </div>

        <div>
          <label className={labelClass}>Popup Alert Status</label>
          <select className={inputClass} {...register("popupAlertStatus")}>
            {GROUP_DASHBOARD_POPUP_ALERT_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Reminder / Visit Status</label>
          <select className={inputClass} {...register("reminderVisitStatus")}>
            {GROUP_DASHBOARD_REMINDER_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Visit Status</label>
          <select className={inputClass} {...register("visitStatus")}>
            {GROUP_DASHBOARD_VISIT_STATUS_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            rows={3}
            className={inputClass}
            {...register("notes")}
            placeholder="Notes, remarks, etc."
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg border border-zinc-200 bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? "Saving…" : "Save to database"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
