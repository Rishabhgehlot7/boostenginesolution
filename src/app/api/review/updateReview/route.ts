import Review from "@/models/Review";
// Update a review
export const POST = async (req: Request, res: Response) => {
  try {
    const { id, user, username, product, rating, comment } = await req.json();

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { user, product, rating, comment, username },
      { new: true }
    );

    if (!updatedReview) {
      return Response.json({ message: "Review not found." });
    }

    return Response.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return Response.json({ message: "Failed to update review." });
  }
};
