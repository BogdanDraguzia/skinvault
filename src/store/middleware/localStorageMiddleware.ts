import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';

const CART_KEY = 'skinvault_cart';

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState() as RootState;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(state.cart.items));
      } catch {
        // Storage full or unavailable — fail silently
      }
    }
    return result;
  };
