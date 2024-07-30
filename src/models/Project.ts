import mongoose, { Document, Schema, model } from "mongoose";

// Define the TypeScript interface for the project
export interface IProject extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: "ongoing" | "completed" | "planned";
  technologies: string[];
  members: {
    name: string;
    role: string;
  }[];
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema for the project
const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: { type: [String], required: true },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "planned"],
      default: "planned",
    },
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    members: [
      {
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Project =
  (mongoose.models.Project as mongoose.Model<IProject>) ||
  model<IProject>("Project", ProjectSchema);

export default Project;
