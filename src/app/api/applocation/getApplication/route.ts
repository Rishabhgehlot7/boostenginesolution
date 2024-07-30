import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";

export const GET = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const services = await Application.find();
    return Response.json(services);
} catch (error: any) {
    return Response.json({ message: error.message });
  }
};
