import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";

export const GET = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const services = await Testimonial.find();
    return Response.json(services);
} catch (error: any) {
    return Response.json({ message: error.message });
  }
};
