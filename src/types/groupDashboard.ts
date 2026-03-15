/**
 * Types for Group Booking Control Tower / Dashboard.
 * Used by dashboard form, API, and display components.
 */

export const GROUP_DASHBOARD_BOOKING_STATUS_OPTIONS = [
  "Done",
  "Not done",
  "Custom",
] as const;

export type GroupDashboardStatus =
  (typeof GROUP_DASHBOARD_BOOKING_STATUS_OPTIONS)[number];

export const GROUP_DASHBOARD_LOCATION_OPTIONS = [
  "Canal",
  "Marina",
  "Creek",
  "Private yacht",
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

export const GROUP_DASHBOARD_WHATSAPP_OPTIONS = [
  "Fun Factory",
  "Fun & Fun",
  "Dhow Cruise (Ocean Leopard)",
  "Dubai Cruise Deals Wanderlust Wanderlust Adventures",
  "Blue world",
  "Dhow cruise trip",
  "Dubai Deals",
] as const;

export type GroupDashboardWhatsApp =
  (typeof GROUP_DASHBOARD_WHATSAPP_OPTIONS)[number];

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

/** Row shape from GET /api/group-dashboard-leads (list item) */
export type GroupDashboardLeadRow = {
  _id: string;
  inquiryDate?: string;
  dateAdded?: string;
  whatsapp: string;
  assignedPerson?: string;
  assignedAgent?: string;
  confirmBookingDate?: string;
  customerName: string;
  phone: string;
  contact?: string;
  groupSize: number;
  numberOfPersons?: number;
  cruiseName?: string;
  slotTiming?: string;
  location: string;
  groupNo?: string;
  bookingStatus: string;
  lastFollowUpDate?: string;
  remarks?: string;
  notes?: string;
  callingDate?: string;
  totalAmount?: number;
  advancePaid?: number;
  remainingAmount?: number;
  visitReminderStatus?: string;
  reminderVisitStatus?: string;
  visitStatus?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  followUpPriority?: string;
  updatedByEmail?: string;
  updateTimestamp?: string;
  reminderDone?: boolean;
  reminderTriggered?: boolean;
  popupAlertStatus?: string;
};

/** API/DB document shape (with _id and timestamps) */
export type GroupDashboardLead = {
  _id: string;
  inquiryDate?: string;
  dateAdded?: string;
  whatsapp: GroupDashboardWhatsApp;
  assignedPerson?: string;
  assignedAgent?: string;
  confirmBookingDate?: string;
  customerName: string;
  phone: string;
  contact?: string;
  groupSize: number;
  numberOfPersons?: number;
  cruiseName?: string;
  slotTiming?: string;
  location: GroupDashboardLocation;
  groupNo?: string;
  bookingStatus: GroupDashboardStatus;
  lastFollowUpDate?: string;
  remarks?: string;
  notes?: string;
  callingDate?: string;
  totalAmount?: number;
  advancePaid?: number;
  remainingAmount?: number;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  followUpPriority?: GroupDashboardFollowUpPriority;
  updatedByEmail?: string;
  updateTimestamp?: string;
  reminderDone?: boolean;
  reminderTriggered?: boolean;
  popupAlertStatus?: GroupDashboardPopupAlert;
  reminderVisitStatus?: GroupDashboardReminderStatus;
  visitStatus?: GroupDashboardVisitStatus;
  createdAt?: string;
  updatedAt?: string;
};

/** Form values for create/edit */
export type GroupDashboardFormValues = {
  inquiryDate: string;
  whatsapp: GroupDashboardWhatsApp;
  assignedPerson: string;
  confirmBookingDate: string;
  customerName: string;
  contact: string;
  numberOfPersons: number;
  cruiseName: string;
  slotTiming: string;
  location: GroupDashboardLocation;
  groupNo: string;
  bookingStatus: GroupDashboardStatus;
  lastFollowUpDate: string;
  remarks: string;
  callingDate: string;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  updateTimestamp: string;
};
