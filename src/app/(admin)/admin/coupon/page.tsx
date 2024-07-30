"use client";
import { MoreHorizontal, PlusCircle } from "lucide-react";

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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useState } from "react";
import { RingLoader } from "react-spinners";
import useSWR from "swr";
export interface ICoupon extends Document {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expirationDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}
const fetcher = (url: string) =>
  fetch(url, {
    next: {
      revalidate: 5,
      tags: ["a"],
    },
    cache: "no-store",
  }).then((res) => res.json());

function App() {
  const {
    data: coupons,
    error,
    mutate,
  } = useSWR("/api/coupon/getAllCoupons/", fetcher);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [minTotal, setMinTotal] = useState(0);
  const [expirationDate, setExpirationDate] = useState("");
  const [usageLimit, setUsageLimit] = useState<number | null>(null);
  const [applyCode, setApplyCode] = useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  if (error) return <div>Error loading coupons...</div>;
  if (!coupons)
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );

  const createCoupon = async () => {
    try {
      const newCoupon = {
        code,
        discountType,
        discountValue,
        expirationDate,
        minTotal,
        usageLimit: usageLimit || null,
      };
      await axios.post("/api/coupon/createCoupon/", newCoupon);
      mutate(); // Revalidate the coupons data
      setCode("");
      setDiscountType("percentage");
      setDiscountValue(0);
      setMinTotal(0);
      setExpirationDate("");
      setUsageLimit(null);
    } catch (error) {
      console.error("Error creating coupon", error);
    }
  };

  const applyCoupon = async () => {
    try {
      const response = await axios.post("/api/coupon/applyCoupon", {
        code: applyCode,
      });
      setApplyMessage(response.data.message);
      setApplyCode("");
    } catch (error) {
      setApplyMessage("Error applying coupon");
      console.error("Error applying coupon", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.post(`/api/coupon/deleteCoupon/${id}`, { cache: "no-store" });
      mutate(); // Revalidate the coupons data
    } catch (error) {
      console.error("Error deleting coupon", error);
    }
  };
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
                  <Dialog>
                    <DialogTrigger>
                      <Button size="sm" className="h-7 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add Coupon
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className=" bg-black text-white">
                      <div className=" w-full mx-auto p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                          Create Coupon
                        </h2>
                        <div className="mb-4">
                          <Label className="block text-sm font-medium ">
                            Code
                          </Label>
                          <Input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="mt-1 block w-full p-2 rounded-md bg-black text-white"
                          />
                        </div>
                        <div className="mb-4">
                          <Label className="block text-sm font-medium ">
                            Discount Type
                          </Label>
                          <Select>
                            <SelectTrigger
                              className="bg-black text-white"
                              value={discountType}
                              onChange={(e: any) =>
                                setDiscountType(e.target.value)
                              }
                            >
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-black text-white">
                              <SelectItem value="light" defaultChecked>
                                Percentage
                              </SelectItem>
                              <SelectItem value="dark">Fixed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium ">
                            Discount Value
                          </label>
                          <Input
                            type="number"
                            value={discountValue}
                            onChange={(e) =>
                              setDiscountValue(parseFloat(e.target.value))
                            }
                            className="mt-1 block w-full p-2 border bg-black text-white rounded-md"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium ">
                            Minimum Total Value
                          </label>
                          <Input
                            type="number"
                            value={minTotal}
                            onChange={(e) =>
                              setMinTotal(parseFloat(e.target.value))
                            }
                            className="mt-1 block w-full p-2 border bg-black text-white rounded-md"
                          />
                        </div>
                        <div className="mb-4">
                          <Label className="block text-sm font-medium ">
                            Expiration Date
                          </Label>
                          <Input
                            type="date"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            className="mt-1 block w-full p-2 rounded-md invert text-yellow-400 border"
                          />
                        </div>
                        <div className="mb-4">
                          <Label className="block text-sm font-medium ">
                            Usage Limit (optional)
                          </Label>
                          <Input
                            type="number"
                            value={usageLimit ?? ""} // Display empty string if null
                            onChange={(e) =>
                              setUsageLimit(
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            className="mt-1 block w-full p-2 border bg-black text-white rounded-md"
                          />
                        </div>
                        <Button
                          onClick={createCoupon}
                          className="w-full p-2 rounded-md text-white"
                        >
                          Create Coupon
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger>
                      <Button size="sm" className="h-7 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Apply Coupon
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className=" bg-black text-white">
                      <h2 className="text-xl font-semibold mb-4">
                        Apply Coupon
                      </h2>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Code
                        </label>
                        <Input
                          type="text"
                          value={applyCode}
                          onChange={(e) => setApplyCode(e.target.value)}
                          className="mt-1 block w-full p-2 border bg-black text-white rounded-md"
                        />
                      </div>
                      <Button
                        onClick={applyCoupon}
                        className="w-full text-white p-2 rounded-md"
                      >
                        Apply Coupon
                      </Button>
                      {applyMessage && (
                        <p className="mt-4 text-center text-red-500">
                          {applyMessage}
                        </p>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <TabsContent value="all" className="bg-black text-white">
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle>Coupon</CardTitle>
                    <CardDescription>Manage your Coupon</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-black text-white">
                    <Table>
                      <TableHeader>
                        <TableRow className=" hover:bg-black hover:text-white">
                          <TableHead>Code</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead> Status</TableHead>
                          <TableHead>Expires on</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Used
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Value
                          </TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coupons.toReversed().map((coupon: any) => (
                          <TableRow
                            key={coupon.code}
                            className=" hover:bg-black hover:text-white"
                          >
                            <TableCell className="hidden sm:table-cell">
                              {coupon.code}
                            </TableCell>
                            <TableCell className="font-medium">
                              {coupon.discountType}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-black text-white"
                              >
                                {coupon.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(
                                coupon.expirationDate
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {coupon.usedCount} /{" "}
                              {coupon.usageLimit ?? "Unlimited"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {coupon.discountType == "percentage"
                                ? coupon.discountValue + "%"
                                : "₹" + coupon.discountValue}
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

                                  <DropdownMenuItem
                                    onClick={() => handleDelete(coupon._id)}
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
                      Showing <strong>1-{coupons.length}</strong> of{" "}
                      <strong>{coupons.length}</strong> Coupon
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

export default App;
