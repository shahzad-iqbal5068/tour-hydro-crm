"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { InquiryFormValues as FormValues, AuthUser } from "@/types";
import type { UserOption } from "@/hooks/api";

type InquiryFormProps = {
  editingId: string | null;
  loadingExisting: boolean;
  inquiry: {
    date?: string;
    shift: string;
    whatsappName: string;
    remarks?: string;
    contact?: string;
    userId?: string | null;
  } | null;
  users: UserOption[];
  currentUser: AuthUser | null;
  onSubmitForm: (values: FormValues) => Promise<void>;
};

export function InquiryForm({
  editingId,
  loadingExisting,
  inquiry,
  users,
  currentUser,
  onSubmitForm,
}: InquiryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      shift: "",
      whatsappName: "",
      remarks: "",
      contact: "",
      userId: "",
    },
  });

  // Reset when editingId / inquiry changes; auto-select current user when creating new
  useEffect(() => {
    if (!editingId) {
      reset({
        date: new Date().toISOString().split("T")[0],
        shift: "",
        whatsappName: "",
        remarks: "",
        contact: "",
        userId: currentUser?.id ?? "",
      });
      return;
    }
    if (inquiry) {
      reset({
        date: inquiry.date ? new Date(inquiry.date).toISOString().slice(0, 10) : "",
        shift: inquiry.shift || "",
        whatsappName: inquiry.whatsappName || "",
        remarks: inquiry.remarks || "",
        contact: inquiry.contact || "",
        userId: inquiry.userId || "",
      });
    }
  }, [editingId, inquiry, reset, currentUser]);

  const onSubmit = async (values: FormValues) => {
    try {
      await onSubmitForm(values);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save inquiry");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
            Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && (
            <p className="mt-1 text-[11px] text-red-500">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
            Shift
          </label>
          <select
            className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
            {...register("shift", { required: "Shift is required" })}
          >
            <option value="">Select shift</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
          {errors.shift && (
            <p className="mt-1 text-[11px] text-red-500">{errors.shift.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
          Name
        </label>
        <select
          className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          {...register("userId")}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
          Users created by admin. Optional. Defaults to the logged-in user.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
          Contact
        </label>
        <input
          type="text"
          className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          placeholder="+9715…"
          {...register("contact")}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
          WhatsApp Name
        </label>
        <select
          className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          {...register("whatsappName", { required: "WhatsApp Name is required" })}
        >
          <option value="">Select WhatsApp Name</option>
          <option value="dow-cruise-tripn">Dow Cruise Trip</option>
          <option value="cruise-express">Cruise Express</option>
          <option value="fun-and-fun">Fun &amp; Fun</option>
          <option value="yacht-cruise">Yacht &amp; Cruise</option>
          <option value="blue-world">Blue World</option>
          <option value="fun-factory">Fun Factory</option>
          <option value="dubai-deals">Dubai Deals</option>
        </select>
        {errors.whatsappName && (
          <p className="mt-1 text-[11px] text-red-500">{errors.whatsappName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
          Remarks
        </label>
        <textarea
          rows={3}
          className="w-full rounded-md border border-zinc-300 bg-white py-1.5 px-2 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
          placeholder="Type remarks or notes here"
          {...register("remarks")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting || loadingExisting}
          className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSubmitting || loadingExisting
            ? editingId
              ? "Saving..."
              : "Submitting..."
            : editingId
            ? "Save changes"
            : "Submit"}
        </button>
      </div>
    </form>
  );
}

