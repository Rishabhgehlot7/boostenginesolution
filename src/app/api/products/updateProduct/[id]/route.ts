import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";

export async function POST(req: Request, context: any) {
  await dbConnect();
  try {
    const { params } = context;
    const productId = params.id;

    const updateData = await req.json();

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );
    if (!product) {
      return Response.json({ message: "Product not found" });
    }
    return Response.json({ message: "Product updated successfully", product });
  } catch (error) {
    return Response.json({ message: "Error updating product", error });
  }
}
