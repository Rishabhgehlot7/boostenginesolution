import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: any, context: any) {
  const token = await getToken({ req, secret });
  await dbConnect();
  const id = token?._id;
  try {
    const user = await User.findById(id);
    if (!user)
      return Response.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );

    return Response.json(user, {
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
