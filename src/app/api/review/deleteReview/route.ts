import Product from "@/models/Product";
import Review from "@/models/Review";

// Delete a review
export const POST = async (req: Request, res: Response) => {
  try {
    const { id } = await req.json();
    const reviewToDelete = await Review.findById(id);
    
    await Product.findByIdAndUpdate(reviewToDelete?.product, {
      $pull: { reviews: id },
    });

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return Response.json({ message: "Review not found." });
    }

    return Response.json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    return Response.json({ message: "Failed to delete review." });
  }
};
