import mongoose, { Schema, Model, Document } from "mongoose";

export interface IInquiry extends Document {
  date: Date;
  shift: string;
  whatsappName: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    date: { type: Date, required: true },
    shift: { type: String, required: true },
    whatsappName: { type: String, required: true },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

