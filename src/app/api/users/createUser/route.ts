import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request, context: any) {
  await dbConnect();

  try {
    const {
      username,
      name,
      email,
      password,
      role,
      address,
      cart,
      orders,
      verifyCode,
      verifyCodeExpiry,
    } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      name,
      email,
      password: hashedPassword,
      role,
      address,
      cart,
      orders,
      verifyCode,
      verifyCodeExpiry,
      isVerified: false,
      isAcceptingMessages: true,
      createdAt: new Date(),
    });

    await user.save();
    return Response.json(user, {
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
