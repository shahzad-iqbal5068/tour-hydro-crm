import type { Metadata } from "next";
import { ThemeModeSection } from "@/components/settings/ThemeModeSection";
import { AccountGeneralSection } from "@/components/settings/AccountGeneralSection";

export const metadata: Metadata = {
  title: "Settings | Hydro CRM",
  description: "Application settings.",
};

type ThemeMode = "light" | "dark" | "system";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Choose your theme mode and view basic account info.
        </p>
      </header>

      <ThemeModeSection />
      <AccountGeneralSection />

      <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Account
        </h2>
        <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
          <li>Email: demo@example.com</li>
          <li>Role: Manager</li>
          <li>Status: Active</li>
        </ul>
      </section>
    </div>
  );
}

