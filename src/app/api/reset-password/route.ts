// pages/api/reset-password.ts

import User, { IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import type { NextApiResponse } from "next";

// Controller function for password reset
export async function POST(req: any, res: NextApiResponse) {
  const { email, password } = await req.json();

  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    return Response.json(
      { message: "Password reset successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return Response.json(
      { message: "Server error" },
      {
        status: 500,
      }
    );
  }
}
