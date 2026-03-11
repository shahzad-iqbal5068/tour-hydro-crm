"use client";

import { useEffect, useState, type ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import type { SectionKey, AuthUser } from "@/types";

const sections: {
  key: SectionKey;
  label: string;
  icon: ReactNode;
  items: { href: string; label: string }[];
}[] =
  [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: (
        <span className="inline-block h-5 w-5 rounded-md border border-zinc-500" />
      ),
      items: [
        { href: "/", label: "Home" },
        { href: "/table", label: "Overview" },
      ],
    },
    {
      key: "bookings",
      label: "Bookings",
      icon: <span className="inline-block h-5 w-5 border-b-2 border-zinc-500" />,
      items: [
        { href: "/form", label: "New Booking" },
        { href: "/table", label: "All Bookings" },
      ],
    },
    {
      key: "admin",
      label: "Admin",
      icon: (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-zinc-500 text-[10px] font-semibold">
          A
        </span>
      ),
      items: [
        { href: "/admin/users", label: "Users" },
        { href: "/login", label: "Login" },
      ],
    },
  ];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const [theme, setTheme] = useState<"light" | "dark">(
    (typeof window !== "undefined" &&
      (window.localStorage.getItem("theme") as "light" | "dark" | null)) ||
      "light"
  );
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    // Read JWT from cookie on the client
    const cookie = typeof document !== "undefined" ? document.cookie : "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      if (!isAuthPage) {
        router.replace("/login");
      }
      return;
    }

    try {
      const payloadPart = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadPart)) as {
        id: string;
        email: string;
        name: string;
        role: string;
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      });
      if (isAuthPage) {
        router.replace("/");
      }
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      if (!isAuthPage) {
        router.replace("/login");
      }
    }
  }, [pathname, isAuthPage, router]);

  const toggleTheme = () => {
    const next: "light" | "dark" = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.localStorage.setItem("theme", next);
  };

  // Keep sidebar selection in sync with route, but let icon clicks win
  useEffect(() => {
    const matched = sections.find((section) =>
      section.items.some((item) => item.href === pathname)
    );
    if (matched && matched.key !== activeSection) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection(matched.key);
    }
  }, [pathname, activeSection]);

  const currentSection =
    sections.find((section) => section.key === activeSection) || sections[0];

  if (isAuthPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-700 dark:bg-black dark:text-zinc-50">
        <main className="w-full max-w-md p-4">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-700 dark:bg-black dark:text-zinc-50">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onActiveSectionChange={setActiveSection}
      />

      <div className="flex min-h-screen flex-1 flex-col md:flex-row">
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar
            sectionLabel={currentSection.label}
            theme={theme}
            onToggleTheme={toggleTheme}
            user={user}
          />

          <main className="min-w-0 flex-1 bg-zinc-50 p-4 text-zinc-700 dark:bg-black dark:text-zinc-50 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

