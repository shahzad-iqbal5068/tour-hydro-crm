"use client";

import { useEffect, useState, type ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "../components/layout/Sidebar";
import { Navbar } from "../components/layout/Navbar";
import type { SectionKey, AuthUser } from "@/types";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

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
      icon: <LayoutDashboard className="h-5 w-5" />,
      items: [
        { href: "/", label: "Home" },
        // { href: "/table", label: "Overview" },
      ],
    },
    {
      key: "inqueries",
      label: "Inqueries",
      icon: <ClipboardList className="h-5 w-5" />,
      items: [
        { href: "/inqueries/form", label: "New Inquiry" },
        { href: "/inqueries", label: "All Inqueries" },
        // { href: "/attendance", label: "Follow-up" },
      ],
    },
    {
      key: "admin",
      label: "Admin",
      icon: <ShieldCheck className="h-5 w-5" />,
      items: [
        { href: "/admin/users", label: "Users" },
        { href: "/admin/attendance", label: "Attendance overview" },
      ],
    },
    {
      key: "attendance",
      label: "Attendance",
      icon: <CalendarClock className="h-5 w-5" />,
      items: [{ href: "/attendance", label: "My Attendance" }],
    },
    
  ];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  // Important: keep initial render deterministic to avoid hydration mismatch.
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

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
        avatarUrl?: string;
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        avatarUrl: decoded.avatarUrl,
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
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-700 dark:bg-black dark:text-zinc-50">
      <Navbar
        sectionLabel={currentSection.label}
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        mounted={mounted}
        onToggleSidebar={() =>
          setMobileSidebarOpen((prev) => !prev)
        }
      />

      <div className="flex flex-1">
        <Sidebar
          sections={sections}
          activeSection={activeSection}
          onActiveSectionChange={setActiveSection}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1 bg-zinc-50 p-4 text-zinc-700 dark:bg-black dark:text-zinc-50 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

