import dbConnect from "@/lib/dbConnect";
import FAQ from "@/models/FAQ";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const { id } = await req.json();
    const deletedService = await FAQ.findByIdAndDelete(id);

    if (!deletedService) {
      return Response.json({ message: "Service not found" });
    }

    return Response.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
