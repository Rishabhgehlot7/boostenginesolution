import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Review from "@/models/Review";
import User from "@/models/User";

export async function POST(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  console.log(id);

  try {
    // Delete the user
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        {
          status: 404,
        }
      );
    }

    // Delete associated orders
    await Order.deleteMany({ user: id });

    // Delete associated reviews
    await Review.deleteMany({ user: id });

    return new Response(
      JSON.stringify({ message: "User and associated data deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message }),
      {
        status: 500,
      }
    );
  }
}
