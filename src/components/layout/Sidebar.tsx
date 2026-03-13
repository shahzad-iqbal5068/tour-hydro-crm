"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { SectionKey } from "@/types";

type SidebarSection = {
  key: SectionKey;
  label: string;
  icon: ReactNode;
  items: { href: string; label: string }[];
};

type SidebarProps = {
  sections: SidebarSection[];
  activeSection: SectionKey;
  onActiveSectionChange: (key: SectionKey) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export function Sidebar({
  sections,
  activeSection,
  onActiveSectionChange,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentSection =
    sections.find((s) => s.key === activeSection) ?? sections[0];

  return (
    <>
      {/* Mobile overlay sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div className="flex w-64 flex-col border-r border-zinc-200 bg-white py-4 text-sm shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Hydro CRM
                </span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-full px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>
            <div className="flex border-b border-zinc-200 px-4 pb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              Sections
            </div>
            <nav className="flex gap-3 px-4 py-3">
              {sections.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => {
                    onActiveSectionChange(section.key);
                    const firstItem = section.items[0];
                    if (firstItem) {
                      router.push(firstItem.href);
                    }
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-zinc-600 dark:text-zinc-200 ${
                    currentSection.key === section.key
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                      : "border-transparent bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                  aria-label={section.label}
                >
                  {section.icon}
                </button>
              ))}
            </nav>
            <div className="mt-1 border-t border-zinc-200 px-4 pt-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {currentSection.label}
            </div>
            <nav className="mt-1 space-y-1 px-2">
              {currentSection.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`block rounded-md px-3 py-2 text-sm ${
                      active
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 bg-black/40"
            aria-label="Close sidebar"
          />
        </div>
      )}

      {/* Icon sidebar */}
      <aside className="hidden w-16 flex-col border-r border-zinc-200 bg-white py-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:flex">
        {/* Sidebar icons */}
        <nav className="flex flex-1 flex-col items-center gap-4">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => {
                onActiveSectionChange(section.key);
                const firstItem = section.items[0];
                if (firstItem) {
                  router.push(firstItem.href);
                }
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border text-zinc-600 dark:text-zinc-200 transition-colors ${
                currentSection.key === section.key
                  ? "border-transparent bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-sm dark:from-sky-400 dark:to-indigo-500"
                  : "border-transparent bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              }`}
              aria-label={section.label}
            >
              {section.icon}
            </button>
          ))}
        </nav>
      </aside>

      {/* Sub-sidebar with names */}
      <aside className="hidden w-56 flex-col border-r border-zinc-200 bg-white px-4 py-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:flex">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {currentSection.label}
        </div>
        <nav className="space-y-1">
          {currentSection.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm ${
                  active
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

