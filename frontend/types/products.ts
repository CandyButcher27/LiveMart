// src/types/products.ts
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  owner_id?: number;
  product_type: "retail" | "wholesale" | string;
  created_at?: string;
};

export type ProductCreate = {
  name: string;
  description: string;
  price: number;
  stock: number;
};
