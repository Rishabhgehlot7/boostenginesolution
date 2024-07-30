import User from "@/models/User";
import { NextApiResponse } from "next";
// Import the User model

export const POST = async (req: any, res: NextApiResponse) => {
  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" });
    }

    user.role = "admin";
    await user.save();

    return Response.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" });
  }
};
