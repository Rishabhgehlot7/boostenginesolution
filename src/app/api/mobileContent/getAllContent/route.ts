import dbConnect from "@/lib/dbConnect";
import MobileContent from "@/models/MobileContent";
import { revalidateTag } from "next/cache";

export const GET = async (req: any, context: any) => {
  revalidateTag('a');
  await dbConnect();
  try {
    const content = await MobileContent.find();
    return Response.json(content);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
