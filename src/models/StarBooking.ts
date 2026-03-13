import mongoose, { Schema, Model, Document } from "mongoose";

export interface IStarBooking extends Document {
  category: "4-5" | "3";
  time: string;
  pax: number;
  guestName: string;
  phone: string;
  collectionAmount: number;
  paid: number;
  balance: number;
  deck?: string;
  remarks?: string;
  callingRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StarBookingSchema = new Schema<IStarBooking>(
  {
    category: {
      type: String,
      enum: ["4-5", "3"],
      required: true,
    },
    time: { type: String, required: true },
    pax: { type: Number, required: true },
    guestName: { type: String, required: true },
    phone: { type: String, required: true },
    collectionAmount: { type: Number, required: true },
    paid: { type: Number, required: true },
    balance: { type: Number, required: true },
    deck: { type: String },
    remarks: { type: String },
    callingRemarks: { type: String },
  },
  { timestamps: true }
);

export const StarBooking: Model<IStarBooking> =
  mongoose.models.StarBooking ||
  mongoose.model<IStarBooking>("StarBooking", StarBookingSchema);

