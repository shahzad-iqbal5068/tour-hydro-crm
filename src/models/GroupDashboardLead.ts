import mongoose, { Schema, Model, Document } from "mongoose";
import type {
  GroupDashboardWhatsApp,
  GroupDashboardLocation,
  GroupDashboardStatus,
} from "@/types/groupDashboard";

export interface IGroupDashboardLead extends Document {
  inquiryDate?: Date;
  dateAdded?: Date;
  whatsapp: GroupDashboardWhatsApp;
  assignedAgent?: string;
  confirmBookingDate?: Date;
  customerName: string;
  phone: string;
  groupSize: number;
  location: GroupDashboardLocation;
  travelDate?: Date;
  bookingStatus: GroupDashboardStatus;
  lastFollowUpDate?: Date;
  cruiseName?: string;
  slotTiming?: string;
  groupNo?: string;
  remarks?: string;
  notes?: string;
  callingDate?: Date;
  totalAmount?: number;
  advancePaid?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GROUP_DASHBOARD_STATUS_ENUM = ["Done", "Not done", "Custom"];

const GROUP_DASHBOARD_LOCATION_ENUM = [
  "Canal",
  "Marina",
  "Creek",
  "Private yacht",
];

const GROUP_DASHBOARD_WHATSAPP_ENUM = [
  "Fun Factory",
  "Fun & Fun",
  "Dhow Cruise (Ocean Leopard)",
  "Dubai Cruise Deals Wanderlust Wanderlust Adventures",
  "Blue world",
  "Dhow cruise trip",
  "Dubai Deals",
];

const GroupDashboardLeadSchema = new Schema<IGroupDashboardLead>(
  {
    inquiryDate: { type: Date },
    dateAdded: { type: Date },
    whatsapp: {
      type: String,
      required: true,
      enum: GROUP_DASHBOARD_WHATSAPP_ENUM,
    },
    assignedAgent: { type: String },
    confirmBookingDate: { type: Date },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    groupSize: { type: Number, required: true, default: 0 },
    location: {
      type: String,
      required: true,
      enum: GROUP_DASHBOARD_LOCATION_ENUM,
    },
    travelDate: { type: Date },
    bookingStatus: {
      type: String,
      required: true,
      enum: GROUP_DASHBOARD_STATUS_ENUM,
    },
    lastFollowUpDate: { type: Date },
    cruiseName: { type: String },
    slotTiming: { type: String },
    groupNo: { type: String },
    remarks: { type: String },
    notes: { type: String },
    callingDate: { type: Date },
    totalAmount: { type: Number },
    advancePaid: { type: Number },
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
