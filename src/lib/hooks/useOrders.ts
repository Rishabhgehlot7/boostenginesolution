// hooks/useOrders.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  deleteOrder,
  editOrder,
  fetchOrders,
  IOrder,
} from "../features/orderSlice";
import { AppDispatch, RootState } from "../store";

export const useOrders = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders1 = useSelector((state: RootState) => state.order.orders);
  const loading = useSelector((state: RootState) => state.order.loading);
  const error = useSelector((state: RootState) => state.order.error);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return {
    orders1,
    loading,
    error,
    fetchOrders: () => dispatch(fetchOrders()),
    createOrder: (order: IOrder) => dispatch(createOrder(order)),
    editOrder: (order: IOrder) => dispatch(editOrder(order)),
    deleteOrder: (id: string) => dispatch(deleteOrder(id)),
  };
};
