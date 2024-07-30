import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";

export const GET = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const services = await Service.find();
    return Response.json(services);
} catch (error: any) {
    return Response.json({ message: error.message });
  }
};
