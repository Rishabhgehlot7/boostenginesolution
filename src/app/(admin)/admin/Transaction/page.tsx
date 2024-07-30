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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cache, Suspense, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import useSWR from "swr";

interface Order {
  _id: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
  products: Array<{
    product: {
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
  }>;
  total: number;
  createdAt: string;
  paymentMethod: "Online" | "COD";
}

const fetcher = (url: string) =>
  fetch(url, {
    cache: "no-store",
    next: { revalidate: 10 },
  }).then((res) => res.json());

export default function Dashboard() {
  const router = useRouter();
  const {
    data: orders = [],
    error,
    mutate,
  } = useSWR("/api/order/orders", fetcher);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orders.length > 0) {
      setLoading(true);
    }
  }, [orders]);

  const handleDelete = cache(async (id: string) => {
    try {
      const response = await axios.post(`/api/order/deleteOrder/${id}`);
      console.log("Order is deleted:", response);
      mutate();
      // Update orders after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  });

  // Filter out canceled and returned orders
  const filteredOrders = orders.filter(
    (order: Order) => order.status !== "canceled" && order.status !== "returned"
  );

  const totalOrders = filteredOrders.length;
  const totalQuantity = filteredOrders.reduce(
    (acc: any, order: Order) =>
      acc + order.products.reduce((sum, item) => sum + item.quantity, 0),
    0
  );
  const totalPrice = filteredOrders.reduce(
    (acc: any, order: Order) => acc + order.total,
    0
  );

  if (!loading) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

  return (
    <Suspense>
      <TooltipProvider>
        <div className="flex min-h-screen w-full flex-col bg-gray-950 text-white">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 bg-gray-950">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <Card className="bg-black text-white">
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order: Order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            {order.user.name}
                            <p className="text-sm text-muted">
                              {order.user.email}
                            </p>
                          </TableCell>
                          <TableCell>Sale</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`bg-black ${
                                order.status === "pending"
                                  ? "text-yellow-500"
                                  : order.status === "shipped"
                                  ? " text-pink-500"
                                  : order.status === "delivered"
                                  ? " text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`bg-black ${
                                order.paymentMethod === "COD"
                                  ? "text-blue-500"
                                  : "text-green-500"
                              }`}
                            >
                              {order.paymentMethod}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>₹{order.total}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button variant="outline" className=" bg-black">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Link href={`/admin/orders/${order._id}`}>
                                    View Order
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(order._id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell>{totalOrders}</TableCell>
                        <TableCell>₹{totalPrice.toFixed(2)}</TableCell>
                        <TableCell>{totalQuantity} items</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </Suspense>
  );
}
