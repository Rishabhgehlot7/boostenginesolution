import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

interface IUser {
  country: string | undefined;
  zip: string | undefined;
  state: string | undefined;
  city: string | undefined;
  street: string | undefined;
  username: string;
  name: number;
  email: string;
  password?: string;
  phone: number;
  role?: "customer" | "admin" | "employee";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  cart?: [];
  orders?: [];
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified?: boolean;
  isAcceptingMessages?: boolean;
  createdAt?: Date;
}

export async function PUT(req: any, context: any) {
  await dbConnect();
  const token = await getToken({ req, secret });
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const id = token._id;

  try {
    const updates = await req.json();
    console.log(updates);

    if (updates.password && updates.password !== "") {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    if (
      updates.street &&
      updates.city &&
      updates.state &&
      updates.zip &&
      updates.country
    ) {
      updates.address = {
        street: updates.street,
        city: updates.city,
        state: updates.state,
        zip: updates.zip,
        country: updates.country,
      };
    }
    console.log("updates details ", updates);

    updates.phone = Number(updates.phone);

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    // console.log("updates details ", user);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
}
