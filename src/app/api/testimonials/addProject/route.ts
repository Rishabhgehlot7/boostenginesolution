import dbConnect from "@/lib/dbConnect";
import Testimonial, { ITestimonial } from "@/models/Testimonial";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const { name, content, rating, date, avatarUrl } = await req.json();

    const newService: ITestimonial = new Testimonial({
      name,
      content,
      rating,
      avatarUrl,
    });

    await newService.save();
    return Response.json(newService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
