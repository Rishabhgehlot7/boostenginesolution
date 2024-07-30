import dbConnect from "@/lib/dbConnect";
import FAQ from "@/models/FAQ";

export const GET = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const services = await FAQ.find();
    return Response.json(services);
} catch (error: any) {
    return Response.json({ message: error.message });
  }
};
