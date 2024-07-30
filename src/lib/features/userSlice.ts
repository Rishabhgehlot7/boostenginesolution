// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CartProduct {
  _id: any;
  product: string;
  quantity: number;
  size: string;
  color: string;
  price: string;
}

export interface UserState {
  username: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "customer" | "admin" | "employee";
  address?: Address;
  cart: CartProduct[];
  orders: string[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  createdAt: Date;
}

const initialState: {
  user: UserState | null;
  loading: boolean;
  error: string | null;
} = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
