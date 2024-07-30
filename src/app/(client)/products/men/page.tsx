"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { cache, useEffect, useState } from "react";

import ProductCard from "@/components/custom/ProductCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

const categories: Category[] = [
  { id: 1, name: "men" },
  { id: 2, name: "women" },
  { id: 3, name: "kids" },
];
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
const calculateDiscountedPrice = (product: Product) => {
  const originalPrice = product.stock[0].price;
  if (!product.discount.isActive) {
    return originalPrice;
  }
  if (product.discount.discountType === "percentage") {
    return (
      originalPrice - (originalPrice * product.discount.discountValue) / 100
    );
  }
  if (product.discount.discountType === "fixed") {
    return originalPrice - product.discount.discountValue;
  }
  return originalPrice;
};
const Page: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(1000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const handleSelectedCategories = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    // "orange",
    // "purple",
    // "pink",
    // "brown",
    "black",
    "white",
  ];

  const handleSelectedSizes = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };
  const handleSelectedColors = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedColors(selectedColors.filter((s) => s !== size));
    } else {
      setSelectedColors([...selectedColors, size]);
    }
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleSelectedSizesForStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const styles = [
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
  ];

  const handlePriceRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrice(Number(event.target.value));
  };
  useEffect(() => {
    // Simulating fetch delay for 1 second
    const fetchData = cache(async () => {
      try {
        const response = await axios.get("/api/products");
        // console.log("Product data:", response.data);
        // setProducts(response.data || []);
        const kids = response.data.filter(
          (item: Product) => item.category == "men"
        );
        setProducts(kids);
        // console.log(kids);
        // router.refresh();
      } catch (error) {
        // console.error("Error fetching products:", error);
        // Handle error states or show a message to the user
      }
    });

    fetchData();
  }, []);

  const handleApplyFilters = async () => {
    try {
      const response = await axios.post("/api/products/getFilteredProducts", {
        categories: selectedCategories,
        price: `0-${price + 20}`,
        sizes: selectedSizes,
        styles: selectedStyles,
        colors: selectedColors, // Colors not yet implemented
      });
      // console.log(response);

      setProducts(response.data);
      setSelectedColors([]);
    } catch (error) {
      // console.error("Error fetching filtered products:", error);
    }
  };

  return (
    <div className=" container mx-auto">
      {Array.isArray(products) && products.length > 0 && (
        <Sheet>
          <SheetContent className="black white overflow-auto">
            <Card className="bg-black text-white p-4 border-none">
              <div className="flex justify-between items-center py-3">
                <h1 className="text-xl font-bold">Filters</h1>
                <Filter />
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Categories</h1>
                <div className="flex flex-col justify-center p-2">
                  <div className="flex gap-2 flex-col">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() =>
                            handleSelectedCategories(category.name)
                          }
                          className="mr-2 cursor-pointer"
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Price</h1>
                <input
                  type="range"
                  id="priceRange"
                  name="priceRange"
                  min="40"
                  max="5000"
                  step={20}
                  value={price}
                  onChange={handlePriceRangeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2 text-lg">Selected Price: ₹{price}</div>
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Colors</h1>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Checkbox
                      key={color}
                      className={`w-7 h-7 rounded-full border-white`}
                      style={{ backgroundColor: color }}
                      value={color}
                      onClick={() => handleSelectedSizes(color)}
                    ></Checkbox>
                  ))}
                </div>
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Sizes</h1>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`py-1 rounded-full border-none px-5 ${
                        selectedSizes.includes(size)
                          ? "bg-white text-black"
                          : "bg-gray-900 text-white"
                      }`}
                      onClick={() => handleSelectedSizes(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Styles</h1>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button
                      key={style}
                      className={`py-1 rounded-full border-none px-5 ${
                        selectedStyles.includes(style)
                          ? "bg-white text-black"
                          : "bg-gray-900 text-white"
                      }`}
                      onClick={() => handleSelectedSizesForStyle(style)}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="m-3" />
              <Button
                onClick={handleApplyFilters}
                className="w-full rounded-full bg-white text-black font-bold hover:bg-black hover:text-white hover:border"
              >
                Apply Filter
              </Button>
            </Card>
          </SheetContent>

          <Breadcrumb className="cursor-pointer flex justify-between items-center py-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-white hover:text-white"
                >
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
                <BreadcrumbLink
                  href="/products/men"
                  className="text-white hover:text-white"
                >
                  Men
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
            <SheetTrigger>
              <Filter className="text-white md:hidden" size={25} />
            </SheetTrigger>
          </Breadcrumb>
        </Sheet>
      )}
      <main className="flex md:py-10 gap-5">
        <section className="hidden lg:block">
          {Array.isArray(products) && products.length > 0 && (
            <Card className="bg-black text-white md:p-4 w-[300px]">
              <div className="flex justify-between items-center py-3">
                <h1 className="text-xl font-bold">Filters</h1>
                <Filter />
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Categories</h1>
                <div className="flex flex-col justify-center p-2">
                  <div className="flex gap-2 flex-col">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() =>
                            handleSelectedCategories(category.name)
                          }
                          className="mr-2 cursor-pointer"
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Price</h1>
                <input
                  type="range"
                  id="priceRange"
                  name="priceRange"
                  min="40"
                  max="5000"
                  step={20}
                  value={price}
                  onChange={handlePriceRangeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2 text-lg">Selected Price: ₹{price}</div>
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Colors</h1>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Checkbox
                      key={color}
                      className={`w-7 h-7 rounded-full border-white`}
                      style={{ backgroundColor: color }}
                      value={color}
                      onClick={() => handleSelectedSizes(color)}
                    />
                  ))}
                </div>
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Sizes</h1>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`py-1 rounded-full border-none px-5 ${
                        selectedSizes.includes(size)
                          ? "bg-white text-black"
                          : "bg-gray-900 text-white"
                      }`}
                      onClick={() => handleSelectedSizes(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <hr />
              <div className="p-4">
                <h1 className="text-lg font-bold py-3">Styles</h1>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button
                      key={style}
                      className={`py-1 rounded-full border-none px-5 ${
                        selectedStyles.includes(style)
                          ? "bg-white text-black"
                          : "bg-gray-900 text-white"
                      }`}
                      onClick={() => handleSelectedSizesForStyle(style)}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="m-3" />
              <Button
                onClick={handleApplyFilters}
                className="w-full rounded-full bg-white text-black font-bold hover:bg-black hover:text-white hover:border"
              >
                Apply Filter
              </Button>
            </Card>
          )}
        </section>
        {Array.isArray(products) && products.length > 0 ? (
          <section className="px-2 flex flex-col items-center w-full">
            <h1 className="text-2xl font-bold py-5 text-white w-full">
              Products
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
          </section>
        ) : (
          <div className=" text-xl text-[#C6A352] text-center w-full font-bold">
            Coming Soon
          </div>
        )}
      </main>
    </div>
  );
};

// const Product = (id = "rishah", image = "i", name = "", price = "") => {
//   return (
//     <Link href={`/products/${id}`}>
//       <Image src={image} alt="" className=" w-[295px] h-auto" />
//       <h3 className="white text-sm py-2">${name}</h3>
//       <Image src={rating} alt="" />
//       <div className="white text-xl py-2">₹{price}</div>
//     </Link>
//   );
// };

export default Page;
