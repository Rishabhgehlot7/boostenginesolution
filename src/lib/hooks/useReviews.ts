// hooks/useReviews.ts
import {
  createReview,
  deleteReview,
  editReview,
  fetchReviews,
} from "@/lib/features/reviewSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

export interface IReview {
  id: string;
  user: string;
  username: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const useReviews = () => {
  const dispatch: AppDispatch = useDispatch();
  const reviews = useSelector((state: RootState) => state.review.reviews);
  const loading = useSelector((state: RootState) => state.review.loading);
  const error = useSelector((state: RootState) => state.review.error);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleCreateReview = (review: IReview) => {
    dispatch(createReview(review));
  };

  const handleEditReview = (review: IReview) => {
    dispatch(editReview(review));
  };

  const handleDeleteReview = (id: string) => {
    dispatch(deleteReview(id));
  };

  return {
    reviews,
    loading,
    error,
    fetchReviews: () => dispatch(fetchReviews()),
    createReview: handleCreateReview,
    editReview: handleEditReview,
    deleteReview: handleDeleteReview,
  };
};
