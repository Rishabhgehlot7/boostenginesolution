import QueryModel from "@/models/QuerySchema";

export const POST = async (req: Request, res: Response) => {
  const { id } = await req.json();

  try {
    await QueryModel.findByIdAndDelete(id);
    return Response.json({ message: "Query deleted successfully" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal server error" });
  }
};
