"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  dashboardTabs,
  visitLeadRows,
  dueIn15Item,
  liveActivities,
} from "@/data/groupBookingDashboardData";
import type { MasterGroupRow, AlertItem } from "@/types/groupBookingDashboardData";
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
import getUpcomingFollowUps from "@/components/ui/getUpcomingFollowUps";
import { daysUntil } from "../ui/daysUtils";




export default function GroupBookingDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("control-tower");
  const { data: apiLeads, deleteMutation } = useGroupDashboardLeads();

 
  const masterRowsFromApi: MasterGroupRow[] = useMemo(() => {
    return apiLeads.map((row) => ({
      id: row._id,
      inquiryDate: row.inquiryDate ?? row.dateAdded ?? "—",
      whatsapp: (row.whatsapp ?? "Fun Factory") as MasterGroupRow["whatsapp"],
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

  // Use only live data from the database for the master dashboard
  const allMasterRows = masterRowsFromApi;
 
  /** When a WhatsApp tab is selected, show only that WhatsApp; otherwise show all. Calendar uses all rows. */
  const masterRows =
    activeTab === "control-tower" || activeTab === "calendar"
      ? allMasterRows
      : allMasterRows.filter((r) => r.whatsapp === activeTab);

  const kpiMetrics = useMemo(() => {
    const totalActive = allMasterRows.length;
    const notDone = allMasterRows.filter(
      (r) => r.bookingStatus?.toLowerCase() !== "done"
    );

    const followUpsToday = notDone.filter((r) => {
      const d = daysUntil(r.confirmBookingDate);
      return d === 0;
    }).length;

    const overdueFollowUps = notDone.filter((r) => {
      const d = daysUntil(r.confirmBookingDate);
      return d !== null && d < 0;
    }).length;

    const confirmedBookings = allMasterRows.filter(
      (r) => r.bookingStatus?.toLowerCase() === "done"
    ).length;

    const cancelledOrNoReply = allMasterRows.filter(
      (r) => r.bookingStatus?.toLowerCase() === "not done"
    ).length;

    const highPriority = notDone.filter((r) => {
      const d = daysUntil(r.confirmBookingDate);
      return d !== null && d >= 0 && d <= 1;
    }).length;

    return [
      { label: "Total Active Group Leads", value: totalActive },
      { label: "Follow Ups Today", value: followUpsToday },
      { label: "Overdue Follow Ups", value: overdueFollowUps },
      { label: "Due in 15 Minutes", value: 0 },
      { label: "Visit Leads Today", value: 0 },
      { label: "Confirmed Bookings", value: confirmedBookings },
      { label: "Cancelled / No Reply", value: cancelledOrNoReply },
      { label: "High Priority Leads", value: highPriority },
    ];
  }, [allMasterRows]);

  const alerts: AlertItem[] = useMemo(() => {
    const upcoming = getUpcomingFollowUps(allMasterRows);
    return upcoming.map((row) => ({
      id: row.id,
      type: "follow-up",
      title: "Upcoming follow-up",
      message: `${row.customerName} • ${row.confirmBookingDate || "No date"}`,
    }));
  }, [allMasterRows]);

  const handleEditLead = (row: MasterGroupRow) => {
    router.push(`/bookings/group/gb-form?id=${row.id}`);
  };

  const handleDeleteLead = async (row: MasterGroupRow) => {
    if (!window.confirm(`Delete group lead for ${row.customerName}?`)) return;
    try {
      await deleteMutation.mutateAsync(row.id);
      toast.success("Group lead deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete group lead");
    }
  };
  

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
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
            <div className="absolute right-0 top-0 flex flex-col gap-3">
              <GroupDashboardAlerts alerts={alerts} />
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <GroupDashboardKPICards metrics={kpiMetrics} />
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
                    {apiLeads.length === 0
                      ? "No group leads in database yet. Add a group lead to get started."
                      : activeTab === "calendar"
                        ? `${allMasterRows.length} follow-up entr${allMasterRows.length === 1 ? "y" : "ies"}`
                        : activeTab === "control-tower"
                          ? `${apiLeads.length} lead(s) in database`
                          : `${masterRows.length} lead(s) for ${activeTab}`}
                  </span>
                  <Link
                    href="/bookings/group/gb-form"
                    className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    + Add group lead
                  </Link>
                </div>
                {activeTab === "calendar" ? (
                  <GroupDashboardCalendarCards rows={allMasterRows} />
                ) : (
                  <MasterGroupBookingTable
                    rows={masterRows}
                    onEdit={handleEditLead}
                    onDelete={handleDeleteLead}
                  />
                )}
              </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start">
              <div className="min-w-0 flex-1 lg:min-w-0">
                <TodayFollowUpsTable rows={masterRows} />
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
