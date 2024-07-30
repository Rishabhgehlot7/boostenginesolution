"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cache, ChangeEvent, FormEvent, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";

interface Variant {
  id: number;
  stock: string;
  color: string;
  price: string;
  size: string;
}
export default function Dashboard() {
  const instance = Axios.create();
  const axios = setupCache(instance);
  const router = useRouter();
  const { toast } = useToast();
  const [variants, setVariants] = useState<Variant[]>([
    { id: 1, stock: "", color: "", price: "", size: "s" },
  ]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[] | null>(null);
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [discountType, setDiscountType] = useState<string>("percentage");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [Name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const addVariantRow = () => {
    setVariants([
      ...variants,
      { id: variants.length + 1, stock: "", color: "", price: "", size: "s" },
    ]);
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string
  ) => {
    const newVariants: any = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const categories: any = {
    men: [
      "Collared tshirt",
      "Polo tshirt",
      "round neck",
      "polo tshirt",
      "oversized tshirt",
      "shirt",
      "sweat shirts",
      "jeans",
      "jackets",
      "joggers/cargo",
    ],
    women: [
      "crop tops",
      "Collared tshirt",
      "Polo tshirt",
      "round neck",
      "polo tshirt",
      "oversized tshirt",
      "sweat shirts",
      "jeans",
      "jackets",
    ],
    kids: [
      "Collared tshirt",
      "Polo tshirt",
      "tshirt",
      "shirts",
      "sweat shirts",
      "jeans",
      "lowers/joggers/cargo",
    ],
  };

  const subcategories = category ? categories[category] : [];

  const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  useEffect(() => {
    setCategory("");
    setSubcategory("");
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setFiles(filesArray);

    const uploadedUrls: string[] = [];

    const promises = filesArray.map((file) => {
      const ext = file.name.split(".").at(-1);
      const uid = uuidv4().replace(/-/g, "");
      const fileName = `${uid}${ext ? "." + ext : ""}`;

      const uploadToS3 = new PutObjectCommand({
        Bucket,
        Key: fileName,
        Body: file,
        ACL: "public-read",
      });

      return s3.send(uploadToS3).then((response) => {
        if (response.$metadata.httpStatusCode === 200) {
          const url = `https://${Bucket}.s3.ap-south-1.amazonaws.com/${fileName}`;
          uploadedUrls.push(url);
          setImageUrls((prev) => [...prev, url]); // Add each image URL to state as it uploads
        }
      });
    });

    try {
      await Promise.all(promises);
      console.log("All files uploaded successfully");
      toast({
        title: "Images Uploaded",
        description: "All images have been successfully uploaded.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Failed to Upload Images",
        description: "There was an error uploading images. Please try again.",
        duration: 5000,
      });
      console.error(error);
    }
  };

  const handleDeleteImage = async (url: string) => {
    // Extract the file name from the URL
    const fileName = url.split("/").pop();

    if (!fileName) return;

    try {
      // Create a command to delete the object from S3
      const deleteFromS3 = new DeleteObjectCommand({
        Bucket,
        Key: fileName,
      });

      // Send the delete command to S3
      await s3.send(deleteFromS3);

      // Update state to remove the deleted image URL
      setImageUrls((prev) => prev.filter((imageUrl) => imageUrl !== url));

      toast({
        title: "Image Deleted",
        description: "The image has been successfully deleted.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Failed to Delete Image",
        description: "There was an error deleting the image. Please try again.",
        duration: 5000,
      });
      console.error("Error deleting image:", error);
    }
  };

  const param = useParams();
  const id = param.id;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const serializedForm = {
      name: formData.get("name"),
      description: formData.get("description"),
      category,
      subcategory,
      status: formData.get("status"),
      stock: variants,
      images: imageUrls,
      discount: {
        discountType,
        discountValue,
        isActive: true,
      },
    };
    console.log(serializedForm);

    try {
      const response = await axios.post(
        `/api/products/updateProduct/${id}`,
        serializedForm
      );
      console.log("Product updated:", response.data);
      toast({
        title: "Product Updated",
        description: "The product has been successfully updated.",
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Update Failed",
        description:
          "There was an error updating the product. Please try again.",
      });
    }
  };

  function clearAll() {
    router.push("/admin/products");
  }

  useEffect(() => {
    const fetchData = cache(async () => {
      try {
        const response = await axios.post("/api/products/getProductById", {
          productId: id,
        });
        console.log(response.data);

        // (document.getElementById("name") as HTMLInputElement).value =
        //   response.data.name;
        // (document.getElementById("description") as HTMLInputElement).value =
        //   response.data.description;
        // (document.getElementById("status") as HTMLInputElement).value =
        //   response.data.status;
        setName(response.data.name);
        setDescription(response.data.description);
        setStatus(response.data.status);

        setCategory(response.data.category);
        setSubcategory(response.data.subcategory);
        setVariants(response.data.stock);
        setImageUrls(response.data.images);
        setDiscountType(response.data.discount.discountType);
        setDiscountValue(response.data.discount.discountValue);

        console.log("Product data:", response.data);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    });

    fetchData();
  }, []);
  const handleDeleteVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };
  if (!loading) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-950">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950">
          <form onSubmit={handleSubmit}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 bg-gray-950">
              <div className="flex items-center gap-4 bg-gray-950">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-black text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 ">
                  Pro Controller
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex bg-gray-950">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black text-white hover:bg-white hover:text-black"
                    onClick={clearAll}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    className="bg-black text-white hover:bg-white hover:text-black"
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-8">
                <Card className="col-span-5 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Title, category, description, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Product Name"
                        className="text-white bg-black"
                        onChange={(e) => setName(e.target.value)}
                        value={Name}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        className="text-white bg-black"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        onValueChange={setCategory}
                        value={category}
                        defaultValue="Select a category"
                      >
                        <SelectTrigger className="text-white bg-black">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="text-white bg-black">
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                          <SelectItem value="kids">Kids</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select
                        onValueChange={setSubcategory}
                        value={subcategory}
                      >
                        <SelectTrigger className="text-white bg-black">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent className="text-white bg-black">
                          {subcategories.map((subcategory: string) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Input
                        id="status"
                        name="status"
                        placeholder="Status"
                        className="text-white bg-black"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="discountType">Discount Type</Label>
                      <Select
                        onValueChange={(value) => setDiscountType(value)}
                        defaultValue={discountType}
                      >
                        <SelectTrigger className=" bg-black text-white">
                          <SelectValue
                            placeholder="Select a discount type"
                            className=" bg-black text-white"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white">
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="flat">Flat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="discountValue">Discount Value</Label>
                      <Input
                        id="discountValue"
                        name="discountValue"
                        placeholder="Discount Value"
                        value={discountValue}
                        className=" bg-black text-white"
                        onChange={(e) =>
                          setDiscountValue(Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Variants</Label>
                      {variants.map((variant, index) => (
                        <div key={index} className="flex gap-2">
                          <div>
                            <Input
                              type="text"
                              placeholder="Size"
                              className="text-white bg-black"
                              value={variant.size}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "size",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              placeholder="Stock"
                              className="text-white bg-black"
                              value={variant.stock}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "stock",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              placeholder="Color"
                              className="text-white bg-black"
                              value={variant.color}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "color",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              className="text-white bg-black"
                              placeholder="Price"
                              value={variant.price}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <Button onClick={() => handleDeleteVariant(index)}>
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addVariantRow}
                        className="mt-2"
                      >
                        Add Variant
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 bg-black text-white">
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Upload product images</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 bg-black text-white">
                    <div className="grid gap-2">
                      <Label htmlFor="images">Images</Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-white bg-black"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative w-24 h-24">
                            <Image
                              onClick={() => handleDeleteImage(url)}
                              src={url}
                              alt={`Product Image ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-2 md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-black text-white"
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-black text-white"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
