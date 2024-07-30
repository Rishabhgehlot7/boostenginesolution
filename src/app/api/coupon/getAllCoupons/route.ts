import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";
import { revalidateTag } from "next/cache";

export async function GET(req: Request, context: any) {
  revalidateTag('coupons');
  await dbConnect();
  try {
    const coupons = await Coupon.find();
    return Response.json(coupons, {
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
