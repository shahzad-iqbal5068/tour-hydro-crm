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
    collectionAmount: { type: Number, required: true, default: 0 },
    paid: { type: Number, required: true },
    balance: { type: Number, required: true },
    deck: { type: String },
    remarks: { type: String },
    callingRemarks: { type: String },
  },
  { timestamps: true }
);

// Use current schema: clear cached model so old "collection" path is not required (e.g. after deploy or schema change)
if (mongoose.models.StarBooking) {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete mongoose.models.StarBooking;
}
export const StarBooking: Model<IStarBooking> =
  mongoose.model<IStarBooking>("StarBooking", StarBookingSchema);

