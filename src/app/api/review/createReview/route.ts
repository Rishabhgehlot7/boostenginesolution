import Product from "@/models/Product";
import Review, { IReview } from "@/models/Review";

// Create a new review
export const POST = async (req: Request, res: Response) => {
  const { user, username, product, rating, comment } = await req.json();
  console.log({ username, user, product, rating, comment });

  try {
    // Validate inputs (you may want to do additional validation)
    if (!user || !username || !product || !rating || !comment) {
      return Response.json(
        { message: "All fields are required." },
        {
          status: 400,
        }
      );
    }

    const newReview: IReview = new Review({
      user,
      username,
      product,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    await Product.findByIdAndUpdate(product, {
      $push: { reviews: newReview._id },
    });

    return Response.json(savedReview, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return Response.json(
      { message: "Failed to create review." },
      {
        status: 500,
      }
    );
  }
};
