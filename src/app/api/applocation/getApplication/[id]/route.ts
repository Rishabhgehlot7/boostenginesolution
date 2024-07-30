import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";

export async function GET(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  try {
    const services = await Application.findById(id);
    console.log(services);

    return Response.json(services);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
