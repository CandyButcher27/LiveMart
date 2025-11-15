// src/types/products.ts
export type ProductCategory = 'fruits' | 'electronics' | 'shoes_and_apparels' | 'for_children' | 'other';

export const ProductCategoryLabels: Record<ProductCategory, string> = {
  'fruits': 'Fruits',
  'electronics': 'Electronics',
  'shoes_and_apparels': 'Shoes & Apparels',
  'for_children': 'For Children',
  'other': 'Other'
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  delivery_time: number;
  owner_id?: number;
  product_type: "retail" | "wholesale" | string;
  created_at?: string;
  category: ProductCategory;
};

export type ProductCreate = {
  name: string;
  price: number;
  stock: number;
  description?: string;
  category: ProductCategory;
  delivery_time?: number;
};

