"use client";
import ProductCard from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";

const SearchForm = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (search.trim() !== "") {
      handleSearch();
    } else {
      handleSearchIntial();
    }
  }, [search]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/products/searchProducts", {
        search,
      });
      setProducts(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleSearchIntial = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/products/searchProducts", {
        search: "men",
      });
      setProducts(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleSearchIntial();
  }, []);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container mx-auto">
      <h1>Search Products</h1>
      <form onSubmit={(e) => e.preventDefault()} className="flex">
        <Input
          type="text"
          value={search}
          onChange={handleInputChange}
          placeholder="Search for a product"
          className="bg-black text-white outline-none"
        />
        <Button type="button" onClick={handleSearch} className="p-5">
          Search
        </Button>
      </form>
      <main className="flex py-4 md:py-6 lg:py-10 gap-5">
        <section className="px-2">
          <h1 className="text-xl font-bold py-5 text-white">Suggestions</h1>
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-white">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product: any) => (
                <ProductCard product={product} key={product._id}/>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SearchForm;
