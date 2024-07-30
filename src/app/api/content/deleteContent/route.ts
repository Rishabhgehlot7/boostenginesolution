import dbConnect from "@/lib/dbConnect";
import Content from "@/models/Content";

export const DELETE = async (req: any, context: any) => {
  await dbConnect();
  const { params } = context;
  const id = params.id;
  console.log(id);
  try {
    const deletedContent = await Content.findByIdAndDelete(id);
    if (!deletedContent) {
      return Response.json({ message: "Content not found" });
    }
    return Response.json({ message: "Content deleted successfully" });
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
