"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  dashboardKPI,
  dashboardAlerts,
  dashboardTabs,
  masterGroupRows,
  todayFollowUpRows,
  visitLeadRows,
  dueIn15Item,
  liveActivities,
} from "@/data/groupBookingDashboardData";
import type { MasterGroupRow } from "@/data/groupBookingDashboardData";
import { useGroupDashboardLeads } from "@/hooks/api";
import GroupDashboardKPICards from "./GroupDashboardKPICards";
import GroupDashboardAlerts from "./GroupDashboardAlerts";
import GroupDashboardTabs from "./GroupDashboardTabs";
import MasterGroupBookingTable from "./MasterGroupBookingTable";
import GroupDashboardCalendarCards from "./GroupDashboardCalendarCards";
import TodayFollowUpsTable from "./TodayFollowUpsTable";
import VisitLeadsTable from "./VisitLeadsTable";
import DueIn15MinutesCard from "./DueIn15MinutesCard";
import LiveActivityMonitor from "./LiveActivityMonitor";

export default function GroupBookingDashboardClient() {
  const [activeTab, setActiveTab] = useState("control-tower");
  const [alerts, setAlerts] = useState(dashboardAlerts);
  const { data: apiLeads } = useGroupDashboardLeads();

  const masterRowsFromApi: MasterGroupRow[] = useMemo(() => {
    return apiLeads.map((row) => ({
      id: row._id,
      inquiryDate: row.inquiryDate ?? row.dateAdded ?? "—",
      whatsapp: row.whatsapp,
      assignedPerson: row.assignedPerson ?? row.assignedAgent ?? "—",
      confirmBookingDate: row.confirmBookingDate ?? "—",
      customerName: row.customerName,
      contact: row.contact ?? row.phone ?? "—",
      numberOfPersons: row.numberOfPersons ?? row.groupSize ?? 0,
      cruiseName: row.cruiseName ?? "—",
      slotTiming: row.slotTiming ?? "—",
      location: row.location,
      groupNo: row.groupNo ?? "—",
      bookingStatus: row.bookingStatus,
      lastFollowUpDate: row.lastFollowUpDate ?? "—",
      remarks: row.remarks ?? row.notes ?? "—",
      callingDate: row.callingDate ?? "—",
      totalAmount: row.totalAmount ?? "—",
      advancePaid: row.advancePaid ?? "—",
      remainingAmount: row.remainingAmount ?? "—",
    }));
  }, [apiLeads]);

  const allMasterRows =
    apiLeads.length > 0 ? masterRowsFromApi : masterGroupRows;

  /** When a WhatsApp tab is selected, show only that WhatsApp; otherwise show all. Calendar uses all rows. */
  const masterRows =
    activeTab === "control-tower" || activeTab === "calendar"
      ? allMasterRows
      : allMasterRows.filter((r) => r.whatsapp === activeTab);

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header row: title left, follow-up & reminder alerts top right */}
        <div className="mb-6 relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <header className="min-w-full flex-1">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              GROUP BOOKING CONTROL TOWER
            </h1>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Offline HTML view for group inquiry, follow-up, visit tracking,
              reminders, and WhatsApp-wise booking management.
            </p>
          </header>
          {alerts.length > 0 && (
            // <div className="flex shrink-0 flex-col gap-3 sm:ml-4">
            <div className="absolute right-0 top-0 flex flex-col gap-3">

              <GroupDashboardAlerts
                alerts={alerts}
                onDismiss={handleDismissAlert}
              />
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <GroupDashboardKPICards metrics={dashboardKPI} />
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <GroupDashboardTabs
            tabs={dashboardTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Main content: table or calendar cards + Add lead link */}
        <div className="flex flex-col gap-6">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {activeTab === "calendar"
                        ? `${allMasterRows.length} follow-up entr${allMasterRows.length === 1 ? "y" : "ies"}`
                        : apiLeads.length > 0
                          ? activeTab === "control-tower"
                            ? `${apiLeads.length} lead(s) from database`
                            : `${masterRows.length} lead(s) for ${activeTab}`
                          : "Sample data below. Add a lead to save to the database."}
                  </span>
                  <Link
                    href="/bookings/group/dashboard/lead/new"
                    className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    + Add group lead
                  </Link>
                </div>
                {activeTab === "calendar" ? (
                  <GroupDashboardCalendarCards rows={allMasterRows} />
                ) : (
                  <MasterGroupBookingTable rows={masterRows} />
                )}
              </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start">
              <div className="min-w-0 flex-1 lg:min-w-0">
                <TodayFollowUpsTable rows={todayFollowUpRows} />
              </div>
              <div className="min-w-0 shrink-0 lg:w-80">
                <LiveActivityMonitor activities={liveActivities} />
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start">
              <div className="min-w-0 flex-1 lg:min-w-0">
                <VisitLeadsTable rows={visitLeadRows} />
              </div>
              <div className="min-w-0 shrink-0 lg:w-80">
                <DueIn15MinutesCard item={dueIn15Item} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
