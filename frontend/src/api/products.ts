import axiosInstance from "./axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Product, ProductCreate } from "../../types/products";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get("/products/");
  return data;
};

export const addProductApi = async (product: ProductCreate): Promise<Product> => {
  const { data } = await axiosInstance.post("/products/", {
    name: product.name,
    description: product.description || "",
    price: product.price,
    stock: product.stock,
    category: product.category,
    delivery_time: product.delivery_time || 1
  });
  return data;
};

// React Query hooks
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const useAddProduct = () => {
  return useMutation({
    mutationFn: addProductApi,
  });
};
