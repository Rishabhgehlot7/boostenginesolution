import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: any, context: any) {
  await dbConnect();
  const { params } = context;
  const orderId = params.request;
  const { returnReason } = await req.json();

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return Response.json({ message: "Order not found" });
    }

    if (order.status !== "delivered") {
      return Response.json({
        message: "Only delivered orders can be returned",
      });
    }

    order.status = "returned";
    order.returnStatus = "requested";
    order.returnReason = returnReason;
    order.returnRequestedAt = new Date();

    await order.save();

    return Response.json({
      message: "Return requested successfully",
      order,
    });
  } catch (error) {
    return Response.json({ message: "Internal server error", error });
  }
}
