import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { revalidateTag } from "next/cache";

export async function GET(req: any, context: any) {
  revalidateTag("returnRequests");
  await dbConnect();
  try {
    const returnRequests = await Order.find({ returnStatus: { $ne: null } })
      .populate("user", "name email")
      .select("orderId user returnReason returnStatus");
    console.log(returnRequests);

    return Response.json(returnRequests);
  } catch (error) {
    return Response.json({ message: "Error fetching return requests", error });
  }
}
