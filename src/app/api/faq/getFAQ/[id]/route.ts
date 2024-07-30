import dbConnect from "@/lib/dbConnect";
import FAQ from "@/models/FAQ";

export async function GET(req: Request, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  try {
    const services = await FAQ.findById(id);
    console.log(services);

    return Response.json(services);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
