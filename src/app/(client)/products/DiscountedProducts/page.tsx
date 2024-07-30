// pages/discounted-products.tsx
"use client";

import ProductCard from "@/components/custom/ProductCard";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { cache, Suspense, useEffect, useState } from "react";

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
  category: string;
  subcategory?: string;
  isArchived: boolean;
  discount: {
    discountType: "percentage" | "fixed";
    discountValue: number;
    isActive: boolean;
  };
  averageRating: number;
}

const DiscountedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const discountPercentage = searchParams.get("discountPercentage");
  const discountFlat = searchParams.get("discountFlat");

  useEffect(() => {
    const fetchData = cache(async () => {
      try {
        const response = await axios.get("/api/products");
        // // // // console.log("Product data:", response.data);
        setProducts(response.data || []);
      } catch (error) {
        // // // // console.error("Error fetching products:", error);
      }
    });
    fetchData();
  }, []);

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

  const filteredProducts = products.filter((product) => {
    if (discountPercentage && product.discount.discountType === "percentage") {
      return (
        product.discount.discountValue === parseInt(discountPercentage, 10)
      );
    }
    if (discountFlat && product.discount.discountType === "fixed") {
      return product.discount.discountValue === parseInt(discountFlat, 10);
    }
    return true;
  });

  return (
    <Suspense>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Discounted Products
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default DiscountedProducts;
