import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/models/QuerySchema";
import { revalidateTag } from "next/cache";

// Get all reviews
export async function GET(req: Request, res: Response) {
  revalidateTag("reviews");
  await dbConnect();
  try {
    const queries = await QueryModel.find();
    return Response.json(queries);
  } catch (error) {
    console.error("Error fetching Queries:", error);
    return Response.json({ message: "Failed to fetch Queries." });
  }
}
