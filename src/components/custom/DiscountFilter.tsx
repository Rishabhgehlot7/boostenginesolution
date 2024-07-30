// components/DiscountFilter.tsx
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const DiscountFilter: React.FC = () => {
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [discountFlat, setDiscountFlat] = useState<string>("");
  const [urlToCopy, setUrlToCopy] = useState<string>("");

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (discountPercentage) {
      queryParams.set("discountPercentage", discountPercentage);
    }

    if (discountFlat) {
      queryParams.set("discountFlat", discountFlat);
    }

    const newUrl = `/products/DiscountedProducts?${queryParams.toString()}`;
    setUrlToCopy(newUrl);
  };

  
  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}${urlToCopy}`)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
      });
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col gap-4 mb-8 border rounded-lg p-3 text-white bg-black">
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <label htmlFor="discountPercentage" className="block text-white mb-2">
            Discount Percentage
          </label>
          <Input
            id="discountPercentage"
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="input-field bg-black"
            placeholder="e.g., 20"
          />
        </div>
        <div>
          <label htmlFor="discountFlat" className="block text-white mb-2">
            Flat Discount (₹)
          </label>
          <Input
            id="discountFlat"
            type="number"
            value={discountFlat}
            onChange={(e) => setDiscountFlat(e.target.value)}
            className="input-field bg-black"
            placeholder="e.g., 100"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Button type="submit" className="btn btn-primary">
          Apply Filters
        </Button>
        {urlToCopy && (
          <button type="button" onClick={handleCopy} className="btn btn-secondary">
            Copy URL
          </button>
        )}
      </div>
    </form>
  );
};

export default DiscountFilter;
