// pages/api/verify-otp.ts
import User, { IUser } from "@/models/User";
import type { NextApiResponse } from "next";

// Controller function for OTP verification
export async function POST(req: any, res: NextApiResponse) {
  const { email, otp } = await req.json();

  try {
    // Find user by email
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }

    // Check if OTP matches and has not expired
    if (user.resetPasswordCode !== otp) {
      return Response.json(
        { message: "Invalid OTP" },
        {
          status: 400,
        }
      );
    }

    const now = new Date();
    if (now > user.resetPasswordExpiry) {
      return Response.json(
        { message: "OTP has expired" },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      { message: "OTP verified successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return Response.json(
      { message: "Server error" },
      {
        status: 500,
      }
    );
  }
}
