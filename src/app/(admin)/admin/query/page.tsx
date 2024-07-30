"use client";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface Query {
    _id: string;
    name: string;
    email: string;
    orderNumber?: string;
    message: string;
    createdAt: string;
}

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url, {
    next: {
      revalidate: 5,
      tags: ["queries"],
    },
    cache: "no-store",
  }).then((res) => res.json());

export default function QueryDashboard() {
  const router = useRouter();

  // Use SWR to fetch query data
  const {
    data: queries,
    error,
    mutate,
  } = useSWR<Query[]>("/api/query/getAll", fetcher);

  // Loading state
  if (!queries && !error) {
    return (
      <div className="w-full h-full flex justify-center items-center py-10">
        <Image src={loadingImg} alt="Loading" width={100} height={100} />
      </div>
    );
  }

  // Error state
  if (error) {
    return <div>Error loading queries</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.post("/api/query/deleteQuery", { id });
      mutate(); // Revalidate data
    } catch (error) {
      console.error("Error deleting query:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-950 text-white">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 bg-gray-950">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card className="bg-black text-white">
              <CardHeader>
                <CardTitle>Queries</CardTitle>
                <CardDescription>
                  Recent queries from your customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queries!.toReversed().map((query) => (
                      <TableRow key={query._id}>
                        <TableCell>{query.name}</TableCell>
                        <TableCell>{query.email}</TableCell>
                        <TableCell>{query.message}</TableCell>
                        <TableCell>
                          {(new Date(query.createdAt).toLocaleDateString()).toString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="outline" className="bg-black">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleDelete(query._id)}
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
