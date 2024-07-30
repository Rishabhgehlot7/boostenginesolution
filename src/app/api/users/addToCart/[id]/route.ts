import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import mongoose from "mongoose";
export interface ICartProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export async function POST(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  try {
    const { productId, quantity, size, color, price } = await req.json(); 
    const user = await User.findById(id);

    if (!user) {
      return Response.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }

    const cartProduct: any = {
      product: new mongoose.Types.ObjectId(productId),
      quantity,
      size,
      color,
      price,
    };

    user.cart.push(cartProduct);

    await user.save();
    console.log(user);
    
    return Response.json(user, {
      status: 201,
    });
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
}
