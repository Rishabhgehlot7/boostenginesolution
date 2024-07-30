import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";

export const GET = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const services = await Project.find();
    return Response.json(services);
} catch (error: any) {
    return Response.json({ message: error.message });
  }
};
