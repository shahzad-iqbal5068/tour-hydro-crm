"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import type { InquiryFormValues as FormValues, AuthUser } from "@/types";
import { useInquiries, useInquiry, useUsersList } from "@/hooks/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { InquiriesTable } from "./InquiriesTable";
import { InquiryForm } from "./InquiryForm";

export default function TablePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");

  const { data: rows, isLoading: loading, error: inquiriesError, createMutation, updateMutation, deleteMutation } =
    useInquiries();
  const { data: inquiry, isLoading: loadingExisting } = useInquiry(editingId);
  const { data: users = [] } = useUsersList();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteLoading = deleteMutation.isPending;
  const [currentUser] = useState<AuthUser | null>(() => {
    if (typeof document === "undefined") return null;
    const cookie = document.cookie ?? "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) return null;

    try {
      const payloadPart = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadPart)) as {
        id: string;
        email: string;
        name: string;
        role: string;
        avatarUrl?: string;
      };
      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        avatarUrl: decoded.avatarUrl,
      };
    } catch {
      return null;
    }
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      date: values.date,
      shift: values.shift,
      whatsappName: values.whatsappName,
      remarks: values.remarks,
      contact: values.contact,
      userId: values.userId || undefined,
    };
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, body: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      toast.success(editingId ? "Inquiry updated successfully" : "Inquiry created successfully");
      if (editingId) {
        router.push("/inqueries");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save inquiry");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/inqueries?id=${id}`);
  };

  const openDeleteModal = (id: string) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Inquiry deleted");
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    }
  };

  const error = inquiriesError ? (inquiriesError as Error).message : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <Toaster position="top-right" />
        <PageLoader message="Loading inquiries…" fullScreen />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Inquiries
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              All submissions from the WhatsApp Name form.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Print
            </button>
          </div>
        </div>

        <InquiriesTable rows={rows} error={error} onEdit={handleEdit} onRequestDelete={openDeleteModal} />
      </div>

      <div className="w-full shrink-0 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5 lg:max-w-sm">
        <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {editingId ? "Edit inquiry" : "New inquiry"}
        </h2>
        <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400">
          Capture tourist cruise inquiry details, assign a user (name), contact, WhatsApp Name, shift and remarks.
        </p>
        <InquiryForm
          editingId={editingId}
          loadingExisting={loadingExisting}
          inquiry={inquiry}
          users={users}
          currentUser={currentUser}
          onSubmitForm={onSubmit}
        />
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-4 text-xs shadow-lg dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
            <div className="mb-3">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Delete inquiry?
              </h3>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                This will permanently remove this inquiry from the list. You can&apos;t undo this action.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="rounded-md bg-red-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
