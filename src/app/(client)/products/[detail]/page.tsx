"use client";
import ReviewForm from "@/components/custom/ReviewForm";
import ReviewList from "@/components/custom/ReviewList";
import StarRateForProduct from "@/components/custom/StarRateForProduct";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import rating from "@/public/rating.svg";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  discount: {
    discountType: "percentage" | "fixed";
    discountValue: number;
    isActive: boolean;
  };
  averageRating: number;
}
const Page = () => {
  const { toast } = useToast();
  const param = useParams();
  const id = param.detail;
  let [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [viewImage, setViewImage] = useState("");
  const [price, setPrice] = useState<number>(product?.stock[0]?.price || 0);
  const [showChart, setShowChart] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const isOutOfStock = product?.stock.every((stock) => stock.stock === 0);
  useEffect(() => {
    // Simulating fetch delay for 1 second
    const fetchData = cache(async () => {
      try {
        const response = await axios.get("/api/products");
        // console.log("Product data:", response.data);
        // setProducts(response.data || []);
        const kids = response.data.filter(
          (item: Product) => item._id != product?._id
        );
        setProducts(kids);
        // console.log(kids);
        // router.refresh();
      } catch (error) {
        // console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error fetching products.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        // Handle error states or show a message to the user
      }
    });

    fetchData();
  }, [toast]);

  useEffect(() => {
    // // console.log(param.id);

    const fetchData = async () => {
      try {
        const response = await axios.post("/api/products/getProductById", {
          productId: id,
        });
        // console.log(response.data);
        setProduct(response.data);
        setViewImage(response.data?.images[0]);
        // console.log(product);
        setLoading(true);
      } catch (error) {
        // console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error fetching product.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        // Handle error states or show a message to the user
      }
    };

    fetchData();
  }, []);
  const { data } = useSession();
  const router = useRouter();
  const addToCart = async () => {
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
      });
      return;
    }
    if (!data) {
      router.push("/sign-up");
      toast({
        title: "Sign Up",
        description: "Please sign up to add products to cart.",
      });
      return;
    }
    if (selectedSizes.length === 0) {
      toast({
        title: "Select Size",
        description: "Please select a size.",
      });
      return;
    }
    try {
      const response = await axios.post(`/api/users/addToCart`, {
        productId: product?._id,
        quantity: quantity,
        size: selectedSizes[0] ?? product?.stock[0].size,
        color: selectedColors[0] ?? product?.stock[0].color,
        price: calculateDiscountedPrice(product!), // Assuming the first stock item's price
      });
      // console.log(response.data);
      setAddedToCart(true);
      toast({
        title: "Success",
        description: "Product added to cart successfully.",
      });
    } catch (error) {
      // console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error adding to cart.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      // Handle error states or show a message to the user
    }
  };
  const buyNow = async () => {
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
      });
      return;
    }
    if (!data) {
      router.push("/sign-up");
      toast({
        title: "Sign Up",
        description: "Please sign up to purchase products.",
      });
    }
    if (selectedSizes.length === 0) {
      toast({
        title: "Select Size",
        description: "Please select a size.",
      });
      return;
    }
    try {
      const response = await axios.post(`/api/users/addToCart`, {
        productId: product?._id,
        quantity: quantity,
        size: selectedSizes[0] ?? product?.stock[0].size,
        color: selectedColors[0] ?? product?.stock[0].color,
        price: calculateDiscountedPrice(product!), // Assuming the first stock item's price
      });
      // console.log(response.data);
      toast({
        title: "Success",
        description: "Product added to cart. Redirecting to cart...",
      });
      router.push("/cart");
    } catch (error) {
      // console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error processing purchase.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      // Handle error states or show a message to the user
    }
  };

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const updatePrice = () => {
    const selectedStock = product?.stock.find(
      (item) => item.size === (selectedSizes[0] ?? product?.stock[0]?.size)
    );
    if (selectedStock) {
      setUpdateCount(selectedStock.stock);
      setPrice(selectedStock.price);
    }
  };
  useEffect(() => {
    updatePrice();
  }, [selectedColors, selectedSizes, product]);

  const handleTabClick = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes([]);
    } else {
      setSelectedSizes([size]);
    }
    updatePrice();
  };

  const handleTabColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors([]);
    } else {
      setSelectedColors([color]);
    }
    updatePrice();
  };
  const sizes = ["S", "M", "L", "XL", "XXL"];
  // console.log(data);

  if (!loading) {
    return (
      <div className=" w-full min-h-screen flex justify-center items-center">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }
  const handleChangeImageView = (imgURLNew: string) => {
    setViewImage(imgURLNew);
  };
  const calculateDiscountedPrice = (product: Product) => {
    // const originalPrice = product.stock[0].price;
    const originalPrice = price;
    if (!product.discount.isActive) {
      return originalPrice;
    }
    if (product.discount.discountType === "percentage") {
      return Math.floor(
        originalPrice - (originalPrice * product.discount.discountValue) / 100
      );
    }
    if (product.discount.discountType === "fixed") {
      return originalPrice - product.discount.discountValue;
    }
    return originalPrice;
  };
  return (
    <div className="mx-auto px-3 text-white">
      <Head>
        <title>{product?.name ? `${product.name}` : `Clothinix`}</title>
        <meta name="description" content={product?.description} />
      </Head>
      <Breadcrumb className=" cursor-pointer flex justify-between items-center py-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-white hover:text-white">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/products"
              className="text-white hover:text-white"
            >
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white hover:text-white">
              {product?.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <main className=" grid lg:grid-cols-2 md:gap-10">
        <section className=" flex gap-3 py-5 flex-col lg:flex-row justify-center items-center">
          <div className=" flex flex-row lg:flex-col gap-2 order-2 lg:order-1 ">
            {Array.isArray(product?.images) &&
              product?.images.slice(0, 3).map((imgURL, index) => (
                <div key={index} className="lg:w-[150px] lg:h-[150px]">
                  <Image
                    onClick={() => handleChangeImageView(imgURL)}
                    src={imgURL}
                    width={150}
                    height={150}
                    alt=""
                    className="lg:w-[150px] lg:h-[150px] rounded-2xl aspect-square"
                  />
                </div>
              ))}
          </div>
          <div className="lg:order-1">
            <div className=" w-fit aspect-square">
              {product?.images[0] && (
                <Image
                  src={viewImage}
                  width={384}
                  height={384}
                  alt=""
                  className=" rounded-2xl w-fit aspect-square"
                ></Image>
              )}
            </div>
          </div>
        </section>
        <section className=" md:py-5 flex flex-col gap-2">
          <h1 className=" text-xl md:text-3xl font-bold gold uppercase">
            {product?.name}
          </h1>
          <StarRateForProduct
            rating={product?.averageRating || 4}
            onChange={() => {}}
          />

          <div className="flex items-center gap-2 ">
            <p className="white text-sm md:text-xl md:py-2 py-1">
              ₹{calculateDiscountedPrice(product!)}
            </p>
            {product?.discount.isActive && (
              <p className=" text-sm md:text-xl text-gray-400 line-through">
                ₹{price}
              </p>
            )}
            {product?.discount.isActive && (
              <Badge
                variant="destructive"
                className=" text-[10px] px-[4px] py-[2px] md:text-xs md:px-2 md:py-1"
              >
                {product.discount.discountType === "percentage"
                  ? `${product.discount.discountValue}% Off`
                  : `₹${product.discount.discountValue} Off`}
              </Badge>
            )}
          </div>

          {/* <p>{product?.description}</p> */}
          <hr className=" my-3" />
          <div className="">
            <h1 className=" text-sm md:text-lg font-bold pb-3">Color</h1>
            <div className=" flex flex-wrap gap-2">
              {Array.isArray(product?.stock) &&
                product?.stock
                  .slice(0, 1)
                  .map((stock) => (
                    <button
                      onClick={() => handleTabColor(stock.color)}
                      key={stock.id}
                      className={`w-5 h-5 md:w-7 md:h-7 rounded-full border-white border`}
                      style={{ backgroundColor: stock.color }}
                    />
                  ))}
            </div>
          </div>
          <hr className=" my-3" />
          <div className="">
            <h1 className="  text-sm md:text-lg font-bold pb-3">Sizes</h1>
            <div className="flex flex-colp-2">
              <div className="flex flex-wrap gap-2">
                {product?.stock.map((stock) => (
                  <button
                    disabled={stock.stock === 0}
                    key={stock.id}
                    className={`py-1 rounded-full border-none px-5 text-sm md:text-xl ${
                      stock.stock === 0 ? "line-through cursor-not-allowed" : ""
                    } ${
                      selectedSizes.includes(stock.size)
                        ? "bg-white text-black"
                        : "bg-gray-900 text-white"
                    }`}
                    onClick={() => handleTabClick(stock.size)}
                  >
                    {stock.size}
                  </button>
                ))}

                {showChart && (
                  <div className=" w-screen h-screen flex justify-center items-center bg-[rgb(12,22,22)] left-0 top-0 fixed z-50">
                    <div
                      className=" text-xl md:text-2xl absolute right-5 top-5 cursor-pointer text-black md:text-white"
                      onClick={() => setShowChart(false)}
                    >
                      X
                    </div>
                    <Image
                      src={
                        "https://s3-clothinix-images-bucket.s3.ap-south-1.amazonaws.com/e6790c36ed704380b9441b3c742ada55.png"
                      }
                      alt="size chart"
                      className=" h-[700px] w-[500px]"
                      height={200}
                      width={200}
                    />
                  </div>
                )}
                <button
                  className="py-1 rounded-full border-none px-5 text-sm md:text-xl bg-gray-900"
                  onClick={() => setShowChart(true)}
                >
                  Size Chart
                </button>
              </div>
            </div>
          </div>
          <hr className=" my-3" />
          {isOutOfStock && (
            <p className="text-red-500 font-bold">Out of stock</p>
          )}
          <div className=" flex gap-4">
            {!isOutOfStock && (
              <div className="flex justify-center items-center bg-gray-900 text-white rounded-full">
                <button
                  className="bg-gray-900 text-white py-1 rounded-tl-full rounded-bl-full border-none px-5"
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                >
                  -
                </button>
                {quantity}
                <button
                  className="bg-gray-900 text-white py-1 border-none px-5 rounded-tr-full rounded-br-full"
                  onClick={() => {
                    if (updateCount > quantity) {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            )}

            <Button
              onClick={addToCart}
              className=" rounded-full md:w-full text-black bg-white hover:bg-white hover:border hover:text-black text-xs"
            >
              {addedToCart ? "Added to cart" : "Add to cart"}
            </Button>
            <Button
              onClick={buyNow}
              className=" rounded-full md:w-full text-black bg-white hover:bg-black hover:border hover:text-white text-xs"
            >
              Buy Now
            </Button>
          </div>
        </section>
      </main>
      {/* <hr className=" my-3" /> */}

      <section className=" w-full pt-5">
        <Tabs defaultValue="Rating" className=" w-full bg-black">
          <TabsList className=" w-full flex flex-1 bg-black my-5 justify-evenly">
            <TabsTrigger value="Product">
              Product <br className=" block md:hidden" /> Details
            </TabsTrigger>
            <TabsTrigger value="Rating">
              Rating & <br className=" block md:hidden" /> Reviews
            </TabsTrigger>
            {/* <TabsTrigger value="FAQs">FAQs</TabsTrigger> */}
          </TabsList>
          <hr className=" my-5" />
          <TabsContent value="Product" className=" max-w-6xl">{product?.description}</TabsContent>
          <TabsContent value="Rating">
            <ReviewList productId={product?._id ? product?._id : ""} />
            {data?.user && (
              <ReviewForm
                user={data.user._id ?? ""}
                username={data.user.username ?? ""}
                product={product?._id ?? ""}
              />
            )}
          </TabsContent>
          {/* <TabsContent value="FAQs">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent> */}
        </Tabs>
      </section>
      <hr className=" my-5" />
      <div className=" mx-auto md:py-10 flex flex-col items-center">
        <h1 className=" gold text-xl md:text-3xl text-center font-bold uppercase">
          You might also like
        </h1>
        <div className=" grid grid-cols-2 lg:grid-cols-4 gap-5 py-5">
          {Array.isArray(products) &&
            products.slice(0, 4).map((product) => (
              <Link href={`/products/${product?._id}`} key={product._id}>
                <Image
                  src={product.images[0]}
                  alt=""
                  width={295}
                  height={295}
                  className="w-[295px] h-[150px] md:h-[298px] rounded-xl"
                />
                <h3 className="white text-sm md:text-xl md:py-2 py-1 line-clamp-1">
                  {product.name}
                </h3>
                <Image src={rating} alt="" className=" w-20" />
                <div className=" flex items-center gap-2">
                  <p className="white text-sm md:text-xl md:py-2 py-1">
                    ₹{calculateDiscountedPrice(product)}
                  </p>
                  {product.discount.isActive && (
                    <p className="text-sm md:text-xl text-gray-400 line-through">
                      ₹{product.stock[0].price}
                    </p>
                  )}
                  {product.discount.isActive && (
                    <Badge
                      variant="destructive"
                      className="text-[9px] px-[2px] py-[1px] md:text-xs md:px-2 md:py-1"
                    >
                      {product.discount.discountType === "percentage"
                        ? `${product.discount.discountValue}% Off`
                        : `₹${product.discount.discountValue} Off`}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
        </div>
        <div className="flex justify-center items-center">
          <Link
            href={"/products"}
            className="black white border rounded-full px-8 w-full lg:w-auto p-2 text-center"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
