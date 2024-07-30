"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import loaderImg from "@/public/loader/loading.gif";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

interface Order {
  _id: string;
  status: string;
  paymentMethod: string;
  user: {
    name: string;
    email: string;
    phone?: number;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
  products: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function OrderDetail() {
  const param = useParams();
  const orderId = param.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/order/getOrderById/${orderId}`);
      setOrder(response.data);
      setStatus(response.data.status);
      setLoading(true);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleStatusChange = async () => {
    if (!orderId) return;

    try {
      const response = await axios.post(
        `/api/order/updateOrderStatus/${orderId}`,
        {
          status,
        }
      );
      setOrder(response.data);
      fetchOrder();
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  if (!order) {
    return (
      <div className=" w-screen h-screen flex justify-center items-center py-10">
        <Image src={loaderImg} alt="" width={100} height={100} />
      </div>
    );
  }
  if (!loading) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <Image src={loaderImg} alt="" width={100} height={100} />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-950">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950 text-white">
            <Card className="bg-black text-white">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Order ID: {order._id}</CardDescription>
              </CardHeader>
              <CardContent className="bg-black text-white">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">User Information</h2>
                  <p>Name: {order?.user?.name || "N/A"}</p>
                  <p>Email: {order?.user?.email || "N/A"}</p>
                  <p>Phone: {order?.user?.phone || "N/A"}</p>
                  <p>
                    Address:{" "}
                    {order?.user?.address
                      ? `${order?.user?.address.street || "N/A"}, ${
                          order?.user?.address.city || "N/A"
                        }, ${order?.user?.address.state || "N/A"}, ${
                          order?.user?.address.zip || "N/A"
                        }, ${order?.user?.address.country || "N/A"}`
                      : "N/A"}
                  </p>
                </div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Order Status</h2>
                  <div className=" flex items-center gap-2 py-2">
                    <Badge variant="outline" className="bg-black text-white">
                      {order.status}
                    </Badge>
                    <Badge variant="outline" className="bg-black text-white">
                      {order.paymentMethod}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="bg-black text-white border border-gray-600 rounded p-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                    <Button
                      onClick={handleStatusChange}
                      className="ml-2 bg-white text-black"
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Products</h2>
                  {order.products.map((item, index) => (
                    <div key={index} className="flex space-x-4 mb-2">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={item.product?.images && item.product?.images[0]}
                        width="64"
                      />
                      <div>
                        <p>{item.product.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.product.stock && item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Order Date</h2>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-4">
                  <Link href="/admin/orders">
                    <Button className="bg-white text-black">
                      Back to Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
