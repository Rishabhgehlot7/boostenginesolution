import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { revalidateTag } from "next/cache";

// Get all reviews
export async function GET(req: Request, res: Response) {
  revalidateTag("reviews");
  await dbConnect();
  try {
    const reviews = await Review.find()
      .populate("user")
      .populate("product")
      .sort({ _id: -1 });
    return Response.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return Response.json({ message: "Failed to fetch reviews." });
  }
}
