import { GROUP_DASHBOARD_WHATSAPP_OPTIONS } from "./groupDashboard";

export type KPIMetric = {
  label: string;
  value: number;
};

export type AlertItem = {
  id: string;
  type: "follow-up" | "reminder";
  title: string;
  message: string;
  time?: string;
  status?: string;
};

export type MasterGroupRow = {
  id: string;
  inquiryDate: string;
  whatsapp: (typeof GROUP_DASHBOARD_WHATSAPP_OPTIONS)[number];
  assignedPerson: string;
  confirmBookingDate: string;
  customerName: string;
  contact: string;
  numberOfPersons: number;
  cruiseName: string;
  slotTiming: string;
  location: string;
  groupNo: string;
  bookingStatus: string;
  lastFollowUpDate: string;
  remarks: string;
  callingDate: string;
  totalAmount: number | string;
  advancePaid: number | string;
  remainingAmount: number | string;
};

export type VisitLeadRow = {
  id: string;
  guest: string;
  contact: string;
  location: string;
  visitStatus: string;
  reminderStatus: string;
  agent: string;
  notes: string;
};

export type DueIn15Item = {
  id: string;
  guestName: string;
  locationAndPax: string;
  time: string;
  agent: string;
  popupStatus: string;
};

export type ActivityItem = {
  id: string;
  customerName: string;
  dateTime: string;
  action: string;
  agent?: string;
};

