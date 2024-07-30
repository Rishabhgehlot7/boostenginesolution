import { Star } from 'lucide-react'; // Assuming you have a star icon library
import React, { useState } from 'react';

interface StarRateProps {
  rating: number | null;
  onChange: (rating: number) => void;
}

const StarRate: React.FC<StarRateProps> = ({ rating, onChange }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRatingChange = (value: number) => {
    onChange(value);
  };

  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((star, index) => {
        const currentRate = index + 1;
        return (
          <label key={index} htmlFor={`star-${currentRate}`}>
            <input
              id={`star-${currentRate}`}
              type="radio"
              name="rate"
              value={currentRate}
              onChange={() => handleRatingChange(currentRate)}
              className="sr-only"
            />
            <Star
              className="cursor-pointer"
              color={currentRate <= (hoverRating || rating || 0) ? "yellow" : "gray"}
              size={20}
              onMouseEnter={() => handleMouseEnter(currentRate)}
              onMouseLeave={handleMouseLeave}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRate;
