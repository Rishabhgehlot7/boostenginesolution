import mongoose, { Document, Schema } from "mongoose";

interface IAds {
  image: string;
  link: string;
}

export interface IStyleContent extends Document {
  images: IAds[];
  handing: string;
}

const IAdsSchema = new Schema<IAds>({
  image: { type: String, required: true },
  link: { type: String, required: true },
});

const StyleContentSchema = new Schema<IStyleContent>(
  {
    images: { type: [IAdsSchema], required: true },
    handing: { type: String, required: false },
  },
  { timestamps: true }
);

const StyleContent =
  (mongoose.models.StyleContent as mongoose.Model<IStyleContent>) ||
  mongoose.model<IStyleContent>("StyleContent", StyleContentSchema);

export default StyleContent;
