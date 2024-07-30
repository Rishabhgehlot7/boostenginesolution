import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getToken } from "next-auth/jwt";
import { revalidateTag } from "next/cache";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: any, context: any) {
  await dbConnect();
  revalidateTag('a');
  const token = await getToken({ req, secret });
  const userId = token?._id;

  try {
    const orders = await Order.find({ user: userId })
      .populate("user", "name email")
      .populate({
        path: "products.product",
        select: "name price images", // Ensure images are populated
      });

    return Response.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ message: "Server error. Unable to fetch orders." });
  }
}
