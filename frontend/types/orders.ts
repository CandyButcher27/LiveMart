// src/types/orders.ts
export type OrderProduct = {
  id: number;
  name: string;
  sku?: string;
  image_url?: string | null;
  price: number;
  owner_id?: number; // retailer id
};

export type OrderCustomer = {
  id: number;
  name: string;
  email: string;
};

export type Order = {
  id: number;
  product_id: number;
  product?: OrderProduct;
  customer_id: number;
  customer?: OrderCustomer;
  quantity: number;
  total_price: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | string;
  created_at: string; // ISO timestamp
};

export type PaginatedOrders = {
  data: Order[];
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};
