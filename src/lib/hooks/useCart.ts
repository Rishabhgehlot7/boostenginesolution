// hooks/useCart.ts
import { useDispatch, useSelector } from "react-redux";
import {
    addToCart,
    CartProduct,
    removeFromCart,
    setCart,
    setError,
    setLoading,
} from "../features/cartSlice";
import { AppDispatch, RootState } from "../store";

export const useCart = () => {
  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  const updateCart = (cart: CartProduct[]) => dispatch(setCart(cart));
  const addItemToCart = (item: CartProduct) => dispatch(addToCart(item));
  const removeItemFromCart = (id: any) => dispatch(removeFromCart(id));
  const setLoadingState = (loading: boolean) => dispatch(setLoading(loading));
  const setErrorState = (error: string | null) => dispatch(setError(error));

  return {
    cart,
    loading,
    error,
    updateCart,
    addItemToCart,
    removeItemFromCart,
    setLoadingState,
    setErrorState,
  };
};
