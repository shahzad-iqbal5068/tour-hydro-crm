import mongoose, { Schema, Model, Document } from "mongoose";

/** Category: star tier (Canal) or cruise/location variant (Marina, Creek) */
export interface IStarBooking extends Document {
  category: string;
  date?: Date;
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
  followUpDate?: Date;
  followUpSent: boolean;
  followUpNote?: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StarBookingSchema = new Schema<IStarBooking>(
  {
    category: { type: String, required: true },
    date: { type: Date },
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
    followUpDate: { type: Date },
    followUpSent: { type: Boolean, default: false },
    followUpNote: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
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

