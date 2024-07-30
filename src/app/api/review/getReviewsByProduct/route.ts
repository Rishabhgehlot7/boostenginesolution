import Review from "@/models/Review";

// Get all reviews
export const POST = async (req: Request, res: Response) => {
  const { productId } = await req.json();
  try {
    const reviews = await Review.find({ product: productId })
      .populate("user")
      .populate("product");
    return Response.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return Response.json({ message: "Failed to fetch reviews." });
  }
};
