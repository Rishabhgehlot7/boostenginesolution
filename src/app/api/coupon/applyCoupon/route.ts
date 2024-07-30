import dbConnect from "@/lib/dbConnect";
import Coupon from "@/models/Coupon";

export async function POST(req: Request, context: any) {
  await dbConnect();

  try {
    const { code } = await req.json();
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return Response.json(
        { message: "Coupon not found" },
        {
          status: 404,
        }
      );
    }

    if (
      !coupon.isActive ||
      coupon.expirationDate < new Date() ||
      (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    ) {
      return Response.json(
        { message: "Coupon is not valid" },
        {
          status: 400,
        }
      );
    }

    // Optionally, you can increment the usedCount here if the coupon is successfully applied
    coupon.usedCount += 1;
    await coupon.save();

    return Response.json({
      message: "Coupon applied successfully",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minTotal: coupon.minTotal,
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
