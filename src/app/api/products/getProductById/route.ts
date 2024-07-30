import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";

export async function POST(req: Request, res: Response) {
  await dbConnect();
  try {
    const { productId } = await req.json();
    try {
      const product = await ProductModel.findById(productId).populate(
        "reviews"
      );
      if (product) {
        const reviews = product.reviews;
        if (reviews) {
          const averageRating = reviews.length
            ? reviews.reduce((acc, review: any) => acc + review.rating, 0) /
              reviews.length
            : 0;
          const productWithAverageRating = {
            ...product.toObject(),
            averageRating,
          };
          return Response.json(productWithAverageRating);
        }
      }
    } catch (error) {
      const product1 = await ProductModel.findById(productId);
      return Response.json(product1);
    }
  } catch (error) {
    return Response.json(
      { message: "Error fetching product", error },
      {
        status: 500,
      }
    );
  }
}
