import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";

export async function GET(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  try {
    const services = await Project.findById(id);
    console.log(services);

    return Response.json(services);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
