import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";

export async function POST(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const serviceId = params.id;
  try {
    const service = await req.json();
    const updatedService = await Testimonial.findByIdAndUpdate(
      serviceId,
      service,
      {
        new: true,
      }
    );

    if (!updatedService) {
      return Response.json({ message: "Service not found" });
    }

    return Response.json(updatedService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
}
