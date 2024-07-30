import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function PaymentPage() {
  return (
    <div className="container mx-auto p-4 text-white">
      <h2 className="text-3xl font-bold mb-4">Payment Information</h2>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="cardName" className="mb-2 font-semibold">
            Name on Card
          </label>
          <Input
            className="uppercase bg-black text-white border "
            type="text"
            id="cardName"
            name="cardName"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="cardNumber" className="mb-2 font-semibold">
            Card Number
          </label>
          <Input
            className="uppercase bg-black text-white border "
            type="text"
            id="cardNumber"
            name="cardNumber"
            required
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col flex-1">
            <label htmlFor="expiryDate" className="mb-2 font-semibold">
              Expiry Date
            </label>
            <Input
              className="uppercase bg-black text-white border "
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="cvv" className="mb-2 font-semibold">
              CVV
            </label>
            <Input
              className="uppercase bg-black text-white border "
              type="text"
              id="cvv"
              name="cvv"
              required
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="billingAddress" className="mb-2 font-semibold">
            Billing Address
          </label>
          <Input
            className="uppercase bg-black text-white border "
            placeholder="Company(Optional)"
            type="text"
            id="billingAddress"
            name="billingAddress"
            required
          />
        </div>
        <div className="flex justify-between mt-4">
          <Link href="/cart/info/" className="text-blue-500">
            Return to Cart
          </Link>
          <Button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Complete Payment
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PaymentPage;
