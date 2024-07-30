"use client";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
import { useRouter } from "next/navigation";
import { RingLoader } from "react-spinners";
import useSWR from "swr";

interface IService {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: "ongoing" | "completed" | "planned";
  technologies: string[];
  members: {
    name: string;
    role: string;
  }[];
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Dashboard() {
  const router = useRouter();
  const {
    data: services,
    error,
    isLoading,
    mutate,
  } = useSWR<IService[]>("/api/project/getProject", fetcher);

  const handleRefresh = () => {
    mutate(); // Invalidate cache and refetch data
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.post("/api/services/[id]", {
        productId: id,
        cache: "no-store",
      });
      console.log("Service is deleted:", response);
      mutate(); // Refresh data after deletion
    } catch (error) {
      console.error("Error in service deleting:", error);
      // Handle error states or show a message to the user
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading services</div>;
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-950">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950 text-white">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <TabsList className="bg-black text-white">
                  <TabsTrigger value="all" className="bg-black text-white">
                    All
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <Link href={"/admin/addServices"}>
                    <Button size="sm" className="h-7 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Service
                      </span>
                    </Button>
                  </Link>
                  <Button
                    onClick={handleRefresh}
                    size="sm"
                    className="h-7 gap-1"
                  >
                    Refresh Projects
                  </Button>
                </div>
              </div>
              <TabsContent value="all" className="bg-gray-950 text-white">
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Manage your Projects</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-black text-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-black hover:text-white">
                          <TableHead className="hidden w-[100px] sm:table-cell">
                            <span className="sr-only">Image</span>
                          </TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Id
                          </TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(services) &&
                          services?.map((service) => (
                            <TableRow
                              key={service._id}
                              className="hover:bg-black hover:text-white"
                            >
                              <TableCell className="hidden sm:table-cell">
                                <Image
                                  alt="Service image"
                                  className="aspect-square rounded-md object-cover"
                                  height="64"
                                  src={service.images[0]}
                                  width="64"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {service.name}
                              </TableCell>
                              <TableCell>{service.status}</TableCell>
                              <TableCell>{service._id}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {service._id}
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
                                      href={`/admin/projects/updateService/${service._id}`}
                                    >
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(service._id)}
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
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Showing <strong>1-{services?.length}</strong> of{" "}
                      <strong>{services?.length}</strong> services
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
