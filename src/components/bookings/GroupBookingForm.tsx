"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

export type GroupBookingFormValues = {
  groupBookingName: string;
  guestName: string;
  contactWhatsapp: string;
  groupsCount: number;
  cruiseName: string;
  numberOfPax: number;
  timeSlot: string;
  inquiryDate: string;
  confirmDate: string;
  bookingStatusRemarks: string;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  callingDate: string;
  remarks: string;
};

export function getDefaultGroupBookingFormValues(): GroupBookingFormValues {
  return {
    groupBookingName: "",
    guestName: "",
    contactWhatsapp: "",
    groupsCount: 1,
    cruiseName: "",
    numberOfPax: 0,
    timeSlot: "",
    inquiryDate: "",
    confirmDate: "",
    bookingStatusRemarks: "",
    totalAmount: 0,
    advancePaid: 0,
    remainingAmount: 0,
    callingDate: "",
    remarks: "",
  };
}

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50";
const labelClass = "mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200";

export type GroupBookingFormProps = {
  initialValues?: GroupBookingFormValues | null;
  isEditing: boolean;
  onSubmit: (values: GroupBookingFormValues) => Promise<void>;
  onCancel?: () => void;
};

export default function GroupBookingForm({
  initialValues,
  isEditing,
  onSubmit,
  onCancel,
}: GroupBookingFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<GroupBookingFormValues>({
    defaultValues: initialValues ?? getDefaultGroupBookingFormValues(),
  });

  useEffect(() => {
    reset(initialValues ?? getDefaultGroupBookingFormValues());
  }, [initialValues, reset]);

  const handleFormSubmit = async (values: GroupBookingFormValues) => {
    await onSubmit(values);
    reset(getDefaultGroupBookingFormValues());
  };

  return (
    <div className="w-full shrink-0 rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5 lg:max-w-sm">
      <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {isEditing ? "Edit group booking" : "New group booking"}
      </h2>
      <p className="mb-4 text-[11px] text-zinc-600 dark:text-zinc-400">
        Fill in group booking details, guest, cruise, amounts and dates.
      </p>
      <form className="space-y-3" onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label className={labelClass}>Group booking name</label>
          <input type="text" className={inputClass} {...register("groupBookingName", { required: true })} placeholder="Group name" />
        </div>
        <div>
          <label className={labelClass}>Guest name</label>
          <input type="text" className={inputClass} {...register("guestName", { required: true })} />
        </div>
        <div>
          <label className={labelClass}>Contact / WhatsApp number</label>
          <input type="text" className={inputClass} {...register("contactWhatsapp", { required: true })} placeholder="e.g. 05x xxx xxxx" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Groups #</label>
            <input type="number" min={1} className={inputClass} {...register("groupsCount", { valueAsNumber: true })} />
          </div>
          <div>
            <label className={labelClass}>Number of pax</label>
            <input type="number" min={0} className={inputClass} {...register("numberOfPax", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Cruise name</label>
          <input type="text" className={inputClass} {...register("cruiseName", { required: true })} />
        </div>
        <div>
          <label className={labelClass}>Time slot</label>
          <input type="text" className={inputClass} {...register("timeSlot")} placeholder="e.g. Morning" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Inquiry date</label>
            <input type="date" className={inputClass} {...register("inquiryDate")} />
          </div>
          <div>
            <label className={labelClass}>Confirm date</label>
            <input type="date" className={inputClass} {...register("confirmDate")} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Booking status / remarks</label>
          <input type="text" className={inputClass} {...register("bookingStatusRemarks")} placeholder="Status or notes" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelClass}>Total amount</label>
            <input type="number" min={0} className={inputClass} {...register("totalAmount", { valueAsNumber: true })} />
          </div>
          <div>
            <label className={labelClass}>Advance paid</label>
            <input type="number" min={0} className={inputClass} {...register("advancePaid", { valueAsNumber: true })} />
          </div>
          <div>
            <label className={labelClass}>Remaining amount</label>
            <input type="number" min={0} className={inputClass} {...register("remainingAmount", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Calling date</label>
          <input type="date" className={inputClass} {...register("callingDate")} />
        </div>
        <div>
          <label className={labelClass}>Remarks</label>
          <textarea rows={2} className={inputClass} {...register("remarks")} placeholder="Notes, calling remarks, etc." />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? (isEditing ? "Saving…" : "Submitting…") : isEditing ? "Save changes" : "Submit"}
          </button>
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
