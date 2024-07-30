// hooks/useProducts.ts
"use client"
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  removeProduct,
  setError,
  setLoading,
  setProducts,
  updateProduct,
} from "../features/productSlice";
import { AppDispatch, RootState } from "../store";

interface IStock {
  id: string;
  stock: number;
  color: string;
  price: number;
  size: string;
}

interface IProduct {
  _id: string;
  name: string;
  description: string;
  status: string;
  images: string[];
  stock: IStock[];
  category: string;
  subcategory?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useProducts = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.product.products);
  const loading = useSelector((state: RootState) => state.product.loading);
  const error = useSelector((state: RootState) => state.product.error);

  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get("/api/products"); // Adjust API endpoint as needed
      dispatch(setProducts(response.data));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createProduct = async (product: IProduct) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post("/api/products/createProduct", product);
      dispatch(addProduct(response.data));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const editProduct = async (product: IProduct) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(
        `/api/products/updateProduct/${product._id}`,
        product
      );
      dispatch(updateProduct(response.data));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteProduct = async (id: string) => {
    dispatch(setLoading(true));
    try {
      await axios.post(`/api/products/deleteProduct`, {
        productId: id,
      });
      dispatch(removeProduct(id));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    editProduct,
    deleteProduct,
  };
};
