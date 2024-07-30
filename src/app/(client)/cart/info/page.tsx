"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";
import mongoose from "mongoose";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
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
}

export interface ICartProduct {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface IUser extends Document {
  _id: string;
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
  const { toast } = useToast();
  const [user, setUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState<Partial<IUser>>({});
  const searchParams = useSearchParams();
  const discount = searchParams.get("discountAmount");
  useEffect(() => {
    // Fetch user data from your API
    axios
      .get(`/api/users/getUserById/`)
      .then((response) => {
        setUser(response.data);
        setFormData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        // console.error("Error fetching user data:", error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const router = useRouter();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const requiredFields: (keyof IUser)[] = [
      "name",
      "username",
      "phone",
      "email",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Please fill the ${field} field.`,
        });
        return;
      }
    }
    axios
      .put(`/api/users/updateUser/`, formData)
      .then((response) => {
        setUser(response.data);
        // console.log("Profile updated successfully");
        // console.log(response.data);
        toast({
          title: "Profile updated successfully",
        });
      })
      .catch((error) => {
        // console.error("Error updating user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error updating user data",
        });
      });
  };
  const total =
    user?.cart.reduce(
      (total: any, item) => total + item.price * item.quantity,
      0
    ) +
    0 -
    Number(discount);
  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      user?.address?.city == "" ||
      user?.address?.country == "" ||
      user?.address?.state == "" ||
      user?.address?.street == "" ||
      user?.address?.zip == ""
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all the address fields",
      });
      return;
    }
    try {
      const orderId: string = await createOrderId();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100), // converting to paisa
        currency: "INR",
        name: "Clothinix",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();

          if (res.isOk) {
            // Call API to create order and clear cart
            const orderResponse = await fetch("/api/order/createOrder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user?._id,
                products: user?.cart,
                total: total,
                paymentMethod: "Online",
              }),
            });

            const orderResult = await orderResponse.json();
            if (orderResponse.ok) {
              // Clear the local user state to reflect the empty cart
              const result = await fetch("/api/verify", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
              });
              const res = await result.json();
              axios
                .put(`/api/users/updateUser/`, {
                  ...user,
                  cart: [],
                })
                .then((response) => {
                  setUser(response.data);
                  // console.log("Ordered successfully");
                  // console.log(response.data);
                  toast({
                    title: "Payment and order processing succeeded",
                  });
                });

              router.push("/user");
            } else {
              // console.log(orderResult.message);
            }
          } else {
            // console.log(res.message);
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        // console.log(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      // console.error("Payment processing failed", error);
    }
  };

  const createOrderId = async (): Promise<string> => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      // console.error("Order creation failed", error);
      throw error;
    }
  };
  const handleCODPayment = async () => {
    if (
      user?.address?.city == "" ||
      user?.address?.country == "" ||
      user?.address?.state == "" ||
      user?.address?.street == "" ||
      user?.address?.zip == ""
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all the address fields",
      });
      return;
    }
    try {
      const orderId = await createOrderId();
      const orderResponse = await fetch("/api/order/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?._id,
          products: user?.cart,
          total: total + 40,
          paymentMethod: "COD",
        }),
      });

      const orderResult = await orderResponse.json();
      if (orderResponse.ok) {
        // Clear the local user state to reflect the empty cart
        setUser((prev: any) => ({ ...prev, cart: [] }));
        // console.log("Ordered successfully");
        // console.log(orderResult);
        toast({
          title: "Order placed successfully",
        });
        router.push("/user");
      } else {
        // console.log(orderResult.message);
      }
    } catch (error) {
      // console.error("Error placing order", error);
    }
  };
  return (
    <Suspense>
      <div className="container text-white">
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/cart/info"
                className="text-white hover:text-white"
              >
                Info
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="gold text-2xl font-bold uppercase">Information</h1>
        <div className="flex gap-10 flex-col lg:flex-row py-4">
          <div className="border flex-1 p-4 rounded-2xl">
            <h2 className="gold text-xl font-semibold uppercase mb-3">
              Shipping address
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    defaultValue={user?.name}
                    onChange={handleInputChange}
                    className="bg-black text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username || ""}
                    defaultValue={user?.username}
                    onChange={handleInputChange}
                    className="bg-black text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Address</Label>
                <Input
                  id="street"
                  placeholder="Street"
                  defaultValue={formData.address?.street}
                  onChange={handleInputChange}
                  className="bg-black text-white"
                />
                <Input
                  id="city"
                  placeholder="City"
                  defaultValue={formData.address?.city}
                  onChange={handleInputChange}
                  className="bg-black text-white"
                />
                <Input
                  id="state"
                  placeholder="State"
                  defaultValue={formData.address?.state}
                  onChange={handleInputChange}
                  className="bg-black text-white"
                />
                <Input
                  id="zip"
                  placeholder="ZIP"
                  defaultValue={formData.address?.zip}
                  onChange={handleInputChange}
                  className="bg-black text-white"
                />
                <Input
                  id="country"
                  placeholder="Country"
                  defaultValue={formData.address?.country}
                  onChange={handleInputChange}
                  className="bg-black text-white"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    className=" bg-black text-white"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    className=" bg-black text-white"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <Button type="submit">Save changes</Button>
            </form>
          </div>
          <section className="flex-1">
            <div className="space-y-4 border p-4 rounded-2xl">
              <h2 className="gold text-xl font-semibold uppercase mb-3">
                Order Summary
              </h2>
              {user?.cart.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <h3>{item.product.name}</h3>
                    <p>Size: {item.size}</p>
                    <p>Color: {item.color}</p>
                  </div>
                  <div>
                    <p>₹{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>
                  ₹
                  {user?.cart.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Discount</p>
                <p>₹{discount}</p>
              </div>
              <div className="flex justify-between">
                <p>Delivery Fee for Online Payment</p>
                <p className=" text-green-500">Free</p>
              </div>
              <div className="flex justify-between">
                <p>Delivery Fee for COD</p>
                <p>₹40</p>
              </div>
              <div className="flex justify-between">
                <p>Total</p>
                <p>
                  ₹
                  {user?.cart.reduce(
                    (total: any, item) => total + item.price * item.quantity,
                    0
                  ) +
                    0 -
                    Number(discount)}
                </p>
              </div>
              <form onSubmit={processPayment} className=" flex flex-wrap gap-2">
                <Button type="submit">Continue to Payment</Button>
                <Button type="button" onClick={() => handleCODPayment()}>
                  Pay with Cash on Delivery
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
