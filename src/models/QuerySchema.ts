import mongoose, { Document, Schema } from "mongoose";

// Define the interface extending mongoose Document
export interface IQuery extends Document {
  name: string;
  email: string;
  message: string;
}

// Define the schema
const QuerySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ }, // Basic email validation
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create the model
const QueryModel =
  (mongoose.models.Query as mongoose.Model<IQuery>) ||
  mongoose.model<IQuery>("Query", QuerySchema);

export default QueryModel;
