import { Star } from "lucide-react"; // Assuming you have a star icon library
import React, { useState } from "react";

interface StarRateProps {
  rating: number | null;
  onChange: (rating: number) => void;
}

const StarRate: React.FC<StarRateProps> = ({ rating, onChange }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const averageRating = Math.floor(Number(rating)!) || 4;
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
      {[...Array(averageRating)].map((star, index) => {
        const currentRate = index + 1;
        return (
          <label key={index} htmlFor={`star-${currentRate}`}>
            {/* <input
              id={`star-${currentRate}`}
              type="radio"
              name="rate"
              value={currentRate}
              onChange={() => handleRatingChange(currentRate)}
              className="sr-only"
            /> */}
            <Star
              className="cursor-pointer fill-[#FFCC4D]"
              color={"#FFCC4D"}
              size={20}
              // onMouseEnter={() => handleMouseEnter(currentRate)}
              // onMouseLeave={handleMouseLeave}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRate;
