import type { Metadata } from "next";
import { Suspense } from "react";
import { FormPageContent } from "./FormPageContent";

export const metadata: Metadata = {
  title: "New Booking | Hydro CRM",
  description:
    "Capture tourist cruise booking details, WhatsApp package selection, shift and remarks.",
};

export default function FormPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-zinc-600 dark:text-zinc-400">
          Loading form...
        </div>
      }
    >
      <FormPageContent />
    </Suspense>
  );
}
