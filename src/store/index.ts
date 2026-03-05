import { configureStore } from '@reduxjs/toolkit';
import { skinvaultApi } from './api/skinvaultApi';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [skinvaultApi.reducerPath]: skinvaultApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(skinvaultApi.middleware)
      .concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
