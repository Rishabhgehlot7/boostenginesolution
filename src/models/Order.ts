import mongoose, { Document, Schema } from "mongoose";

export interface IOrderProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  status: "pending" | "shipped" | "delivered" | "cancelled" | "returned";
  total: number;
  paymentMethod: "Online" | "COD"; // Add payment method to the order
  createdAt: Date;
  returnStatus: "requested" | "approved" | "rejected" | null;
  returnReason: string;
  returnRequestedAt: Date;
}

const orderProductSchema: Schema<IOrderProduct> = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema: Schema<IOrder> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [orderProductSchema],
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled", "returned"],
    default: "pending",
  },
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Online", "COD"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  returnStatus: {
    type: String,
    enum: ["requested", "approved", "rejected", null],
    default: "requested",
  },
  returnReason: {
    type: String,
  },
  returnRequestedAt: {
    type: Date,
  },
});
const Order =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", orderSchema);

export default Order;
