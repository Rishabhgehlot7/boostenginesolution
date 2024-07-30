import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { revalidateTag } from "next/cache";

export async function GET(req: Request, res: Response) {
  revalidateTag("users");
  await dbConnect();
  try {
    const users = await User.find().sort({ _id: -1 });
    return Response.json(users, {
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
