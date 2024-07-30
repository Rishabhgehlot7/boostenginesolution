import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const { productId } = await req.json();

    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) {
      return Response.json({ message: "Product not found" });
    }
    return Response.json({ message: "Product archived successfully", product });
  } catch (error) {
    return Response.json({ message: "Error archiving product", error });
  }
};
