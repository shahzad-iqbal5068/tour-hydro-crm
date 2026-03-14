"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "../components/layout/Sidebar";
import { Navbar } from "../components/layout/Navbar";
import type { SectionKey, AuthUser } from "@/types";
import { hasPermission, Permission, type PermissionKey } from "@/lib/permissions-config";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  ShieldCheck,
  TicketPercent,
  BellRing,
  Home,
  UsersRound,
  TrendingUp,
  Users,
  ClipboardCheck,
  CalendarCheck,
} from "lucide-react";

const sections: {
  key: SectionKey;
  label: string;
  icon: ReactNode;
  items: { href: string; label: string; icon?: ReactNode }[];
  /** Show this section only if user has at least one of these permissions (omit = all roles) */
  requiredPermissions?: PermissionKey[];
}[] =
  [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      items: [
        { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
      ],
    },
    {
      key: "inqueries",
      label: "Inqueries",
      icon: <ClipboardList className="h-5 w-5" />,
      items: [
        { href: "/inqueries", label: "Inqueries", icon: <ClipboardList className="h-4 w-4" /> },
      ],
    },
    {
      key: "bookings",
      label: "Bookings",
      icon: <TicketPercent className="h-5 w-5" />,
      items: [
        { href: "/bookings", label: "Bookings", icon: <TicketPercent className="h-4 w-4" /> },
        { href: "/bookings/group", label: "Group bookings", icon: <UsersRound className="h-4 w-4" /> },
      ],
    },
    {
      key: "followups",
      label: "Follow-ups",
      icon: <BellRing className="h-5 w-5" />,
      items: [
        { href: "/followups", label: "Follow-ups", icon: <BellRing className="h-4 w-4" /> },
      ],
    },
    {
      key: "admin",
      label: "Admin",
      icon: <ShieldCheck className="h-5 w-5" />,
      items: [
        { href: "/admin/performance", label: "Performance", icon: <TrendingUp className="h-4 w-4" /> },
        { href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
        { href: "/admin/attendance", label: "Attendance overview", icon: <ClipboardCheck className="h-4 w-4" /> },
      ],
      requiredPermissions: [Permission.MANAGE_USERS, Permission.VIEW_ALL_ATTENDANCE],
    },
    {
      key: "attendance",
      label: "Attendance",
      icon: <CalendarClock className="h-5 w-5" />,
      items: [{ href: "/attendance", label: "My Attendance", icon: <CalendarCheck className="h-4 w-4" /> }],
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

  // Hydration: read theme from localStorage only after mount to avoid mismatch
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- intentional post-mount sync */
    setMounted(true);
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
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

  const { visibleSections, visibleSectionKeys } = useMemo(() => {
    const list = sections.filter(
      (s) =>
        !s.requiredPermissions?.length ||
        (user && s.requiredPermissions.some((p) => hasPermission(user.role, p)))
    );
    return {
      visibleSections: list,
      visibleSectionKeys: list.map((s) => s.key).join(","),
    };
  }, [user]);

  // Keep sidebar selection in sync with route (use stable key so effect doesn't run every render)
  useEffect(() => {
    const matched = sections.find((section) =>
      section.items.some((item) => item.href === pathname)
    );
    if (!matched) return;
    const isVisible = visibleSections.some((s) => s.key === matched.key);
    if (isVisible && matched.key !== activeSection) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- sync route to sidebar selection */
      setActiveSection(matched.key);
    } else if (!isVisible && visibleSections.length > 0) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- sync route to sidebar selection */
      setActiveSection(visibleSections[0].key);
    }
    // visibleSectionKeys used intentionally instead of visibleSections to avoid effect on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps -- visibleSections read from closure when pathname/sectionKeys change
  }, [pathname, activeSection, visibleSectionKeys]);

  const currentSection =
    visibleSections.find((section) => section.key === activeSection) || visibleSections[0];

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
          sections={visibleSections}
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

