import dbConnect from "@/lib/dbConnect";
import BlogPost from "@/models/Blog";

export const GET = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const services = await BlogPost.find();
    return Response.json(services);
} catch (error: any) {
    return Response.json({ message: error.message });
  }
};
