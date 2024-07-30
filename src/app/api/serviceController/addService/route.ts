import dbConnect from "@/lib/dbConnect";
import Service, { IService } from "@/models/Service";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const { title, description, price, duration, features } = await req.json();

    const newService: IService = new Service({
      title,
      description,
      price,
      duration,
      features,
    });

    await newService.save();
    return Response.json(newService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
