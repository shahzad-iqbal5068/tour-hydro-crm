import mongoose, { Schema, Model, Document } from "mongoose";

export interface IGroupBooking extends Document {
  groupBookingName: string;
  guestName: string;
  contactWhatsapp: string;
  groupsCount: number;
  cruiseName: string;
  numberOfPax: number;
  timeSlot: string;
  inquiryDate?: Date;
  confirmDate?: Date;
  bookingStatusRemarks?: string;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  callingDate?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupBookingSchema = new Schema<IGroupBooking>(
  {
    groupBookingName: { type: String, required: true },
    guestName: { type: String, required: true },
    contactWhatsapp: { type: String, required: true },
    groupsCount: { type: Number, required: true, default: 1 },
    cruiseName: { type: String, required: true },
    numberOfPax: { type: Number, required: true, default: 0 },
    timeSlot: { type: String, default: "" },
    inquiryDate: { type: Date },
    confirmDate: { type: Date },
    bookingStatusRemarks: { type: String },
    totalAmount: { type: Number, required: true, default: 0 },
    advancePaid: { type: Number, required: true, default: 0 },
    remainingAmount: { type: Number, required: true, default: 0 },
    callingDate: { type: Date },
    remarks: { type: String },
  },
  { timestamps: true }
);

if (mongoose.models.GroupBooking) {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete mongoose.models.GroupBooking;
}
export const GroupBooking: Model<IGroupBooking> =
  mongoose.model<IGroupBooking>("GroupBooking", GroupBookingSchema);
