/**
 * Dummy data for Group Booking Control Tower / Dashboard.
 * Used by group booking dashboard page and its components.
 */

import { GROUP_DASHBOARD_WHATSAPP_OPTIONS } from "@/types/groupDashboard";

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
  whatsapp: string;
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

export type TodayFollowUpRow = {
  id: string;
  guest: string;
  contact: string;
  pax: number;
  location: string;
  followUpDate: string;
  time: string;
  agent: string;
  updatedByEmail: string;
  notes: string;
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

export const dashboardKPI: KPIMetric[] = [
  { label: "Total Active Group Leads", value: 8 },
  { label: "Follow Ups Today", value: 1 },
  { label: "Overdue Follow Ups", value: 1 },
  { label: "Due in 15 Minutes", value: 1 },
  { label: "Visit Leads Today", value: 2 },
  { label: "Confirmed Bookings", value: 1 },
  { label: "Cancelled / No Reply", value: 1 },
  { label: "High Priority Leads", value: 5 },
];

export const dashboardAlerts: AlertItem[] = [
  {
    id: "1",
    type: "follow-up",
    title: "Follow-Up",
    message: "Follow up with John Smith at 7:00 PM",
  },
  {
    id: "2",
    type: "reminder",
    title: "15 Minute Reminder",
    message: "Follow up with John Smith for Canal group at 7:00 PM. Popup status: Pending.",
  },
];

export const masterGroupRows: MasterGroupRow[] = [
  {
    id: "1",
    inquiryDate: "15 Mar 2026",
    whatsapp: "Fun Factory",
    assignedPerson: "Samia",
    confirmBookingDate: "24 Mar 2026",
    customerName: "Farhan Traders",
    contact: "+9715xxxx",
    numberOfPersons: 22,
    cruiseName: "Dhow cruise trip",
    slotTiming: "6:30 PM",
    location: "Canal",
    groupNo: "G001",
    bookingStatus: "Not done",
    lastFollowUpDate: "15 Mar 2026",
    remarks: "Customer Coming",
    callingDate: "16 Mar 2026",
    totalAmount: 4500,
    advancePaid: 1000,
    remainingAmount: 3500,
  },
  {
    id: "2",
    inquiryDate: "15 Mar 2026",
    whatsapp: "Blue world",
    assignedPerson: "Mariam",
    confirmBookingDate: "29 Mar 2026",
    customerName: "Naveed Events",
    contact: "+9715xxxx",
    numberOfPersons: 40,
    cruiseName: "Dubai Deals",
    slotTiming: "7:00 PM",
    location: "Private yacht",
    groupNo: "G002",
    bookingStatus: "Not done",
    lastFollowUpDate: "15 Mar 2026",
    remarks: "Visit Tomorrow",
    callingDate: "16 Mar 2026",
    totalAmount: 12000,
    advancePaid: 3000,
    remainingAmount: 9000,
  },
  {
    id: "3",
    inquiryDate: "15 Mar 2026",
    whatsapp: "Dhow Cruise (Ocean Leopard)",
    assignedPerson: "Hina",
    confirmBookingDate: "21 Mar 2026",
    customerName: "Bilal Group",
    contact: "+9715xxxx",
    numberOfPersons: 18,
    cruiseName: "Ocean Leopard",
    slotTiming: "6:00 PM",
    location: "Marina",
    groupNo: "G003",
    bookingStatus: "Not done",
    lastFollowUpDate: "15 Mar 2026",
    remarks: "Visit Today",
    callingDate: "15 Mar 2026",
    totalAmount: 2800,
    advancePaid: 500,
    remainingAmount: 2300,
  },
  {
    id: "4",
    inquiryDate: "15 Mar 2026",
    whatsapp: "Dubai Deals",
    assignedPerson: "Areeba",
    confirmBookingDate: "19 Mar 2026",
    customerName: "Rashid Khan",
    contact: "+9715xxxx",
    numberOfPersons: 12,
    cruiseName: "Dhow cruise trip",
    slotTiming: "8:00 PM",
    location: "Canal",
    groupNo: "G004",
    bookingStatus: "Custom",
    lastFollowUpDate: "15 Mar 2026",
    remarks: "No Visit",
    callingDate: "16 Mar 2026",
    totalAmount: 1800,
    advancePaid: 0,
    remainingAmount: 1800,
  },
  {
    id: "5",
    inquiryDate: "14 Mar 2026",
    whatsapp: "Fun & Fun",
    assignedPerson: "Mariam",
    confirmBookingDate: "30 Mar 2026",
    customerName: "Sara Lee",
    contact: "+9715xxxx",
    numberOfPersons: 35,
    cruiseName: "Blue world",
    slotTiming: "7:30 PM",
    location: "Private yacht",
    groupNo: "G005",
    bookingStatus: "Done",
    lastFollowUpDate: "14 Mar 2026",
    remarks: "Advance received",
    callingDate: "14 Mar 2026",
    totalAmount: 9500,
    advancePaid: 9500,
    remainingAmount: 0,
  },
  {
    id: "6",
    inquiryDate: "15 Mar 2026",
    whatsapp: "Dhow cruise trip",
    assignedPerson: "Mariam",
    confirmBookingDate: "27 Mar 2026",
    customerName: "John Smith",
    contact: "+9715xxxx",
    numberOfPersons: 15,
    cruiseName: "Dubai Cruise Deals Wanderlust Wanderlust Adventures",
    slotTiming: "7:00 PM",
    location: "Canal",
    groupNo: "G006",
    bookingStatus: "Not done",
    lastFollowUpDate: "—",
    remarks: "Due in 15 min",
    callingDate: "15 Mar 2026",
    totalAmount: 2200,
    advancePaid: 500,
    remainingAmount: 1700,
  },
  {
    id: "7",
    inquiryDate: "15 Mar 2026",
    whatsapp: "Fun Factory",
    assignedPerson: "Samia",
    confirmBookingDate: "25 Mar 2026",
    customerName: "Ali Khan",
    contact: "+9715xxxx",
    numberOfPersons: 20,
    cruiseName: "Dhow cruise trip",
    slotTiming: "6:30 PM",
    location: "Marina",
    groupNo: "G007",
    bookingStatus: "Not done",
    lastFollowUpDate: "15 Mar 2026",
    remarks: "Waiting final confirmation",
    callingDate: "15 Mar 2026",
    totalAmount: 3800,
    advancePaid: 800,
    remainingAmount: 3000,
  },
  {
    id: "8",
    inquiryDate: "14 Mar 2026",
    whatsapp: "Blue world",
    assignedPerson: "Hina",
    confirmBookingDate: "22 Mar 2026",
    customerName: "Ahmed Raza",
    contact: "+9715xxxx",
    numberOfPersons: 28,
    cruiseName: "Wanderlust Adventures",
    slotTiming: "7:00 PM",
    location: "Creek",
    groupNo: "G008",
    bookingStatus: "Not done",
    lastFollowUpDate: "13 Mar 2026",
    remarks: "Visit Scheduled",
    callingDate: "16 Mar 2026",
    totalAmount: 5600,
    advancePaid: 1500,
    remainingAmount: 4100,
  },
];

export const todayFollowUpRows: TodayFollowUpRow[] = [
  {
    id: "1",
    guest: "Ali Khan",
    contact: "+9715xxxx",
    pax: 20,
    location: "Marina",
    followUpDate: "15 Mar 2026",
    time: "6:30 PM",
    agent: "Samia",
    updatedByEmail: "samia@company.com",
    notes: "Waiting final confirmation for dinner buffet group",
  },
];

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
