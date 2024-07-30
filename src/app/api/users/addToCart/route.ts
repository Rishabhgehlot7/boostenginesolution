import dbConnect from "@/lib/dbConnect";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

import User, { IUser } from "@/models/User"; // Assuming User model is imported correctly
import mongoose from "mongoose";

export interface ICartProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export async function POST(req: any) {
  await dbConnect();

  const token = await getToken({ req, secret });

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = token._id;

  try {
    const { productId, quantity, size, color, price } = await req.json();

    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Check if the product already exists in the user's cart
    let productExists = false;
    user.cart.forEach((cartItem: any) => {
      if (
        cartItem.product.toString() === productId &&
        cartItem.size.toString() === size
      ) {
        // If the product ID matches, update the quantity
        cartItem.quantity += quantity;
        productExists = true;
      }
    });

    // If the product is not found in the cart, add it as a new entry
    if (!productExists) {
      const cartProduct: any = {
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        size,
        color,
        price,
      };
      user.cart.push(cartProduct);
    }

    await user.save();

    return new Response(JSON.stringify(user), {
      status: 201,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
