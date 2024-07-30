import mongoose, { Document, Schema } from "mongoose";

interface IAds {
  image: string;
  link: string;
}

export interface IMobileContent extends Document {
  images: IAds[];
  handing: string;
}

const IAdsSchema = new Schema<IAds>({
  image: { type: String, required: true },
  link: { type: String, required: true },
});

const MobileContentSchema = new Schema<IMobileContent>(
  {
    images: { type: [IAdsSchema], required: true },
    handing: { type: String, required: false },
  },
  { timestamps: true }
);

const MobileContent =
  (mongoose.models.MobileContent as mongoose.Model<IMobileContent>) ||
  mongoose.model<IMobileContent>("MobileContent", MobileContentSchema);

export default MobileContent;
