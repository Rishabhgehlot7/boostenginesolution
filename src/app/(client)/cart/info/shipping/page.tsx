import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import productImage from "@/public/productImage.svg";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="container text-white">
      <hr />
      <Breadcrumb className="my-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-white hover:text-white">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/cart"
              className="text-white hover:text-white"
            >
              Cart
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/info"
              className="text-white hover:text-white"
            >
              Info
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/shipping"
              className="text-white hover:text-white"
            >
              Shipping
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <main className=" p-2 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <form className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div>Contact</div>
            <button type="button" className="text-blue-500">
              Change
            </button>
          </div>
          <hr />
          <div className="flex justify-between">
            <div>Ship to</div>
            <button type="button" className="text-blue-500">
              Change
            </button>
          </div>
          <h3 className="text-2xl font-bold pt-7">Delivery Options</h3>
          <hr />
          <div className="flex justify-between">
            <div>
              <div>Express Courier (Air)</div>
              <div>3 to 4 Business Days</div>
            </div>
            <button type="button" className="text-blue-500">
              Change
            </button>
          </div>
          <div className="flex justify-between flex-col gap-2 md:flex-row">
            <div>Expected Date:</div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="expected_date"
                  aria-label="Monday, August 14"
                />
                Monday, August 14
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="expected_date"
                  aria-label="Wednesday, August 16"
                />
                Wednesday, August 16
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="expected_date"
                  aria-label="Tuesday, August 22"
                />
                Tuesday, August 22
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="expected_date"
                  aria-label="Friday, August 25"
                />
                Friday, August 25
              </label>
            </div>
          </div>
          <hr />
          <div className="flex justify-between flex-col gap-2 md:flex-row">
            <div>
              <div>Guaranteed by:</div>
              <div>UPS Next Day Air Saver</div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex justify-between items-center gap-5">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="guaranteed_by"
                    aria-label="Wednesday, August 11th by 8 PM"
                  />
                  Wednesday, August 11th by 8 PM
                </div>
                <div>$24.00</div>
              </label>
              <label className="flex justify-between items-center gap-5">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="guaranteed_by"
                    aria-label="Wednesday, August 11th by Noon"
                  />
                  Wednesday, August 11th by Noon
                </div>
                <div>$24.00</div>
              </label>
            </div>
          </div>
          <div className="flex justify-between py-8 gap-3">
            <Link href="/cart/info/">
              <Button type="button" className="text-blue-500">
                Return to Cart
              </Button>
            </Link>
            <Link href="/cart/info/shipping/payment">
              <Button type="button" className="text-blue-500">
                Continue To Payment
              </Button>
            </Link>
          </div>
        </form>

        <div className=" flex-1 hidden md:block">
          <main className=" grid grid-cols-1 py-4 gap-3">
            <section className=" border rounded-2xl flex flex-col text-white gap-3 p-4">
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
            </section>
            <OrderSummary />
          </main>
        </div>
      </main>
    </div>
  );
};

const OrderSummary = () => {
  return (
    <div className=" text-white border rounded-2xl p-4 h-fit">
      <h2 className=" text-2xl">Order Summary</h2>
      <div className=" flex justify-between py-2">
        <div>Subtotal</div>
        <div>$565</div>
      </div>
      <div className=" flex justify-between py-2">
        <div>Discount (-20%)</div>
        <div>-$113</div>
      </div>
      <div className=" flex justify-between py-2">
        <div>Delivery Fee</div>
        <div>$15</div>
      </div>
      <hr className=" my-3" />
      <div className=" flex justify-between py-2">
        <div>Total</div>
        <div>$467</div>
      </div>
    </div>
  );
};

const CartItem = () => {
  return (
    <div>
      <div className=" flex gap-3">
        <Image src={productImage} alt="" className=" w-24 h-26" />
        <div className=" w-full flex flex-col justify-between">
          <div className=" flex justify-between">
            <div>
              <h2 className=" text-xl">Product Name</h2>
              <div className=" text-xs">Size: M</div>
              <div className=" text-xs">Color: White</div>
            </div>
            <Trash2 color="#ff0000" />
          </div>
          <div className=" flex justify-between">
            <div className=" text-xl">$260</div>
            <div>
              <div className="flex">
                <button className="bg-gray-900 text-white py-1 rounded-tl-full px-3 md:px-5 rounded-bl-full border-none">
                  -
                </button>
                <input
                  type="text"
                  className=" w-5 py-1  border-none text-center bg-gray-900 text-white outline-none"
                  value={25}
                />
                <button className="bg-gray-900 text-white py-1 border-none px-3 md:px-5 rounded-tr-full rounded-br-full">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className=" my-4" />
    </div>
  );
};

export default page;
