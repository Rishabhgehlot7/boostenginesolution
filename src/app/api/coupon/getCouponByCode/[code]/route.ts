import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";

export async function POST(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const code = params.code;
  try {
    const coupon = await Coupon.findOne({ code: code });
    if (!coupon) {
      return Response.json({ message: "Coupon not found" });
    }
    return Response.json(coupon);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
}
