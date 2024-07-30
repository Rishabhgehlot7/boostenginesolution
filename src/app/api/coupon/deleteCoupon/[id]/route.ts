import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";

export async function POST(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const _id = params.code;

  try {
    const coupon = await Coupon.findOneAndDelete(_id);
    console.log(coupon);
    
    if (!coupon) {
      return Response.json({ message: "Coupon not found" });
    }
    return Response.json({
      message: "Coupon deleted successfully",
    });
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
}
