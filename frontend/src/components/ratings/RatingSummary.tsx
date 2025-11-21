import { Star, StarHalf } from 'lucide-react';
import { RatingSummaryProps } from '../../types/products';

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  productId,
  averageRating,
  totalRatings,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const renderStar = (index: number) => {
    const ratingValue = index + 1;
    
    if (ratingValue <= Math.floor(averageRating)) {
      return (
        <Star
          key={index}
          className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
        />
      );
    }
    
    if (ratingValue - 0.5 <= averageRating && averageRating < ratingValue) {
      return (
        <StarHalf
          key={index}
          className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
        />
      );
    }
    
    return (
      <Star
        key={index}
        className={`${sizeClasses[size]} text-gray-300`}
      />
    );
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      </div>
      {totalRatings > 0 && (
        <span className="text-xs text-gray-400 ml-1">
          ({averageRating.toFixed(1)}, {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
};

export default RatingSummary;
