import dbConnect from "@/lib/dbConnect";
import Order, { IOrder } from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import mongoose from "mongoose";
interface ICreateOrderRequest {
  userId: string;
  products: {
    _id: any;
    product: mongoose.Types.ObjectId;
    quantity: number;
    size: string;
    color: string;
    price: string;
  }[];
  total: number;
  paymentMethod: "Online" | "COD"; // Add COD as a payment method option
}

interface ICreateOrderResponse {
  message?: string;
  order?: IOrder;
}
export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const { userId, products, total, paymentMethod } = await req.json();

    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: "User not found" });
    }
    // Create a new order
    const newOrder = new Order({
      user: userId,
      products: products.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      status: "pending",
      paymentMethod, // Add payment method to the order
      createdAt: new Date(),
    });

    const savedOrder: any = await newOrder.save();
    console.log(savedOrder);

    for (const item of products) {
      const product = await Product.findOne({ _id: item.product });

      if (product) {
        let stockUpdated = false;

        // Update the stock quantity
        product.stock = product.stock.map((stockItem) => {
          if (stockItem.color === item.color && stockItem.size === item.size) {
            stockItem.stock -= item.quantity;
            stockUpdated = true;
            // Check if stock is depleted
            if (stockItem.stock <= 0) {
              stockItem.stock = 0; // Ensure stock is not negative
            }
          }
          return stockItem;
        });

        // Check if all stock items are depleted
        const allStockDepleted = product.stock.every(
          (stockItem) => stockItem.stock === 0
        );

        // Update product status if all stock is depleted
        if (allStockDepleted) {
          product.status = "out of stock";
        }

        // Save the updated product
        if (stockUpdated) {
          await product.save();
        }
      } else {
        return Response.json({
          message: `Product not found for ID ${item.product}`,
        });
      }
    }

    // Clear user's cart
    user.cart = [];
    user.orders.push(savedOrder._id);
    await user.save();

    return Response.json(savedOrder, {
      status: 201,
    });
  } catch (error: any) {
    return Response.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
};
