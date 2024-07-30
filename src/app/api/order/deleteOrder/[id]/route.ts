import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  console.log(id);
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      Response.json(
        { message: "Order not found" },
        {
          status: 404,
        }
      );
      return;
    }

    // Remove order from user's orders
    const user: any = await User.findById(order.user);
    if (user) {
      user.orders = user.orders.filter(
        (orderId: any) => !orderId.equals(order._id)
      );
      await user.save();
    }
    console.log(user);

    return Response.json(
      { message: "Order deleted successfully" },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
