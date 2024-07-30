import dbConnect from "@/lib/dbConnect";
import MobileContent from "@/models/MobileContent";

export async function POST(req: any, context: any) {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  console.log(id);
  const { images, handing } = await req.json();

  try {
    const updatedContent = await MobileContent.findByIdAndUpdate(
      id,
      { images, handing },
      { new: true }
    );
    if (!updatedContent) {
      return Response.json({ message: "Content not found" });
    }
    return Response.json(updatedContent);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
}
