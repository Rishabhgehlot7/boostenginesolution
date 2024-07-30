import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import StarRateForProduct from "./StarRateForProduct";
interface IStock {
  id: string;
  stock: number;
  color: string;
  price: number;
  size: string;
}

interface Product {
  averageRating: number;
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
}

interface ProductCardProps {
  product: Product;
}

const calculateDiscountedPrice = (product: Product) => {
  const originalPrice = product.stock[0].price;
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

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <Card key={product._id} className="border-none bg-black">
      <Link
        href={`/products/${product._id}?name=${product?.name}&category=${product.category}&subcategory=${product.subcategory}`}
      >
        <div className="image-wrapper relative">
          <Image
            src={product.images[0]}
            width={400}
            height={400}
            alt={product.name}
            className="product-image transition-opacity duration-500 ease-in-out aspect-square rounded-xl"
          />
          {product.images.length > 1 ? (
            <Image
              src={product.images[1]}
              width={400}
              height={400}
              alt={product.name}
              className="product-image-hover absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out aspect-square rounded-xl"
            />
          ) : (
            <Image
              src={product.images[0]}
              width={400}
              height={400}
              alt={product.name}
              className="product-image-hover absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out aspect-square rounded-xl"
            />
          )}
        </div>
        <h3 className="white text-sm md:text-xl md:py-2 py-1 line-clamp-1">
          {product.name}
        </h3>
        <StarRateForProduct
          rating={product.averageRating}
          onChange={() => {}}
        />
        <div className="flex items-center gap-1 md:gap-2 ">
          <p className="white text-sm md:text-xl md:py-2 py-1">
            ₹{calculateDiscountedPrice(product)}
          </p>
          {product.discount.isActive && (
            <p className="text-[12px] md:text-xl text-gray-400 line-through">
              ₹{product.stock[0].price}
            </p>
          )}
          {product.discount.isActive && (
            <Badge
              variant="destructive"
              className=" text-[9px] px-[2px] py-[1px] md:text-xs md:px-2 md:py-1"
            >
              {product.discount.discountType === "percentage"
                ? `${product.discount.discountValue}% Off`
                : `₹${product.discount.discountValue} Off`}
            </Badge>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;
