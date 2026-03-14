import mongoose, { Schema, Model, Document } from "mongoose";

export interface IInquiry extends Document {
  date: Date;
  shift: string;
  whatsappName: string;
  remarks?: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    date: { type: Date, required: true },
    shift: { type: String, required: true },
    whatsappName: { type: String, required: true },
    remarks: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Ensure current schema is used (e.g. after adding userId); avoids "Cannot populate path userId" from cached model
if (mongoose.models.Inquiry) {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete mongoose.models.Inquiry;
}
export const Inquiry: Model<IInquiry> =
  mongoose.model<IInquiry>("Inquiry", InquirySchema);

