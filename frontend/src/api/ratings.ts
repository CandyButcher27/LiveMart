import axiosInstance from "./axiosInstance";

const RATINGS_STORAGE_KEY = 'livemart_product_ratings';

// Get ratings from localStorage
const getStoredRatings = (): Record<string, any[]> => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Save ratings to localStorage
const saveRatings = (ratings: Record<string, any[]>) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }
};

// Add or update a rating
export const rateProduct = async (productId: string | number, userId: string, rating: number): Promise<any> => {
  const productIdStr = String(productId);
  return new Promise((resolve) => {
    setTimeout(() => {
      const ratings = getStoredRatings();
      const productRatings = ratings[productIdStr] || [];
      
      // Check if user already rated this product
      const existingRatingIndex = productRatings.findIndex((r: any) => r.userId === userId);
      const newRating = {
        userId,
        rating,
        createdAt: new Date().toISOString()
      };

      if (existingRatingIndex >= 0) {
        // Update existing rating
        productRatings[existingRatingIndex] = newRating;
      } else {
        // Add new rating
        productRatings.push(newRating);
      }

      ratings[productIdStr] = productRatings;
      saveRatings(ratings);
      
      resolve(newRating);
    }, 300);
  });
};

// Get ratings for a product
export const getProductRatings = async (productId: string | number): Promise<any[]> => {
  const productIdStr = String(productId);
  return new Promise((resolve) => {
    setTimeout(() => {
      const ratings = getStoredRatings();
      resolve(ratings[productIdStr] || []);
    }, 200);
  });
};

// Get average rating for a product
export const getAverageRating = (ratings: any[]): number => {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / ratings.length;
};
