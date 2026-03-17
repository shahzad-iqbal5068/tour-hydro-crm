import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAgentBooking extends Document {
  customerName: string;
  cruiseName?: string;
  pax: number;
  contact: string;
  date?: Date;
  time?: string;
  payment?: string;
  b2b?: string;
  htCommission?: string;
  agentCommission?: string;
  cameStatus: "came" | "not_came" | "custom";
  cameCustomText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentBookingSchema = new Schema<IAgentBooking>(
  {
    customerName: { type: String, required: true },
    cruiseName: { type: String },
    pax: { type: Number, required: true, default: 0 },
    contact: { type: String, required: true },
    date: { type: Date },
    time: { type: String },
    payment: { type: String },
    b2b: { type: String },
    htCommission: { type: String },
    agentCommission: { type: String },
    cameStatus: {
      type: String,
      enum: ["came", "not_came", "custom"],
      required: true,
      default: "came",
    },
    cameCustomText: { type: String },
  },
  { timestamps: true }
);

if (mongoose.models.AgentBooking) {
  delete mongoose.models.AgentBooking;
}

export const AgentBooking: Model<IAgentBooking> =
  mongoose.model<IAgentBooking>("AgentBooking", AgentBookingSchema);

