// models/FAQ.ts
import mongoose, { Document, Schema } from "mongoose";

export interface FAQDocument extends Document {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const FAQSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const FAQ =
  (mongoose.models.FAQ as mongoose.Model<FAQDocument>) ||
  mongoose.model<FAQDocument>("FAQ", FAQSchema);

export default FAQ;
