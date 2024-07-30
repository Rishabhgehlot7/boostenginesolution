import mongoose, { Document, Schema } from "mongoose";

export interface ICartProduct {
  _id: any;
  product: mongoose.Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
  price: string;
}

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "customer" | "admin" | "employee";
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  cart: ICartProduct[];
  orders: mongoose.Types.ObjectId[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  createdAt: Date;
  resetPasswordCode: string;
  resetPasswordExpiry: Date;
}

const cartProductSchema: Schema<ICartProduct> = new Schema({
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
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
});

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  phone: {
    type: Number,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["customer", "admin", "employee"],
    default: "customer",
    required: true,
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  cart: [cartProductSchema],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordCode: {
    type: String,
  },
  resetPasswordExpiry: {
    type: Date,
  },
});

const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
