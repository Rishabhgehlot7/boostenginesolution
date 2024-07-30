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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cache, useEffect, useState } from "react";
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
  category: string; // Updated to include category
  subcategory?: string; // Optional subcategory
  isArchived: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = cache(async () => {
      try {
        const response = await fetch("/api/products", {
          next: {
            revalidate: 5,
            tags: ["a"],
          },
          cache: "no-store",
        });
        const data = await response.json();
        console.log("Product data:", data);
        setProducts(data || []);
        router.refresh();
        setLoading(true);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    });

    fetchData();
  }, []);

  const handleRefresh = () => {
    router.refresh();
  };

  const handleDelete = cache(async (id: string) => {
    try {
      const response = await axios.post("/api/products/deleteProduct", {
        productId: id,
        cache: "no-store",
      });
      console.log("Product is deleted:", response);
    } catch (error) {
      console.error("Error in product deleting:", error);
    }
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const response = await axios.get("/api/products");
        console.log("Product data:", response.data);
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  });

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  console.log("Render products:", filteredProducts);

  if (!loading) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }
  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-950">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950 text-white">
            <Tabs
              defaultValue="all"
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <div className="flex items-center">
                <TabsList className="bg-black text-white">
                  <TabsTrigger value="all" className="bg-black text-white">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="men" className="bg-black text-white">
                    Man
                  </TabsTrigger>
                  <TabsTrigger value="women" className="bg-black text-white">
                    Woman
                  </TabsTrigger>
                  <TabsTrigger value="kids" className="bg-black text-white">
                    Kids
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <Link href={"/admin/addProduct"}>
                    <Button size="sm" className="h-7 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                      </span>
                    </Button>
                  </Link>
                  <Button
                    onClick={handleRefresh}
                    size="sm"
                    className="h-7 gap-1"
                  >
                    Refresh Products
                  </Button>
                </div>
              </div>
              <TabsContent value="all" className="bg-black text-white">
                <ProductTable
                  products={filteredProducts}
                  handleDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="men" className="bg-black text-white">
                <ProductTable
                  products={filteredProducts}
                  handleDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="women" className="bg-black text-white">
                <ProductTable
                  products={filteredProducts}
                  handleDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="kids" className="bg-black text-white">
                <ProductTable
                  products={filteredProducts}
                  handleDelete={handleDelete}
                />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

function ProductTable({ products, handleDelete }: any) {
  return (
    <Card className="bg-black text-white">
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Manage your products</CardDescription>
      </CardHeader>
      <CardContent className="bg-black text-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-black hover:text-white">
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">
                Subcategory
              </TableHead>
              <TableHead className="hidden md:table-cell">Id</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.toReversed().map((product: any) => (
              <TableRow
                key={product._id}
                className="hover:bg-black hover:text-white"
              >
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.images[0]}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-black text-white">
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.subcategory}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product._id}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link
                        href={`/admin/products/updateProduct/${product._id}`}
                      >
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => handleDelete(product._id)}
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
          Showing <strong>1-{products.length}</strong> of{" "}
          <strong>{products.length}</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
