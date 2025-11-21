import React, { useState, useEffect } from "react";
import type { Product } from "../../../types/products";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../utils/toast";
import { Star, StarHalf } from "lucide-react";
import {
  getProductRatings,
  rateProduct,
  getAverageRating,
} from "../../api/ratings";

// Hardcoded images
const IMAGE_MAP: Record<string, string> = {
  apple: "/product-images/apple.webp",
  children: "/product-images/children.webp",
  laptop: "/product-images/laptop.webp",
  shoe: "/product-images/shoe.webp",
};

// fallback
const FALLBACK_IMAGE = "/product-images/default.webp";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { email, isAuthenticated } = useAuth();

  const [ratings, setRatings] = useState<{ rating: number; count: number }>({
    rating: 0,
    count: 0,
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  /* Load Ratings */
  useEffect(() => {
    const loadRatings = async () => {
      try {
        const productRatings = await getProductRatings(product.id.toString());
        const avgRating = getAverageRating(productRatings);

        setRatings({
          rating: avgRating,
          count: productRatings.length,
        });
      } catch (error) {
        console.error("Error loading ratings:", error);
      }
    };
    loadRatings();
  }, [product.id]);

  /* Handle Rating */
  const handleRating = async (rating: number) => {
    if (!isAuthenticated || !email) {
      showError("Please log in to rate products");
      return;
    }

    try {
      setIsRating(true);
      await rateProduct(product.id.toString(), email, rating);

      const updatedRatings = await getProductRatings(product.id.toString());
      const avgRating = getAverageRating(updatedRatings);

      setRatings({
        rating: avgRating,
        count: updatedRatings.length,
      });

      showSuccess("Thank you for your rating!");
    } catch (err) {
      showError("Failed to submit rating");
    } finally {
      setIsRating(false);
    }
  };

  /* Add to Cart */
  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: "retail",
    });

    showSuccess(`${product.name} added to cart`);
  };

  /* Rating Star UI */
  const renderStar = (index: number) => {
    const ratingValue = index + 1;
    const displayRating = hoverRating || ratings.rating;

    if (ratingValue <= Math.floor(displayRating)) {
      return (
        <Star
          key={index}
          className="w-4 h-4 text-yellow-400 fill-yellow-400 cursor-pointer"
          onClick={() => handleRating(ratingValue)}
          onMouseEnter={() => setHoverRating(ratingValue)}
          onMouseLeave={() => setHoverRating(0)}
        />
      );
    }

    if (ratingValue - 0.5 <= displayRating) {
      return (
        <StarHalf
          key={index}
          className="w-4 h-4 text-yellow-400 fill-yellow-400 cursor-pointer"
          onClick={() => handleRating(ratingValue)}
          onMouseEnter={() => setHoverRating(ratingValue)}
          onMouseLeave={() => setHoverRating(0)}
        />
      );
    }

    return (
      <Star
        key={index}
        className="w-4 h-4 text-gray-400 cursor-pointer"
        onClick={() => handleRating(ratingValue)}
        onMouseEnter={() => setHoverRating(ratingValue)}
        onMouseLeave={() => setHoverRating(0)}
      />
    );
  };

  /* Hardcoded Image Matching */
  const lower = product.name.toLowerCase();
  let finalImage = FALLBACK_IMAGE;

  if (lower.includes("apple")) finalImage = IMAGE_MAP.apple;
  else if (lower.includes("shoe")) finalImage = IMAGE_MAP.shoe;
  else if (lower.includes("children")) finalImage = IMAGE_MAP.children;
  else if (lower.includes("laptop")) finalImage = IMAGE_MAP.laptop;

  /* UI */
  return (
    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 h-full">
      
      {/* IMAGE */}
      <div className="relative group">
        <img
          src={finalImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
          alt={product.name}
          className="rounded-xl mb-3 object-cover h-44 w-full group-hover:brightness-110 transition-all duration-200"
        />

        {ratings.count > 0 && (
          <div className="absolute bottom-3 left-2 bg-black/70 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md backdrop-blur-md">
            <span className="text-yellow-400 text-sm font-medium">
              {ratings.rating.toFixed(1)}
            </span>
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-300">({ratings.count})</span>
          </div>
        )}
      </div>

      {/* NAME + DESCRIPTION */}
      <h3 className="text-lg font-semibold text-white tracking-wide">
        {product.name}
      </h3>

      <p className="text-slate-400 text-sm line-clamp-2 mb-3">
        {product.description}
      </p>

      {/* RATING */}
      <div className="flex items-center gap-1 mb-3">
        {[0, 1, 2, 3, 4].map((i) => renderStar(i))}
        {isRating && <span className="ml-2 text-xs text-gray-400">Saving...</span>}
      </div>

      {/* DELIVERY + STOCK + PRICE */}
      <div className="flex justify-between text-sm items-center mb-3">
        <span className="text-blue-400">
          🚚 {product.delivery_time}{" "}
          {product.delivery_time === 1 ? "day" : "days"}
        </span>

        <span className="text-green-400 font-medium">
          📦 Stock: {product.stock}
        </span>

        <span className="text-indigo-400 text-lg font-semibold">
          ₹{product.price}
        </span>
      </div>

      {/* ADD TO CART BUTTON */}
      <button
        onClick={handleAdd}
        className="w-full mt-auto bg-gradient-to-r from-purple-600 to-blue-700 px-3 py-2 rounded-xl text-sm hover:brightness-110 transition-all shadow-lg"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
