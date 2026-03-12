"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import type { InquiryFormValues as FormValues, InquiryFormValues } from "@/types";

export function FormPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editingId = searchParams.get("id");

  const [loadingExisting, setLoadingExisting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    const fetchInquiry = async () => {
      if (!editingId) return;
      try {
        setLoadingExisting(true);
        const res = await fetch(`/api/inquiries/${editingId}`);
        if (!res.ok) {
          throw new Error("Failed to load inquiry");
        }
        const data = await res.json();
        reset({
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
          shift: data.shift || "",
          whatsappName: data.whatsappName || "",
          remarks: data.remarks || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load inquiry");
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchInquiry();
  }, [editingId, reset]);

  const onSubmit = async (values: InquiryFormValues) => {
    const payload = {
      date: values.date,
      shift: values.shift,
      whatsappName: values.whatsappName,
      remarks: values.remarks,
    };

    try {
      const res = await fetch(
        editingId ? `/api/inquiries/${editingId}` : "/api/inquiries",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      console.log("Form submitted:", data);
      toast.success(
        editingId ? "Inquiry updated successfully" : "Inquiry created successfully"
      );

      if (!editingId) {
        reset();
      } else {
        router.push("/inqueries");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save booking");
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black sm:p-6 shadow-sm">
      <Toaster position="top-right" />
      <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {editingId ? "Edit Inquiry" : "New Inquiry"}
      </h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
        Capture tourist cruise new inquiry details, WhatsApp Name, shift and
        Remarks.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Date
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                📅
              </span>
              <input
                id="date"
                type="date"
                className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-8 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                {...register("date", { required: "Date is required" })}
                defaultValue={new Date().toISOString().split("T")[0]} // auto today's date
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="shift"
              className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Shift
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                🕒
              </span>
              <select
                id="shift"
                className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-8 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
                defaultValue=""
                {...register("shift", { required: "Shift is required" })}
              >
                <option value="" disabled>
                  Select shift
                </option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            {errors.shift && (
              <p className="mt-1 text-xs text-red-500">{errors.shift.message}</p>
            )}
          </div>
        </div>
        <div>
          
        </div>
        <div>
         
        </div>
        <div>
          <label
            htmlFor="package"
            className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            WhatsApp Name
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
              🛳️
            </span>
            <select
              id="package"
              className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-8 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              defaultValue=""
              {...register("whatsappName", { required: "WhatsApp Name is required" })}
            >
              <option value="" disabled>
                Select WhatsApp Name
              </option>
              <option value="dow-cruise-tripn">Dow Cruise Trip </option>
              <option value="cruise-express">Cruise Express</option>
              <option value="fun-and-fun">Fun  &amp; Fun</option>
              <option value="yacht-cruise">Yacht &amp; Cruise</option>
              <option value="blue-world">Blue World</option>
              <option value="fun-factory">Fun Factory</option>
              <option value="fun-factory">Dubai Deals</option>
            </select>
          </div>
          {errors.whatsappName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.whatsappName.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="remarks"
            className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Remarks
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-2 text-zinc-400">
              📝
            </span>
            <textarea
              id="remarks"
              rows={3}
              className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-8 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              placeholder="Type remarks or notes here"
              {...register("remarks")}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || loadingExisting}
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting || loadingExisting
              ? editingId
                ? "Saving..."
                : "Submitting..."
              : editingId
                ? "Save Changes"
                : "Submit"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => router.push("/table")}
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
