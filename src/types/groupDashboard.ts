/**
 * Types for Group Booking Control Tower / Dashboard.
 * Used by dashboard form, API, and display components.
 */

export const GROUP_DASHBOARD_STATUS_OPTIONS = [
  "New Inquiry",
  "Follow-Up Pending",
  "Follow-Up Done",
  "Waiting for Customer",
  "Confirmed",
  "Cancelled",
  "No Reply",
  "Lost",
] as const;

export type GroupDashboardStatus =
  (typeof GROUP_DASHBOARD_STATUS_OPTIONS)[number];

export const GROUP_DASHBOARD_LOCATION_OPTIONS = [
  "Canal",
  "Marina",
  "Creek",
  "Yacht",
] as const;

export type GroupDashboardLocation =
  (typeof GROUP_DASHBOARD_LOCATION_OPTIONS)[number];

export const GROUP_DASHBOARD_VISIT_STATUS_OPTIONS = [
  "Visit Completed",
  "Customer Visit Scheduled",
  "Visit Today",
  "Visit Tomorrow",
  "On The Way",
  "No Visit",
] as const;

export type GroupDashboardVisitStatus =
  (typeof GROUP_DASHBOARD_VISIT_STATUS_OPTIONS)[number];

export const GROUP_DASHBOARD_REMINDER_OPTIONS = [
  "Done",
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

export type GroupDashboardReminderStatus =
  (typeof GROUP_DASHBOARD_REMINDER_OPTIONS)[number];

export const GROUP_DASHBOARD_WHATSAPP_OPTIONS = ["WA-1", "WA-2", "WA-3", "WA-4"] as const;

export type GroupDashboardWhatsApp = (typeof GROUP_DASHBOARD_WHATSAPP_OPTIONS)[number];

export const GROUP_DASHBOARD_FOLLOW_UP_PRIORITY_OPTIONS = [
  "High",
  "Medium",
  "Low",
] as const;

export type GroupDashboardFollowUpPriority =
  (typeof GROUP_DASHBOARD_FOLLOW_UP_PRIORITY_OPTIONS)[number];

export const GROUP_DASHBOARD_POPUP_ALERT_OPTIONS = ["Pending", "Done"] as const;

export type GroupDashboardPopupAlert =
  (typeof GROUP_DASHBOARD_POPUP_ALERT_OPTIONS)[number];

/** API/DB document shape (with _id and timestamps) */
export type GroupDashboardLead = {
  _id: string;
  dateAdded?: string;
  whatsapp: GroupDashboardWhatsApp;
  customerName: string;
  phone: string;
  groupSize: number;
  location: GroupDashboardLocation;
  travelDate: string;
  bookingStatus: GroupDashboardStatus;
  lastFollowUpDate?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  followUpPriority?: GroupDashboardFollowUpPriority;
  assignedAgent?: string;
  updatedByEmail?: string;
  updateTimestamp?: string;
  reminderDone?: boolean;
  reminderTriggered?: boolean;
  popupAlertStatus?: GroupDashboardPopupAlert;
  reminderVisitStatus?: GroupDashboardReminderStatus;
  visitStatus?: GroupDashboardVisitStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** Form values for create/edit */
export type GroupDashboardFormValues = {
  dateAdded: string;
  whatsapp: GroupDashboardWhatsApp;
  customerName: string;
  phone: string;
  groupSize: number;
  location: GroupDashboardLocation;
  travelDate: string;
  bookingStatus: GroupDashboardStatus;
  lastFollowUpDate: string;
  nextFollowUpDate: string;
  nextFollowUpTime: string;
  followUpPriority: GroupDashboardFollowUpPriority;
  assignedAgent: string;
  updatedByEmail: string;
  updateTimestamp: string;
  reminderDone: boolean;
  reminderTriggered: boolean;
  popupAlertStatus: GroupDashboardPopupAlert;
  reminderVisitStatus: GroupDashboardReminderStatus;
  visitStatus: GroupDashboardVisitStatus;
  notes: string;
};
