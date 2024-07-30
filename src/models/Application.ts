// models/Application.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ApplicationSchema extends Document {
  _id?: string;
  careerId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  coverLetter: string;
  resumeUrl: string;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
  appliedAt: Date;
}

const applicationSchema: Schema = new Schema(
  {
    careerId: { type: String, required: true },
    // careerId: { type: Schema.Types.ObjectId, ref: "Career", required: true },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String },
    coverLetter: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Application =
  (mongoose.models.Application as mongoose.Model<ApplicationSchema>) ||
  mongoose.model<ApplicationSchema>("Application", applicationSchema);
export default Application;
