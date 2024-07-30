import mongoose, { Document, Schema } from "mongoose";

interface SalaryRange {
  min?: number;
  max?: number;
}

export interface CareerDocument extends Document {
  _id?: string;
  position: string;
  department: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange?: SalaryRange;
  isActive: boolean;
}

const SalaryRangeSchema = new Schema<SalaryRange>({
  min: { type: Number },
  max: { type: Number },
});

const CareerSchema: Schema<CareerDocument> = new Schema({
  position: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  responsibilities: { type: [String], required: true },
  salaryRange: { type: SalaryRangeSchema },
  isActive: { type: Boolean, default: true },
});

const Career =
  mongoose.models.Career ||
  mongoose.model<CareerDocument>("Career", CareerSchema);

export default Career;
