"use client";
import { useReviews } from "@/lib/hooks/useReviews";
import axios from "axios";
import { Verified } from "lucide-react"; // Adjust import based on your actual icon library
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import StarRateForProduct from "./StarRateForProduct"; // Ensure this path is correct

interface Review {
  id: string;
  comment: string;
  rating: number;
  username: string;
  createdAt: string;
}

interface ReviewListProps {
  productId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const { createReview: dispatchCreateReview, reviews } = useReviews();
  const [reviewsS, setReviews] = useState<Review[]>([]);
  const [visibleReviews, setVisibleReviews] = useState(4);

  const fetchReviews = async () => {
    try {
      const response = await axios.post("/api/review/getReviewsByProduct", {
        productId,
      });
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, reviews]);

  const handleShowMore = () => {
    setVisibleReviews((prev) => prev + 4);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-7xl mx-auto mt-8">
      {reviewsS.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <>
          {Array.isArray(reviewsS) &&
            reviewsS
              .slice(0, visibleReviews)
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  comment={review.comment}
                  rating={review.rating}
                  username={review.username}
                  date={review.createdAt}
                />
              ))}
          {visibleReviews < reviewsS.length && (
            <div className="w-full flex justify-center items-center md:col-span-2">
              <Button onClick={handleShowMore}>Show More</Button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

interface ReviewCardProps {
  comment: string;
  rating: number;
  date: string;
  username: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  username,
  comment,
  rating,
  date,
}) => {
  return (
    <div className="bg-black border p-5 rounded-xl flex flex-col gap-5 shadow-sm">
      <div>
        <StarRateForProduct rating={rating} onChange={() => {}} />
        <div className="flex items-center py-2">
          <h3>{username}</h3>
          <Verified color="green" size={20} />
        </div>
        <p className="text-sm">{comment}</p>
      </div>
      <div>Posted on {formatDate(date)}</div>
    </div>
  );
};

export default ReviewList;
