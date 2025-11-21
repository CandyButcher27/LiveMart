import { Star, StarHalf, StarOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProductRatingProps } from '../../types/products';

export const StarRating: React.FC<ProductRatingProps> = ({
  productId,
  currentRating,
  onRatingChange,
  size = 'md',
  readOnly = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (rating: number) => {
    if (!readOnly) {
      onRatingChange(productId, rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHoverRating(rating);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const renderStar = (index: number) => {
    const ratingValue = index + 1;
    const displayRating = isHovering ? hoverRating : currentRating;
    
    if (ratingValue <= Math.floor(displayRating)) {
      return (
        <Star
          key={index}
          className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
          onClick={() => handleClick(ratingValue)}
          onMouseEnter={() => handleMouseEnter(ratingValue)}
          onMouseLeave={handleMouseLeave}
        />
      );
    }
    
    if (ratingValue - 0.5 <= displayRating && displayRating < ratingValue) {
      return (
        <StarHalf
          key={index}
          className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
          onClick={() => handleClick(ratingValue)}
          onMouseEnter={() => handleMouseEnter(ratingValue)}
          onMouseLeave={handleMouseLeave}
        />
      );
    }
    
    return (
      <Star
        key={index}
        className={`${sizeClasses[size]} text-gray-300`}
        onClick={() => handleClick(ratingValue)}
        onMouseEnter={() => handleMouseEnter(ratingValue)}
        onMouseLeave={handleMouseLeave}
      />
    );
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      </div>
    </div>
  );
};

export default StarRating;
