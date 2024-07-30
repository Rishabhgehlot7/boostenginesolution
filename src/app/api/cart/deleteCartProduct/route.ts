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
  const { productId, productSize } = await req.json();
  console.log(productId, productSize);

  try {
    // Find the user by userId
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Filter out the cart product with productId from user's cart
    user.cart = user.cart.filter(
      (item) =>
        item.product.toString() !== productId || item.size !== productSize
    );

    // Save the user object
    await user.save();

    // Return the updated user object in response
    return Response.json(user, {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
