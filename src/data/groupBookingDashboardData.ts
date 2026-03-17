/**
 * Dummy data for Group Booking Control Tower / Dashboard.
 * Used by group booking dashboard page and its components.
 * 
 * Types for this data live in `@/types/groupBookingDashboardData`.
 */
 
import { GROUP_DASHBOARD_WHATSAPP_OPTIONS } from "@/types/groupDashboard";
import type { VisitLeadRow, DueIn15Item, ActivityItem } from "@/types/groupBookingDashboardData";

/** All status options for the Status dropdown */
export const STATUS_FILTER_OPTIONS = [
  "All Statuses",
  "Done",
  "Not done",
  "Custom",
] as const;

/** All visit/reminder options for the Visit / Reminder dropdown */
export const VISIT_REMINDER_OPTIONS = [
  "All Visit / Reminder",
  "Today",
  "Overdue",
  "Due in 15 min",
  "Upcoming",
  "Visit Today",
  "Visit Tomorrow",
  "Visit Scheduled",
  "Customer Coming",
  "No Visit",
  "On The Way",
] as const;



export const visitLeadRows: VisitLeadRow[] = [
  {
    id: "1",
    guest: "Sara Lee",
    contact: "+9715xxxx",
    location: "Private yacht",
    visitStatus: "Visit Completed",
    reminderStatus: "Done",
    agent: "Mariam",
    notes: "Advance payment received",
  },
  {
    id: "2",
    guest: "Bilal Group",
    contact: "+9715xxxx",
    location: "Marina",
    visitStatus: "Customer Visit Scheduled",
    reminderStatus: "Visit Today",
    agent: "Hina",
    notes: "Customer said aaj visit ke aayega",
  },
  {
    id: "3",
    guest: "Naveed Events",
    contact: "+9715xxxx",
    location: "Private yacht",
    visitStatus: "Visit Tomorrow",
    reminderStatus: "Visit Tomorrow",
    agent: "Mariam",
    notes: "Kal exact time par yacht dekhne ayenge",
  },
  {
    id: "4",
    guest: "Farhan Traders",
    contact: "+9715xxxx",
    location: "Canal",
    visitStatus: "On The Way",
    reminderStatus: "Customer Coming",
    agent: "Areeba",
    notes: "Customer bola abhi a raha hoon",
  },
];

export const dueIn15Item: DueIn15Item = {
  id: "1",
  guestName: "John Smith",
  locationAndPax: "Canal - 15 pax",
  time: "7:00 PM",
  agent: "Mariam",
  popupStatus: "Pending",
};

export const liveActivities: ActivityItem[] = [
  { id: "1", customerName: "Farhan Traders", dateTime: "15 Mar 2026, 3:20 PM", action: "Marked customer coming" },
  { id: "2", customerName: "John Smith", dateTime: "15 Mar 2026, 2:10 PM", action: "Marked due in 15 min", agent: "Mariam" },
  { id: "3", customerName: "Ali Khan", dateTime: "15 Mar 2026, 2:05 PM", action: "Updated follow up", agent: "Samia" },
  { id: "4", customerName: "Sara Lee", dateTime: "14 Mar 2026, 8:15 PM", action: "Confirmed booking", agent: "Mariam" },
];

/** Tabs: Control Tower, each WhatsApp from the form list, then Calendar View. */
export const dashboardTabs: readonly { id: string; label: string }[] = [
  { id: "control-tower", label: "Control Tower" },
  ...GROUP_DASHBOARD_WHATSAPP_OPTIONS.map((wa) => ({ id: wa, label: wa })),
  { id: "calendar", label: "Calendar View" },
];
