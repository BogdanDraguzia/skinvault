'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addToCart as addAction,
  removeFromCart as removeAction,
  clearCart as clearAction,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from '@/store/slices/cartSlice';
import type { Skin, CartItem } from '@/types';

export function useCart() {
  const dispatch = useAppDispatch();
  const items    = useAppSelector(selectCartItems);
  const count    = useAppSelector(selectCartCount);
  const total    = useAppSelector(selectCartTotal);

  // dispatch is stable — no need to wrap these in useCallback
  const addToCart    = (item: Skin | CartItem) => dispatch(addAction(item));
  const removeFromCart = (id: number) => dispatch(removeAction(id));
  const clearCart    = () => dispatch(clearAction());
  const isInCart     = (id: number) => items.some((i) => i.id === id);

  return { items, count, total, addToCart, removeFromCart, clearCart, isInCart };
}
