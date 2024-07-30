import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  try {
    const updates = await req.json();
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
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
        status: 400,
      }
    );
  }
}
