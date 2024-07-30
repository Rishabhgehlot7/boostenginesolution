// components/ReviewForm.tsx
import { useReviews } from "@/lib/hooks/useReviews";
import React, { useState } from "react";
import StarRate from "./StarRate";

interface ReviewFormProps {
  user: string;
  product: string;
  username: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ user, product, username }) => {
  const { createReview: dispatchCreateReview } = useReviews();
  const [userInput, setUserInput] = useState({
    user: user,
    product: product,
    username,
    comment: "",
    rating: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.comment || !userInput.rating) {
      alert("Please fill in all fields and select a rating.");
      return;
    }

    await dispatchCreateReview({
      ...userInput,
      rating: userInput.rating as number,
      createdAt: new Date().toISOString(),
      id: "", // Ensure your API or reducer handles ID generation appropriately
      user,
      product,
      username,
    });

    setUserInput({
      user: "",
      username: "",
      product: "",
      comment: "",
      rating: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
      <h2 className=" text-3xl font-bold text-[#FFCC4D]">Create Review</h2>
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          value={userInput.comment}
          onChange={handleInputChange}
          required
          rows={3}
          className=" bg-black text-white mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-[#FFCC4D] focus:border-[#FFCC4D] sm:text-sm rounded-md"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700"
        >
          Rating
        </label>
        <StarRate
          rating={userInput.rating}
          onChange={(rating) => setUserInput({ ...userInput, rating })}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#FFCC4D] hover:bg-[#FFCC4D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCC4D]"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
