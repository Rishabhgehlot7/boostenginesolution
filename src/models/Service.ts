import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  price: number;
  duration: string; // e.g., "2 weeks", "1 month"
  features: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  duration: { type: String, required: true },
  features: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Service =
  (mongoose.models.Service as mongoose.Model<IService>) ||
  mongoose.model<IService>("Service", ServiceSchema);

export default Service;
