import mongoose, { Document, Schema } from "mongoose";

interface IStock {
  id: string;
  stock: number;
  color: string;
  price: number;
  size: string;
}

const stockSchema = new Schema<IStock>(
  {
    id: { type: String, required: true },
    stock: { type: Number, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
  },
  { _id: false }
);

export interface IProduct extends Document {
  name: string;
  description: string;
  status: string;
  images: string[];
  stock: IStock[];
  category: string;
  subcategory?: string;
  isArchived: boolean;
  discount: {
    discountType: "percentage" | "fixed";
    discountValue: number;
    isActive: boolean;
  };
  reviews: mongoose.Types.ObjectId[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    images: { type: [String], required: true },
    stock: [stockSchema],
    category: { type: String, required: true },
    subcategory: { type: String, required: false },
    isArchived: { type: Boolean, default: false },
    discount: {
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
      },
      discountValue: {
        type: Number,
        required: true,
      },
      isActive: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Product =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>("Product", productSchema);

export default Product;
