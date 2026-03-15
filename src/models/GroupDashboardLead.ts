import mongoose, { Schema, Model, Document } from "mongoose";
import type {
  GroupDashboardWhatsApp,
  GroupDashboardLocation,
  GroupDashboardStatus,
  GroupDashboardVisitStatus,
  GroupDashboardReminderStatus,
  GroupDashboardFollowUpPriority,
  GroupDashboardPopupAlert,
} from "@/types/groupDashboard";

export interface IGroupDashboardLead extends Document {
  dateAdded?: Date;
  whatsapp: GroupDashboardWhatsApp;
  customerName: string;
  phone: string;
  groupSize: number;
  location: GroupDashboardLocation;
  travelDate: Date;
  bookingStatus: GroupDashboardStatus;
  lastFollowUpDate?: Date;
  nextFollowUpDate?: Date;
  nextFollowUpTime?: string;
  followUpPriority?: GroupDashboardFollowUpPriority;
  assignedAgent?: string;
  updatedByEmail?: string;
  reminderDone?: boolean;
  reminderTriggered?: boolean;
  popupAlertStatus?: GroupDashboardPopupAlert;
  reminderVisitStatus?: GroupDashboardReminderStatus;
  visitStatus?: GroupDashboardVisitStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GROUP_DASHBOARD_STATUS_ENUM = [
  "New Inquiry",
  "Follow-Up Pending",
  "Follow-Up Done",
  "Waiting for Customer",
  "Confirmed",
  "Cancelled",
  "No Reply",
  "Lost",
];

const GROUP_DASHBOARD_LOCATION_ENUM = ["Canal", "Marina", "Creek", "Yacht"];

const GROUP_DASHBOARD_VISIT_ENUM = [
  "Visit Completed",
  "Customer Visit Scheduled",
  "Visit Today",
  "Visit Tomorrow",
  "On The Way",
  "No Visit",
];

const GROUP_DASHBOARD_REMINDER_ENUM = [
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
];

const GroupDashboardLeadSchema = new Schema<IGroupDashboardLead>(
  {
    dateAdded: { type: Date },
    whatsapp: {
      type: String,
      required: true,
      enum: ["WA-1", "WA-2", "WA-3", "WA-4"],
    },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    groupSize: { type: Number, required: true, default: 0 },
    location: {
      type: String,
      required: true,
      enum: GROUP_DASHBOARD_LOCATION_ENUM,
    },
    travelDate: { type: Date, required: true },
    bookingStatus: {
      type: String,
      required: true,
      enum: GROUP_DASHBOARD_STATUS_ENUM,
    },
    lastFollowUpDate: { type: Date },
    nextFollowUpDate: { type: Date },
    nextFollowUpTime: { type: String },
    followUpPriority: { type: String, enum: ["High", "Medium", "Low"] },
    assignedAgent: { type: String },
    updatedByEmail: { type: String },
    reminderDone: { type: Boolean, default: false },
    reminderTriggered: { type: Boolean, default: false },
    popupAlertStatus: { type: String, enum: ["Pending", "Done"] },
    reminderVisitStatus: { type: String, enum: GROUP_DASHBOARD_REMINDER_ENUM },
    visitStatus: { type: String, enum: GROUP_DASHBOARD_VISIT_ENUM },
    notes: { type: String },
  },
  { timestamps: true }
);

if (mongoose.models.GroupDashboardLead) {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete mongoose.models.GroupDashboardLead;
}

export const GroupDashboardLead: Model<IGroupDashboardLead> =
  mongoose.model<IGroupDashboardLead>(
    "GroupDashboardLead",
    GroupDashboardLeadSchema
  );
