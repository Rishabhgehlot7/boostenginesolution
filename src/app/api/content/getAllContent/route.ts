import dbConnect from "@/lib/dbConnect";
import Content from "@/models/Content";
import { revalidateTag } from "next/cache";

export const GET = async (req: any, context: any) => {
  await dbConnect();
  revalidateTag('a');
  try {
    const content = await Content.find();
    return Response.json(content);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
