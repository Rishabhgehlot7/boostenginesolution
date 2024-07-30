import mongoose, { Document, Schema } from "mongoose";

interface IAds {
  image: string;
  link: string;
}

export interface IContent extends Document {
  images: IAds[];
  handing: string;
}

const IAdsSchema = new Schema<IAds>({
  image: { type: String, required: true },
  link: { type: String, required: true },
});

const ContentSchema = new Schema<IContent>(
  {
    images: { type: [IAdsSchema], required: true },
    handing: { type: String, required: false },
  },
  { timestamps: true }
);

const Content =
  (mongoose.models.Content as mongoose.Model<IContent>) ||
  mongoose.model<IContent>("Content", ContentSchema);

export default Content;
