/**
 * Dummy data for Group Booking Control Tower / Dashboard.
 * Used by group booking dashboard page and its components.
 */

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
  dateAdded: string;
  whatsapp: string;
  customerName: string;
  phone: string;
  groupSize: number;
  location: string;
  travelDate: string;
  bookingStatus: string;
  visitReminderStatus?: string;
  lastFollowUpDate: string;
  nextFollowUpDate: string;
};

/** All status options for the Status dropdown */
export const STATUS_FILTER_OPTIONS = [
  "All Statuses",
  "New Inquiry",
  "Follow-Up Pending",
  "Follow-Up Done",
  "Waiting for Customer",
  "Confirmed",
  "Cancelled",
  "No Reply",
  "Lost",
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
    dateAdded: "15 Mar 2026",
    whatsapp: "WA-4",
    customerName: "Farhan Traders",
    phone: "+9715xxxx",
    groupSize: 22,
    location: "Canal",
    travelDate: "24 Mar 2026",
    bookingStatus: "Follow-Up Pending",
    visitReminderStatus: "Customer Coming",
    lastFollowUpDate: "15 Mar 2026",
    nextFollowUpDate: "15 Mar 2026",
  },
  {
    id: "2",
    dateAdded: "15 Mar 2026",
    whatsapp: "WA-2",
    customerName: "Naveed Events",
    phone: "+9715xxxx",
    groupSize: 40,
    location: "Yacht",
    travelDate: "29 Mar 2026",
    bookingStatus: "Follow-Up Pending",
    visitReminderStatus: "Visit Tomorrow",
    lastFollowUpDate: "15 Mar 2026",
    nextFollowUpDate: "16 Mar 2026",
  },
  {
    id: "3",
    dateAdded: "15 Mar 2026",
    whatsapp: "WA-3",
    customerName: "Bilal Group",
    phone: "+9715xxxx",
    groupSize: 18,
    location: "Marina",
    travelDate: "21 Mar 2026",
    bookingStatus: "Waiting for Customer",
    visitReminderStatus: "Visit Today",
    lastFollowUpDate: "15 Mar 2026",
    nextFollowUpDate: "15 Mar 2026",
  },
  {
    id: "4",
    dateAdded: "15 Mar 2026",
    whatsapp: "WA-1",
    customerName: "Rashid Khan",
    phone: "+9715xxxx",
    groupSize: 12,
    location: "Canal",
    travelDate: "19 Mar 2026",
    bookingStatus: "No Reply",
    visitReminderStatus: "No Visit",
    lastFollowUpDate: "15 Mar 2026",
    nextFollowUpDate: "16 Mar 2026",
  },
  {
    id: "5",
    dateAdded: "14 Mar 2026",
    whatsapp: "WA-4",
    customerName: "Sara Lee",
    phone: "+9715xxxx",
    groupSize: 35,
    location: "Yacht",
    travelDate: "30 Mar 2026",
    bookingStatus: "Confirmed",
    visitReminderStatus: "Today",
    lastFollowUpDate: "14 Mar 2026",
    nextFollowUpDate: "—",
  },
  {
    id: "6",
    dateAdded: "15 Mar 2026",
    whatsapp: "WA-2",
    customerName: "John Smith",
    phone: "+9715xxxx",
    groupSize: 15,
    location: "Canal",
    travelDate: "27 Mar 2026",
    bookingStatus: "New Inquiry",
    visitReminderStatus: "Due in 15 min",
    lastFollowUpDate: "—",
    nextFollowUpDate: "15 Mar 2026",
  },
  {
    id: "7",
    dateAdded: "15 Mar 2026",
    whatsapp: "WA-1",
    customerName: "Ali Khan",
    phone: "+9715xxxx",
    groupSize: 20,
    location: "Marina",
    travelDate: "25 Mar 2026",
    bookingStatus: "Follow-Up Pending",
    visitReminderStatus: "Today",
    lastFollowUpDate: "15 Mar 2026",
    nextFollowUpDate: "15 Mar 2026",
  },
  {
    id: "8",
    dateAdded: "14 Mar 2026",
    whatsapp: "WA-3",
    customerName: "Ahmed Raza",
    phone: "+9715xxxx",
    groupSize: 28,
    location: "Creek",
    travelDate: "22 Mar 2026",
    bookingStatus: "Waiting for Customer",
    visitReminderStatus: "Visit Scheduled",
    lastFollowUpDate: "13 Mar 2026",
    nextFollowUpDate: "16 Mar 2026",
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
    location: "Yacht",
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
    location: "Yacht",
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

export const dashboardTabs = [
  { id: "control-tower", label: "Control Tower" },
  { id: "wa-1", label: "WA-1 Groups" },
  { id: "wa-2", label: "WA-2 Groups" },
  { id: "wa-3", label: "WA-3 Groups" },
  { id: "wa-4", label: "WA-4 Groups" },
  { id: "calendar", label: "Calendar View" },
] as const;
