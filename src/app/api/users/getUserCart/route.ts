import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import UserModel from "@/models/User";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: any) {
  await dbConnect();

  const token = await getToken({ req, secret });

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = token._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Extract product IDs from user's cart
    const productIds = user.cart.map((item) => item.product);

    // Fetch products from ProductModel using the product IDs
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Map user's cart items to include product details
    const cart = user.cart.map((item) => {
      const product = products.find((p: any) => p._id.equals(item.product));
      return {
        product: {
          _id: product?._id,
          name: product?.name,
          description: product?.description,
          stock:product?.stock,
          status: product?.status,
          images: product?.images,
          category: product?.category,
          subcategory: product?.subcategory,
          isArchived: product?.isArchived,
        },
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        _id: item._id,
        price: item.price,
      };
    });

    // Prepare the user object with the desired structure
    const userObject = {
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "",
      },
      _id: user._id,
      username: user.username,
      phone: user.phone || null,
      email: user.email,
      password: user.password,
      role: user.role,
      orders: user.orders,
      verifyCode: user.verifyCode,
      verifyCodeExpiry: user.verifyCodeExpiry,
      isVerified: user.isVerified,
      isAcceptingMessages: user.isAcceptingMessages,
      cart: cart,
      createdAt: user.createdAt,
      __v: user.__v,
    };

    return new Response(JSON.stringify(userObject), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
}
