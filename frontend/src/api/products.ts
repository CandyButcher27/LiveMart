import axiosInstance from "./axiosInstance";
import { useQuery } from "@tanstack/react-query";

export type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get("/products/");
  return data;
};

// ✅ React Query hook (optional)
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};
