import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { revalidateTag } from "next/cache";

export async function GET(req: Request, context: any) {
  revalidateTag('a');
  await dbConnect();
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    return Response.json(orders, {
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
