"use client";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "../ui/button";
const OrderSummary = ({
  subtotal,
  discountAmount,
  deliveryFee,
  total,
  couponCode,
  setCouponCode,
  applyCoupon,
  errorMessage,
  email,
}: {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
  errorMessage: string;
  email: any;
}) => {
  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderId: string = await createOrderId();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100), // converting to paisa
        currency: "INR",
        name: "Your Company Name",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) alert("Payment succeeded");
          else alert(res.message);
        },
        prefill: {
          email: email,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment processing failed", error);
    }
  };

  const createOrderId = async (): Promise<string> => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("Order creation failed", error);
      throw error;
    }
  };
  const router = useRouter();
  const handleCartPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subtotal) {
      return;
    }
    router.push(`/cart/info?discountAmount=${discountAmount}`);
  };
  return (
    <div className="text-white border rounded-2xl p-4 h-fit">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <h2 className="md:text-2xl">Order Summary</h2>
      <div className="flex justify-between py-2">
        <div className=" text-sm">Subtotal</div>
        <div className=" text-sm">₹{subtotal.toFixed(2)}</div>
      </div>
      <div className="flex justify-between py-2">
        <div className=" text-sm">Discount</div>
        <div className=" text-sm">-₹{discountAmount.toFixed(2)}</div>
      </div>
      <div className="flex justify-between py-2">
        <div className=" text-sm">Delivery Fee</div>
        <div className=" text-sm">₹{deliveryFee.toFixed(2)}</div>
      </div>
      <hr className="my-3" />
      <div className="flex justify-between py-2">
        <div className=" text-sm">Total</div>
        <div className=" text-sm">₹{total.toFixed(2)}</div>
      </div>
      <div className="flex justify-between py-4 gap-2">
        <div className="flex justify-center bg-gray-800 p-2 rounded-full gap-2 flex-1">
          <input
            type="text"
            className="bg-gray-800 text-white w-full outline-none md:text-sm"
            placeholder="Add promo code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </div>
        <Button
          onClick={applyCoupon}
          className="hover:text-white bg-yellow-400 text-black rounded-full px-5 md:text-xs"
        >
          Apply
        </Button>
      </div>
      {errorMessage && <div className="text-red-500 py-1">{errorMessage}</div>}
      <form onSubmit={handleCartPage}>
        <Button
          type="submit"
          className="hover:text-white bg-white text-black py-2 rounded-full w-full flex justify-center items-center gap-2 md:text-sm"
        >
          Go to Checkout
        </Button>
      </form>
    </div>
  );
};

export default OrderSummary;
