import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";

export async function POST(req: Request, context: any) {
  await dbConnect();
  try {
    const {
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
      minTotal,
    } = await req.json();

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
      usedCount: 0,
      minTotal,
      isActive: true,
    });

    const savedCoupon = await newCoupon.save();
    return Response.json(savedCoupon, {
      status: 201,
    });
  } catch (error: any) {
    return Response.json(
      { message: error.message },
      {
        status: 400,
      }
    );
  }
}
