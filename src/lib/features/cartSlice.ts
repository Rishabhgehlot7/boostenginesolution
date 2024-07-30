// store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartProduct {
  _id: any;
  product: string;
  quantity: number;
  size: string;
  color: string;
  price: string;
}

const initialState: { cart: CartProduct[], loading: boolean, error: string | null } = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartProduct[]>) => {
      state.cart = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<any>) => {
      state.cart = state.cart.filter(item => item._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCart, addToCart, removeFromCart, setLoading, setError } = cartSlice.actions;
export default cartSlice.reducer;
