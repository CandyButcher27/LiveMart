// -------------------------------------------
// Product Rating Interface
// -------------------------------------------
export interface Rating {
  userId: string;
  rating: number;        // 1–5 stars
  createdAt: string;
}

// -------------------------------------------
// Product Interface (as stored in DB / backend)
// -------------------------------------------
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  delivery_time: number;
  image_url?: string;     // URL or frontend template path
  ratings: Rating[];
}

// -------------------------------------------
// Product Creation Interface (used in frontend form)
// -------------------------------------------
export interface ProductCreate {
  name: string;
  description?: string;   // backend can auto-fill if needed
  price: number;
  stock: number;
  category: string;
  delivery_time?: number;
  image_url?: string;     // <-- retailer selects a template image
}

// -------------------------------------------
// Props: Star Rating Component (Product Page)
// -------------------------------------------
export interface ProductRatingProps {
  productId: string;
  currentRating: number;
  onRatingChange: (productId: string, rating: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

// -------------------------------------------
// Props: Rating Summary Component
// -------------------------------------------
export interface RatingSummaryProps {
  productId: string;
  averageRating: number;
  totalRatings: number;
  size?: "sm" | "md" | "lg";
}

// -------------------------------------------
// Category Labels (Optional helper)
// -------------------------------------------

export type ProductCategory =
  | "fruits"
  | "vegetables"
  | "electronics"
  | "fashion"
  | "others";

export const ProductCategoryLabels: Record<ProductCategory, string> = {
  fruits: "Fruits",
  vegetables: "Vegetables",
  electronics: "Electronics",
  fashion: "Fashion",
  others: "Other Items",
};
