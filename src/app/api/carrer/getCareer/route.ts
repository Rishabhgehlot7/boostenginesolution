import dbConnect from "@/lib/dbConnect";
import Career from "@/models/Career";

export const GET = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const services = await Career.find();
    return Response.json(services);
} catch (error: any) {
    return Response.json({ message: error.message });
  }
};
