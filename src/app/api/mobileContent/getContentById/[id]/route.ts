import dbConnect from "@/lib/dbConnect";
import MobileContent from "@/models/MobileContent";

// GET /api/content/[id]
export async function GET(req: any, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  console.log(id);
  try {
    const content = await MobileContent.findById(id);
    if (!content) {
      return Response.json({ message: "Content not found" });
    }
    return Response.json(content);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
}
