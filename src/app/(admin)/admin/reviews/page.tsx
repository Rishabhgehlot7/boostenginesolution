"use client";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import StarRate from "@/components/custom/StarRateForProduct";
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
import loadingImg from "@/public/loader/loading.gif";
import Image from "next/image";
import useSWR from "swr";

interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    phone: number;
    email: string;
    role: string;
    name: string;
    // other user properties
  };
  username: string;
  product: {
    _id: string;
    name: string;
    description: string;
    status: string;
    // other product properties
  };
  rating: number;
  comment: string;
  createdAt: string;
}
// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url, {
    next: {
      revalidate: 5,
      tags: ["a"],
    },
    cache: "no-store",
  }).then((res) => res.json());

export default function Dashboard() {
  const router = useRouter();

  // Use SWR to fetch review data
  const {
    data: reviews,
    error,
    mutate,
  } = useSWR<Review[]>("/api/review/getReviews", fetcher);

  // Loading state
  if (!reviews && !error) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <Image src={loadingImg} alt="Loading" width={100} height={100} />
      </div>
    );
  }

  // Error state
  if (error) {
    return <div>Error loading reviews</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.post("/api/review/deleteReview", { id });
      mutate(); // Revalidate data
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-950 text-white">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 bg-gray-950">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card className="bg-black text-white">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  Recent reviews from your customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews!.toReversed().map((review) => (
                      <TableRow key={review._id}>
                        <TableCell>{review.user.username}</TableCell>
                        <TableCell>{review.product.name}</TableCell>
                        <TableCell>
                          <StarRate
                            rating={review.rating}
                            onChange={() => {}}
                          />
                        </TableCell>
                        <TableCell>{review.comment}</TableCell>
                        <TableCell>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="outline" className=" bg-black">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleDelete(review._id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
