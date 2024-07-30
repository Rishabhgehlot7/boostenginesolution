// pages/api/forgot-password.ts

import User, { IUser } from "@/models/User";
import crypto from "crypto";
import type { NextApiResponse } from "next";
import nodemailer from "nodemailer";

// Function to generate a random verification code
const generateVerificationCode = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// Function to send verification code via email
const sendVerificationCode = async (
  email: string,
  code: string
): Promise<void> => {
  // Replace with your email sending logic (using nodemailer or any other service)
  const transporter = nodemailer.createTransport({
    // Your email sending configuration
    service: "gmail",
    auth: {
      user: 'rishabh3x@gmail.com',
      pass: 'lpfegilnuslelmot',
    },
  });

  const mailOptions = {
    from: 'rishabh3x@gmail.com',
    to: email,
    subject: "Password Reset Verification Code",
    text: `Your verification code for password reset is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

// Controller function for initiating password reset
export async function POST(req: any, res: NextApiResponse) {
  const { email } = await req.json();

  try {
    // Find user by email
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return Response.json({ message: "User not found" });
    }

    // Generate a verification code and set expiry time
    const verificationCode = generateVerificationCode();
    const now = new Date();
    const codeExpiry = new Date(now.getTime() + 15 * 60000); // Expiry in 15 minutes

    // Update user with verification code and expiry
    user.resetPasswordCode = verificationCode;
    user.resetPasswordExpiry = codeExpiry;
    await user.save();

    // Send verification code via email
    await sendVerificationCode(email, verificationCode);

    return Response.json(
      { message: "Verification code sent successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return Response.json(
      { message: "Server error" },
      {
        status: 500,
      }
    );
  }
}
