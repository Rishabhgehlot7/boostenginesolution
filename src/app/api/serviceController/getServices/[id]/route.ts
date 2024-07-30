import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";

export async function GET(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  try {
    const services = await Service.findById(id);
    console.log(services);

    return Response.json(services);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
