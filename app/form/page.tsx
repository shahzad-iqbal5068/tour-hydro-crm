 "use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";

type FormValues = {
  date: string;
  shift: string;
  name: string;
  email: string;
  package: string;
  remarks: string;
};

function FormPageContent() {
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
    const fetchBooking = async () => {
      if (!editingId) return;
      try {
        setLoadingExisting(true);
        const res = await fetch(`/api/bookings/${editingId}`);
        if (!res.ok) {
          throw new Error("Failed to load booking");
        }
        const data = await res.json();
        reset({
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
          shift: data.shift || "",
          name: data.name || "",
          email: data.email || "",
          package: data.whatsappPackage || "",
          remarks: data.remarks || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load booking");
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchBooking();
  }, [editingId, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      date: values.date,
      shift: values.shift,
      name: values.name,
      email: values.email,
      whatsappPackage: values.package,
      remarks: values.remarks,
    };

    try {
      const res = await fetch(
        editingId ? `/api/bookings/${editingId}` : "/api/bookings",
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
        editingId ? "Booking updated successfully" : "Booking created successfully"
      );

      if (!editingId) {
        reset();
      } else {
        router.push("/table");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save booking");
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-zinc-200 bg-white dark:bg-black p-6 shadow-sm">
      <Toaster position="top-right" />
      <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {editingId ? "Edit Booking" : "New Booking"}
      </h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
        This is a placeholder form page. Replace these fields with your real
        CRM form later.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-1 block text-sm font-medium text-zinc-800"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 bg-white dark:bg-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              {...register("date", { required: "Date is required" })}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="shift"
              className="mb-1 block text-sm font-medium text-zinc-800"
            >
              Shift
            </label>
            <select
              id="shift"
              className="w-full rounded-md border border-zinc-300 bg-white dark:bg-black px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              defaultValue=""
              {...register("shift", { required: "Shift is required" })}
            >
              <option value="" disabled>
                Select shift
              </option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
            {errors.shift && (
              <p className="mt-1 text-xs text-red-500">{errors.shift.message}</p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-zinc-800"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 bg-white dark:bg-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-zinc-800"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 bg-white dark:bg-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="package"
            className="mb-1 block text-sm font-medium text-zinc-800"
          >
            WhatsApp Package
          </label>
          <select
            id="package"
            className="w-full rounded-md border border-zinc-300 bg-white dark:bg-black px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            defaultValue=""
            {...register("package", { required: "Package is required" })}
          >
            <option value="" disabled>
              Select package
            </option>
            <option value="dow-cruise-tripn">Dow Cruise Trip N</option>
            <option value="cruise-express">Cruise Express</option>
            <option value="fun-and-fun">Fun and Fun</option>
            <option value="yacht-cruise">Yacht &amp; Cruise</option>
            <option value="blue-world">Blue World</option>
          </select>
          {errors.package && (
            <p className="mt-1 text-xs text-red-500">
              {errors.package.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="remarks"
            className="mb-1 block text-sm font-medium text-zinc-800"
          >
            Remarks
          </label>
          <textarea
            id="remarks"
            rows={3}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 bg-white dark:bg-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Type remarks or notes here"
            {...register("remarks")}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || loadingExisting}
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
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
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-zinc-600">Loading form...</div>}>
      <FormPageContent />
    </Suspense>
  );
}

