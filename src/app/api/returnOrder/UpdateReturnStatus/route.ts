import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req: Request, context: any) {
  await dbConnect();
  try {
    const { returnStatus, id } = await req.json();
    const order = await Order.findByIdAndUpdate(
      id,
      { returnStatus },
      { new: true }
    );
    if (!order) {
      return Response.json({ message: "Order not found" });
    }
    return Response.json(order);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
}
