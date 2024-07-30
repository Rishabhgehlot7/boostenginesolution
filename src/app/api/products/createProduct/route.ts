import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
export async function POST(req: Request, res: Response) {
  await dbConnect();
  const item = await req.json();
  console.log(item);
  
  try {
    const product = new ProductModel(item);
    console.log(product);
    
    await product.save();
    return Response.json(
      { message: "Product created successfully", product },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      { message: "Error creating product", error },
      {
        status: 400,
      }
    );
  }
}
