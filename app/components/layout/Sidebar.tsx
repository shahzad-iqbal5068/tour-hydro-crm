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
};

export function Sidebar({
  sections,
  activeSection,
  onActiveSectionChange,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentSection =
    sections.find((s) => s.key === activeSection) ?? sections[0];

  return (
    <>
      {/* Icon sidebar */}
      <aside className="hidden w-16 flex-col border-r border-zinc-200 bg-white py-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:flex">
        <div className="mb-6 flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          HC
        </div>
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
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-zinc-600 dark:text-zinc-200 ${
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

