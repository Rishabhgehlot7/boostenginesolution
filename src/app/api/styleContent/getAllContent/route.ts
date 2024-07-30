import dbConnect from "@/lib/dbConnect";
import Content from "@/models/StyleContent";

export const GET = async (req: any, context: any) => {
  await dbConnect();
  try {
    const content = await Content.find();
    return Response.json(content);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
