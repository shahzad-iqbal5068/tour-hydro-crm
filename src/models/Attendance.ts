import mongoose, { Schema, Model, Document, Types } from "mongoose";
import type { UserRole } from "./User";

export interface IAttendance extends Document {
  user: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  date: string; // yyyy-mm-dd (local date key)
  checkInAt?: Date;
  checkOutAt?: Date;
  location?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "MANAGER", "CEO", "SALES_EXEC", "CALL_PERSON"],
      required: true,
    },
    date: { type: String, required: true, index: true },
    checkInAt: { type: Date },
    checkOutAt: { type: Date },
    location: { type: String },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);

