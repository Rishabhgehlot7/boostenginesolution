"use server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";

import { revalidateTag } from "next/cache";
// Get all products
export async function GET(req: Request, res: Response) {
  await dbConnect();
  revalidateTag("collection");
  try {
    try {
      const products = await ProductModel.find().populate("reviews");
      if (products) {
        const productsWithAverageRating = products.map((product) => {
          const reviews = product?.reviews;
          const averageRating = reviews?.length
            ? reviews.reduce((acc, review: any) => acc + review.rating, 0) /
              reviews.length
            : 0;
          return {
            ...product.toObject(),
            averageRating,
          };
        });
        if (products) {
          return Response.json(productsWithAverageRating);
        }
      }
    } catch (error) {
      const products1 = await ProductModel.find();

      return Response.json(products1);
    }
  } catch (error) {
    return Response.json(
      { message: "Error fetching products", error },
      {
        status: 400,
      }
    );
  }
}
