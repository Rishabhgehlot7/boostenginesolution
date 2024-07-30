import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Testimonial document
export interface ITestimonial extends Document {
  _id?: string;
  name: string;
  content: string;
  rating: number;
  date: Date;
  avatarUrl?: string; // Optional field for the avatar image
}

// Define the Testimonial schema
const TestimonialSchema: Schema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
  avatarUrl: { type: String }, // Optional field for the avatar image
});

// Create the Testimonial model
const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
