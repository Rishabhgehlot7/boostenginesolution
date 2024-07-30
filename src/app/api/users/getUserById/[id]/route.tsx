import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
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
