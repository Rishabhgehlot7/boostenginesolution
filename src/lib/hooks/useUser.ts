import { useDispatch, useSelector, useStore } from 'react-redux';
import {
  setError,
  setLoading,
  setUser,
  UserState,
} from "../features/userSlice";
import type { AppDispatch, AppStore, RootState } from '../store';

export const useUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const updateUser = (user: UserState | null) => dispatch(setUser(user));
  const setLoadingState = (loading: boolean) => dispatch(setLoading(loading));
  const setErrorState = (error: string | null) => dispatch(setError(error));

  return { user, loading, error, updateUser, setLoadingState, setErrorState };
};

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()