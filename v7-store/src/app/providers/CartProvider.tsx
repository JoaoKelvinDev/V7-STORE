'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CartState } from '@/types';
import { CART_STORAGE_KEY, CART_VERSION, parseCartVersion } from '@/utils/helpers';
import { products } from '@/data/catalog';

type CartAction =
  | { type: 'ADD_ITEM'; payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, variantId, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        item => item.productId === productId && item.variantId === variantId
      );

      const product = products.find(p => p.id === productId);
      const variant = product?.variants.find(v => v.id === variantId);

      if (!product?.active || !variant || variant.availability === 'unavailable' || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return state;
      }

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: Math.min(99, newItems[existingIndex].quantity + quantity),
        };
        return { ...state, items: newItems };
      }

      return { ...state, items: [...state.items, { productId, variantId, quantity }] };
    }

    case 'REMOVE_ITEM': {
      const { productId, variantId } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === productId && item.variantId === variantId)
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return state;

      const product = products.find(p => p.id === productId);
      const variant = product?.variants.find(v => v.id === variantId);

      if (!product?.active || !variant || variant.availability === 'unavailable') {
        return state;
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, variantId: string) => number;
  getTotalItems: () => number;
  getSubtotalCents: () => number | null;
  hasUnavailableItems: () => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartState {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) return parseCartVersion(JSON.parse(stored)) ?? { items: [], version: CART_VERSION };
  } catch {
    // Storage can be unavailable or contain an invalid value. Keep the cart usable.
  }
  return { items: [], version: CART_VERSION };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Shopping still works when the browser blocks persistent storage.
    }
  }, [state]);

  const addItem = (productId: string, variantId: string, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId, variantId, quantity } });
  };

  const removeItem = (productId: string, variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId: string, variantId: string) => {
    const item = state.items.find(
      item => item.productId === productId && item.variantId === variantId
    );
    return item?.quantity ?? 0;
  };

  const getTotalItems = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotalCents = () => {
    let hasNullPrice = false;
    let total = 0;

    for (const item of state.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;

      if (product.priceCents === null) {
        hasNullPrice = true;
      } else {
        total += product.priceCents * item.quantity;
      }
    }

    return hasNullPrice ? null : total;
  };

  const hasUnavailableItems = () => {
    return state.items.some(item => {
      const product = products.find(p => p.id === item.productId);
      const variant = product?.variants.find(v => v.id === item.variantId);
      return !product?.active || !variant || variant.availability === 'unavailable';
    });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        getTotalItems,
        getSubtotalCents,
        hasUnavailableItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
