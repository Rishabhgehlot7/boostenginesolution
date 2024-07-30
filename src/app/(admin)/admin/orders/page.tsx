"use client";
import ReturnRequests from "@/components/custom/ReturnRequests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { RingLoader } from "react-spinners";
import useSWR from "swr";

interface Istock {
  price: number;
  color: number;
  size: string;
}

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
      stock: Istock[];
    };
    quantity: number;
    price: number;
  }>;
  paymentMethod: "Online" | "COD";
}
const fetcher = (url: string) =>
  fetch(url, {
    cache: "no-store",
  }).then((res) => res.json());
export default function Dashboard() {
  const router = useRouter();
  const { data: orders, error, mutate } = useSWR("/api/order/orders", fetcher);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.post(`/api/order/deleteOrder/${id}`);
      console.log("Order is deleted:", response);
      // Update orders after deletion
      mutate(); // Revalidate the data
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  if (!orders && !error) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading orders</div>;
  }
  return (
    <TooltipProvider>
      <Suspense>
        <div className="flex min-h-screen w-full flex-col bg-gray-950">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950 text-white">
              <Tabs defaultValue="all">
                <div className="flex items-center">
                  <TabsList className="bg-black text-white">
                    <TabsTrigger value="all" className="bg-black text-white">
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="returns"
                      className="bg-black text-white"
                    >
                      Return Requests
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="all" className="bg-gray-950 text-white">
                  <Card className="bg-black text-white">
                    <CardHeader>
                      <CardTitle>Orders</CardTitle>
                      <CardDescription>Manage your orders</CardDescription>
                    </CardHeader>
                    <CardContent className="bg-black text-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-black hover:text-white">
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.isArray(orders) &&
                            orders.map((order: any) => (
                              <TableRow
                                key={order?._id}
                                className="hover:bg-black hover:text-white w-full"
                              >
                                <TableCell className="font-medium">
                                  {order?._id}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={`bg-black ${
                                      order.status == "pending"
                                        ? "text-yellow-500"
                                        : order.status == "shipped"
                                        ? " text-pink-500"
                                        : order.status == "delivered"
                                        ? " text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {order?.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={`bg-black ${
                                      order.paymentMethod == "COD"
                                        ? "text-blue-500"
                                        : "text-green-500"
                                    }`}
                                  >
                                    {order?.paymentMethod}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {order?.user?.name} ({order?.user?.email})
                                </TableCell>
                                <TableCell>
                                  {order?.products.map(
                                    (item: any, index: any) => (
                                      <div
                                        key={index}
                                        className="flex space-x-4"
                                      >
                                        <Image
                                          alt="Product image"
                                          className="aspect-square rounded-md object-cover"
                                          height="64"
                                          src={item.product?.images[0]}
                                          width="64"
                                        />
                                        <div>
                                          <p>{item.product?.name}</p>
                                          <p>Quantity: {item.quantity}</p>
                                          <p>Price: ₹{item.price}</p>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Toggle menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <Link
                                        href={`/admin/orders/${order?._id}`}
                                      >
                                        <DropdownMenuItem>
                                          Details
                                        </DropdownMenuItem>
                                      </Link>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <div className="text-xs text-muted-foreground">
                        Showing <strong>1-{orders.length}</strong> of{" "}
                        <strong>{orders.length}</strong> orders
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="returns" className="bg-gray-950 text-white">
                  <ReturnRequests />
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </Suspense>
    </TooltipProvider>
  );
}
