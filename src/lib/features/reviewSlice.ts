// store/reviewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "../store";

interface IReview {
  id: string;
  user: string;
  username: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewState {
  reviews: IReview[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<IReview[]>) => {
      state.reviews = action.payload;
    },
    addReview: (state, action: PayloadAction<IReview>) => {
      state.reviews.push(action.payload);
    },
    updateReview: (state, action: PayloadAction<IReview>) => {
      const index = state.reviews.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
    },
    removeReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter((r) => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setReviews,
  addReview,
  updateReview,
  removeReview,
  setLoading,
  setError,
} = reviewSlice.actions;
export default reviewSlice.reducer;

// Async actions
export const fetchReviews = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/review/getReviews");
    dispatch(setReviews(response.data));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createReview =
  (review: IReview) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post("/api/review/createReview", review);
      dispatch(addReview(response.data));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const editReview =
  (review: IReview) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(
        `/api/review/updateReview/${review.id}`,
        review
      );
      dispatch(updateReview(response.data));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteReview = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.post(`/api/review/deleteReview`, { id });
    dispatch(removeReview(id));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
