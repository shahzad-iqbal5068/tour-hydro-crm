import mongoose, { Schema, Model, Document } from "mongoose";

export interface IBooking extends Document {
  date: Date;
  shift: string;
  name: string;
  email: string;
  whatsappPackage: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    date: { type: Date, required: true },
    shift: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsappPackage: { type: String, required: true },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

