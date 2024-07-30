import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  try {
    const order = await Order.findById(id)
      .populate("user")
      .populate("products.product");
    if (!order) {
      return Response.json(
        { message: "Order not found" },
        {
          status: 404,
        }
      );
    }
    return Response.json(order, {
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
