import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { revalidateTag } from "next/cache";
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: Request, res: Response) {
  revalidateTag('a');
  await dbConnect();
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "products.product",
        select: "name price images", // Ensure images are populated
      })
      .sort({ _id: -1 });
    return Response.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ message: "Server error. Unable to fetch orders." });
  }
}
