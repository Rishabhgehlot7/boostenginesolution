// store/orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "../store";

export interface IOrderProduct {
  product: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  id: string;
  user: string;
  products: IOrderProduct[];
  status: "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  paymentMethod: "Online" | "COD";
  createdAt: string;
}

export interface OrderState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<IOrder[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<IOrder>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<IOrder>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
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
  setOrders,
  addOrder,
  updateOrder,
  removeOrder,
  setLoading,
  setError,
} = orderSlice.actions;
export default orderSlice.reducer;

// Async actions
export const fetchOrders = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/order/orders"); // Adjust API endpoint as needed
    dispatch(setOrders(response.data));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createOrder = (order: IOrder) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/order/createOrder", order);
    dispatch(addOrder(response.data));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const editOrder = (order: IOrder) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`/api/orders/${order.id}`, order);
    dispatch(updateOrder(response.data));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteOrder = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`/api/order/deleteOrder/${id}`);
    dispatch(removeOrder(id));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
