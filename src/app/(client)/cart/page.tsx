"use client";
import OrderSummary from "@/components/custom/OrderSummary";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import axios from "axios";
import { Trash2 } from "lucide-react";
import mongoose from "mongoose";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

interface IStock {
  id: string;
  stock: number;
  color: string;
  price: number;
  size: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  status: string;
  images: string[];
  stock: IStock[];
  category: string;
  subcategory?: string;
  isArchived: boolean;
  discount: {
    discountType: "percentage" | "fixed";
    discountValue: number;
    isActive: boolean;
  };
}

export interface ICartProduct {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "customer" | "admin";
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  cart: ICartProduct[];
  orders: mongoose.Types.ObjectId[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  createdAt: Date;
}

const Page = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/users/getUserCart");
      setUser(response.data);
      setLoading(true);
    } catch (error) {
      // console.error("Error fetching user cart:", error);
    }
  };
  const deleteItem = async (productId: string, productSize: string) => {
    try {
      const response = await axios.post("/api/cart/deleteCartProduct", {
        productId: productId,
        productSize: productSize,
      });
      fetchData();
      // setUser(response.data); // Assuming response returns updated user data
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Error deleting item");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const calculateSubtotal = () => {
    return (
      user?.cart.reduce((total, item) => {
        const itemPrice = item.price;
        return total + (itemPrice || 0) * item.quantity;
      }, 0) || 0
    );
  };

  const applyCoupon = async () => {
    try {
      const response = await axios.post("/api/coupon/applyCoupon", {
        code: couponCode,
      });
      const { discountType, discountValue, minTotal } = response.data;
      // console.log(minTotal);

      if (total < minTotal) {
        setDiscount(0);
        setErrorMessage(
          `The coupon requires a minimum order total of ${minTotal} to be applied.`
        );
        return;
      }
      setDiscountType(discountType);
      setDiscount(discountValue);
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Error applying coupon");
    }
  };

  const calculateDiscount = (subtotal: number) => {
    if (discountType === "percentage") {
      return (subtotal * discount) / 100;
    } else if (discountType === "fixed") {
      return discount;
    }
    return 0;
  };

  if (!loading) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscount(subtotal);
  const deliveryFee = 0; // Flat delivery fee
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className="container">
      <hr />
      <Breadcrumb className="my-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-white hover:text-white">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/cart"
              className="text-white hover:text-white"
            >
              Cart
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="gold md:text-2xl font-bold uppercase">Your cart</h1>
      <main className="grid grid-cols-1 md:grid-cols-2 py-4 gap-3">
        <section className="border rounded-2xl flex flex-col text-white gap-3 p-4">
          {user?.cart.map((product, index) => (
            <CartItem
              key={index}
              name={product.product.name}
              quantity={product.quantity}
              imgURL={
                product.product.images && product.product.images.length > 0
                  ? product?.product?.images[0]
                  : ""
              }
              size={product.size}
              color={product.color}
              price={product.price}
              id={product.product._id}
              setUser={setUser}
              deleteItem={deleteItem}
              product={product}
            />
          ))}
        </section>
        <OrderSummary
          subtotal={subtotal}
          discountAmount={discountAmount}
          deliveryFee={deliveryFee}
          total={total}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          applyCoupon={applyCoupon}
          errorMessage={errorMessage}
          email={user?.email}
        />
      </main>
    </div>
  );
};

const CartItem = ({
  imgURL,
  name,
  size,
  color,
  price,
  quantity,
  id,
  setUser,
  deleteItem,
  product,
}: any) => {
  const [quentity, setQuentity] = useState(quantity);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateCount, setUpdateCount] = useState(0);

  const updatePrice = () => {
    const selectedStock = product.product?.stock?.find(
      (item: any) => item.size === (size ?? product.product?.stock[0]?.size)
    );
    if (selectedStock) {
      setUpdateCount(selectedStock.stock);
    }
  };
  useEffect(() => {
    updatePrice();
  }, []);

  useEffect(() => {
    if (quentity !== quantity) {
      changeQuentity(id, quentity);
    }
  }, [quentity]);

  const changeQuentity = async (productId: string, newQuantity: number) => {
    try {
      const response = await axios.post("/api/cart/changeCartProductQuantity", {
        productId,
        newQuantity,
      });
      setUser(response.data); // Assuming response returns updated user data
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Error updating quantity"
      );
    }
  };
  const calculateDiscountedPrice = (product: Product) => {
    const originalPrice = price;
    if (!product.discount?.isActive) {
      return originalPrice;
    }
    if (product.discount?.discountType === "percentage") {
      return (
        originalPrice - (originalPrice * product.discount?.discountValue) / 100
      );
    }
    if (product.discount.discountType === "fixed") {
      return originalPrice - product.discount?.discountValue;
    }
    return originalPrice;
  };

  return (
    <div>
      <div className="flex gap-3">
        <Image src={imgURL} alt={name} width={96} height={104} />
        <div className="w-full flex flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <h2 className=" text-sm md:text-xl">{name}</h2>
              <div className="text-xs">Size: {size}</div>
              <div className="text-xs">Color: {color}</div>
            </div>
            <Trash2
              color="#ff0000"
              onClick={() => deleteItem(id, size)}
              className="cursor-pointer"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 ">
              <p className="white text-sm md:text-xl md:py-2 py-1">
                ₹{calculateDiscountedPrice(product)}
              </p>
              {product.discount?.isActive && (
                <p className="text-[12px] md:text-xl text-gray-400 line-through">
                  ₹{product.stock[0]?.price}
                </p>
              )}
              {product.discount?.isActive && (
                <Badge
                  variant="destructive"
                  className=" text-[6px] px-[2px] py-[1px] md:text-xs md:px-2 md:py-1"
                >
                  {product.discount.discountType === "percentage"
                    ? `${product.discount.discountValue}% Off`
                    : `₹${product.discount.discountValue} Off`}
                </Badge>
              )}
            </div>
            <div className="flex">
              <button
                className="bg-gray-900 text-white py-1 px-3 md:px-5 rounded-tl-full rounded-bl-full border-none"
                onClick={() => {
                  console.log("-- wala outer loop");

                  setQuentity((q: number) => Math.max(q - 1, 1));
                }}
              >
                -
              </button>
              <input
                type="text"
                className="w-5 py-1 border-none text-center bg-gray-900 text-white outline-none"
                value={quentity}
                onChange={(e) => setQuentity(parseInt(e.target.value))}
              />
              <button
                className="bg-gray-900 text-white py-1 px-3 md:px-5 rounded-tr-full rounded-br-full border-none"
                onClick={() => {
                  console.log("++ wala outer loop");

                  if (updateCount > quentity) {
                    console.log("++ wala inner loop", updateCount);
                    setQuentity((q: number) => Math.max(q + 1, 1));
                  }
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default Page;

function setErrorMessage(arg0: any) {
  throw new Error("Function not implemented.");
}
