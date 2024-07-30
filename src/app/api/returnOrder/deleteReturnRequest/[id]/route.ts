import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: any, context: any) {
  await dbConnect();

  const { id } = await req.json();

  try {
    const order = await Order.findById(id);
    if (!order) {
      return Response.json({ message: "Return request not found" });
    }

    order.returnStatus = null;
    order.returnReason = "";
    order.returnRequestedAt = new Date();
    await order.save();

    return Response.json({ message: "Return request deleted successfully" });
  } catch (error) {
    return Response.json({ message: "Error deleting return request", error });
  }
}
