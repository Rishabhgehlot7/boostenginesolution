import dbConnect from "@/lib/dbConnect";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

import Product from "@/models/Product";
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
  const { productId, newQuantity } = await req.json();

  try {
    // Find the user by userId
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Find the cart product by productId
    const cartProduct: any = user.cart.find(
      (item) => item.product.toString() === productId
    );
    console.log(cartProduct);

    if (!cartProduct) {
      return Response.json(
        { message: "Cart product not found" },
        {
          status: 404,
        }
      );
    }

    // Update the quantity of the cart product
    cartProduct.quantity = newQuantity;

    // Save the user object
    await user.save();

    // Extract product IDs from user's cart
    const productIds = user.cart.map((item) => item.product);

    // Fetch products from ProductModel using the product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Map user's cart items to include product details
    const cart = user.cart.map((item) => {
      const product = products.find((p: any) => p._id.equals(item.product));
      return {
        product: {
          _id: product?._id,
          name: product?.name,
          description: product?.description,
          stock: product?.stock,
          status: product?.status,
          images: product?.images,
          category: product?.category,
          subcategory: product?.subcategory,
          isArchived: product?.isArchived,
        },
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        _id: item._id,
        price: item.price,
      };
    });

    // Prepare the user object with the desired structure
    const userObject = {
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "",
      },
      _id: user._id,
      username: user.username,
      phone: user.phone || null,
      email: user.email,
      password: user.password,
      role: user.role,
      orders: user.orders,
      verifyCode: user.verifyCode,
      verifyCodeExpiry: user.verifyCodeExpiry,
      isVerified: user.isVerified,
      isAcceptingMessages: user.isAcceptingMessages,
      cart: cart,
      createdAt: user.createdAt,
      __v: user.__v,
    };

    return new Response(JSON.stringify(userObject), {
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
