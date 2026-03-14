"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type BookingFormValues = {
  date: string;
  time: string;
  pax: number;
  guestName: string;
  phone: string;
  collection: number;
  paid: number;
  balance: number;
  deck: string;
  remarks: string;
  callingRemarks: string;
  followUpDate: string;
  followUpNote: string;
  userId: string;
};

export type BookingVariant = "4-5" | "3";

export function getDefaultFormValues(): BookingFormValues {
  return {
    date: new Date().toISOString().slice(0, 10),
    time: "",
    pax: 1,
    guestName: "",
    phone: "",
    collection: 0,
    paid: 0,
    balance: 0,
    deck: "",
    remarks: "",
    callingRemarks: "",
    followUpDate: "",
    followUpNote: "",
    userId: "",
  };
}

const TIME_PRESETS = [
  "4:30 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
] as const;

const DECK_PRESETS = ["Upper deck", "Lower deck"] as const;

const CALLING_REMARKS_PRESETS = [
  "Coming",
  "N/A",
  "No",
  "Not working",
  "Line busy",
  "Not confirm",
  "Plan change",
  "Booked with other company",
  "Not sure",
] as const;

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50";
const labelClass = "mb-1 block text-[11px] font-medium text-zinc-800 dark:text-zinc-200";

type UserOption = { id: string; name: string };

export type BookingFormProps = {
  initialValues?: BookingFormValues | null;
  formCategory: BookingVariant;
  onFormCategoryChange: (value: BookingVariant) => void;
  isEditing: boolean;
  users: UserOption[];
  onSubmit: (values: BookingFormValues) => Promise<void>;
  onCancel?: () => void;
};

export default function BookingForm({
  initialValues,
  formCategory,
  onFormCategoryChange,
  isEditing,
  users,
  onSubmit,
  onCancel,
}: BookingFormProps) {
  const [timeMode, setTimeMode] = useState<"preset" | "custom">("preset");
  const [timePreset, setTimePreset] = useState<string>("");
  const [callingMode, setCallingMode] = useState<"preset" | "custom">("preset");
  const [callingPreset, setCallingPreset] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<BookingFormValues>({
    defaultValues: initialValues ?? getDefaultFormValues(),
  });

  useEffect(() => {
    const values = initialValues ?? getDefaultFormValues();
    reset(values);
    if (TIME_PRESETS.includes(values.time as (typeof TIME_PRESETS)[number])) {
      setTimeMode("preset");
      setTimePreset(values.time);
    } else {
      setTimeMode("custom");
      setTimePreset("");
    }
    if (CALLING_REMARKS_PRESETS.includes(values.callingRemarks as (typeof CALLING_REMARKS_PRESETS)[number])) {
      setCallingMode("preset");
      setCallingPreset(values.callingRemarks);
    } else {
      setCallingMode("custom");
      setCallingPreset("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync when initialValues (edit target) changes
  }, [initialValues]);

  const handleFormSubmit = async (values: BookingFormValues) => {
    await onSubmit(values);
    reset(getDefaultFormValues());
    setTimeMode("preset");
    setTimePreset("");
    setCallingMode("preset");
    setCallingPreset("");
  };

  return (
    <div className="w-full shrink-0 rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5 lg:max-w-sm">
      <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {isEditing ? "Edit booking" : "New booking"}
      </h2>
      <p className="mb-4 text-[11px] text-zinc-600 dark:text-zinc-400">
        Fill in booking time, guest details and payment information.
      </p>
      <div>
        <label className={labelClass}>Category</label>
        <div className="mt-1 inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="category"
              value="4-5"
              checked={formCategory === "4-5"}
              onChange={() => onFormCategoryChange("4-5")}
              className="sr-only"
            />
            <span
              className={`block rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                formCategory === "4-5"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              }`}
            >
              4–5 Star
            </span>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="category"
              value="3"
              checked={formCategory === "3"}
              onChange={() => onFormCategoryChange("3")}
              className="sr-only"
            />
            <span
              className={`block rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                formCategory === "3"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              }`}
            >
              3 Star
            </span>
          </label>
        </div>
        <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
          {isEditing ? "Booking category (from row)." : "Choose category for new booking."}
        </p>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label className={labelClass}>Assigned to (employee)</label>
          <select className={inputClass} {...register("userId")}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">For performance tracking</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Time</label>
            <div className="space-y-2">
              <select
                value={timeMode === "preset" ? timePreset : "__CUSTOM__"}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__CUSTOM__") {
                    setTimeMode("custom");
                    setTimePreset("");
                    setValue("time", "", { shouldValidate: true });
                    return;
                  }
                  setTimeMode("preset");
                  setTimePreset(v);
                  setValue("time", v, { shouldValidate: true });
                }}
                className={inputClass}
              >
                <option value="">Select time</option>
                {TIME_PRESETS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="__CUSTOM__">Custom time…</option>
              </select>
              {timeMode === "custom" && (
                <input
                  type="text"
                  placeholder="e.g. 6:15 PM"
                  className={inputClass}
                  {...register("time", { required: true })}
                />
              )}
              {timeMode === "preset" && <input type="hidden" {...register("time", { required: true })} />}
            </div>
          </div>
          <div>
            <label className={labelClass}>Pax</label>
            <input type="number" min={1} className={inputClass} {...register("pax", { required: true, valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Guest name</label>
            <input type="text" className={inputClass} {...register("guestName", { required: true })} />
          </div>
          <div>
            <label className={labelClass}>Number</label>
            <input
              type="text"
              placeholder="05x xxx xxxx"
              className={inputClass}
              {...register("phone", { required: true })}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Collection</label>
            <input type="number" min={0} className={inputClass} {...register("collection", { required: true, valueAsNumber: true })} />
          </div>
          <div>
            <label className={labelClass}>Paid</label>
            <input type="number" min={0} className={inputClass} {...register("paid", { required: true, valueAsNumber: true })} />
          </div>
          <div>
            <label className={labelClass}>Balance</label>
            <input type="number" min={0} className={inputClass} {...register("balance", { required: true, valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Deck</label>
            <select className={inputClass} {...register("deck")}>
              <option value="">Select deck</option>
              {DECK_PRESETS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Booking Date</label>
            <input type="date" className={inputClass} {...register("date", { required: true })} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Remarks</label>
          <textarea rows={2} className={inputClass} {...register("remarks")} />
        </div>

        <div>
          <label className={labelClass}>Calling remarks</label>
          <div className="space-y-2">
            <select
              value={callingMode === "preset" ? callingPreset : "__CUSTOM__"}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__CUSTOM__") {
                  setCallingMode("custom");
                  setCallingPreset("");
                  setValue("callingRemarks", "", { shouldValidate: true });
                  return;
                }
                setCallingMode("preset");
                setCallingPreset(v);
                setValue("callingRemarks", v, { shouldValidate: true });
              }}
              className={inputClass}
            >
              <option value="">Select calling remark</option>
              {CALLING_REMARKS_PRESETS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="__CUSTOM__">Custom…</option>
            </select>
            {callingMode === "custom" && (
              <textarea
                rows={2}
                placeholder="Write custom calling remark..."
                className={inputClass}
                {...register("callingRemarks")}
              />
            )}
            {callingMode === "preset" && <input type="hidden" {...register("callingRemarks")} />}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Follow-up date</label>
            <input type="date" className={inputClass} {...register("followUpDate")} />
            <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">Reminder date (optional)</p>
          </div>
          <div>
            <label className={labelClass}>Follow-up note</label>
            <input
              type="text"
              placeholder="e.g. Call again, Send WhatsApp"
              className={inputClass}
              {...register("followUpNote")}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? (isEditing ? "Saving..." : "Submitting...") : isEditing ? "Save changes" : "Submit"}
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
