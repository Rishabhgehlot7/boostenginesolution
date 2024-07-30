import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function POST(req: Request, context: any) {
  await dbConnect();
  const { search } = await req.json();
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { category: { $regex: ".*" + search + ".*", $options: "i" } },
        { subcategory: { $regex: ".*" + search + ".*", $options: "i" } },
        { description: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });

    return new Response(JSON.stringify(products), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
