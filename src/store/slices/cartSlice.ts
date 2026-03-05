import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Skin } from '@/types';

interface CartState {
  items: CartItem[];
}

const CART_KEY = 'skinvault_cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function skinToCartItem(skin: Skin): CartItem {
  return {
    id: skin.id,
    assetId: skin.assetId,
    title: skin.title,
    price: skin.price,
    imageUrl: skin.imageUrl,
    type: skin.type,
    exterior: skin.exterior,
    quality: skin.quality,
  };
}

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Skin | CartItem>) {
      const item = 'assetId' in action.payload
        ? skinToCartItem(action.payload as Skin)
        : action.payload as CartItem;
      const exists = state.items.some((i) => i.id === item.id);
      if (!exists) {
        state.items.push(item);
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.length;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price, 0);
export const selectIsInCart = (id: number) => (state: { cart: CartState }) =>
  state.cart.items.some((i) => i.id === id);
