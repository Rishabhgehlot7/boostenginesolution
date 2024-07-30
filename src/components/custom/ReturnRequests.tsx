"use client";
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
import { TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { RingLoader } from "react-spinners";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, {
    cache: "no-store",
  }).then((res) => res.json());

interface ReturnRequest {
  _id: string;
  orderId: string;
  user: {
    name: string;
    email: string;
  };
  returnReason: string;
  returnStatus: string;
}

export default function ReturnRequests() {
  const {
    data: returnRequests,
    error,
    mutate,
  } = useSWR("/api/returnOrder/getAll", fetcher);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.post(
        `/api/returnOrder/deleteReturnRequest/`,
        {
          id,
        }
      );
      console.log("Return request is deleted:", response);
      // Update return requests after deletion
      mutate(); // Revalidate the data
    } catch (error) {
      console.error("Error deleting return request:", error);
    }
  };

  if (!returnRequests && !error) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading return requests</div>;
  }

  return (
    <TooltipProvider>
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle>Return Requests</CardTitle>
          <CardDescription>Manage return requests</CardDescription>
        </CardHeader>
        <CardContent className="bg-black text-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-black hover:text-white">
                <TableHead>Order ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Return Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returnRequests.map((request: ReturnRequest) => (
                <TableRow
                  key={request?._id}
                  className="hover:bg-black hover:text-white w-full"
                >
                  <TableCell className="font-medium">{request?._id}</TableCell>
                  <TableCell>
                    {request?.user?.name} ({request?.user?.email})
                  </TableCell>
                  <TableCell>{request?.returnReason}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`bg-black ${
                        request.returnStatus == "pending"
                          ? "text-yellow-500"
                          : request.returnStatus == "approved"
                          ? " text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {request?.returnStatus}
                    </Badge>
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
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/admin/orders/${request?._id}`}>
                          <DropdownMenuItem>Details</DropdownMenuItem>
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
            Showing <strong>1-{returnRequests.length}</strong> of{" "}
            <strong>{returnRequests.length}</strong> return requests
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
