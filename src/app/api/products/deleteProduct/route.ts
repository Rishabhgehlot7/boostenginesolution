import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import ProductModel from "@/models/Product";
import Review from "@/models/Review";
import User from "@/models/User";

// Delete a product by ID
export async function POST(req: Request, res: Response) {
  await dbConnect();

  try {
    const { productId } = await req.json();

    const product = await ProductModel.findByIdAndDelete(productId);
    // Delete associated reviews
    await Review.deleteMany({ product: productId });
    // Remove product from all orders
    await Order.updateMany({}, { $pull: { products: { product: productId } } });

    // Remove product from all user carts
    await User.updateMany({}, { $pull: { cart: { product: productId } } });

    if (!product) {
      return Response.json({ message: "Product not found" });
    }
    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    return Response.json(
      { message: "Error deleting product", error },
      {
        status: 400,
      }
    );
  }
}
