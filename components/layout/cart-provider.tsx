"use client";
// Cart drawer + optimistic line updates require client state synced with server actions.

import {
  createContext,
  useCallback,
  useContext,
  useOptimistic,
  useState,
  type ReactNode,
} from "react";

import {
  addToCartAction,
  fetchCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/lib/shopify/actions/cart";
import type { Cart } from "@/types";

interface CartContextValue {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (merchandiseId: string, quantity: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: Cart | null;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [optimisticCart, setOptimisticCart] = useOptimistic(cart);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const refreshCart = useCallback(async () => {
    const fresh = await fetchCartAction();
    setCart(fresh);
  }, []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity: number) => {
      setIsPending(true);
      try {
        const result = await addToCartAction(merchandiseId, quantity);
        if (result.cart) {
          setCart(result.cart);
          setIsOpen(true);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    setIsPending(true);
    setOptimisticCart({
      ...cart,
      lines: cart.lines.map((line) =>
        line.id === lineId ? { ...line, quantity } : line,
      ),
    });
    try {
      const result = await updateCartLineAction(lineId, quantity);
      if (result.cart) setCart(result.cart);
    } finally {
      setIsPending(false);
    }
  }, [cart, setOptimisticCart]);

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsPending(true);
      setOptimisticCart({
        ...cart,
        lines: cart.lines.filter((line) => line.id !== lineId),
        totalQuantity: cart.totalQuantity - (cart.lines.find((l) => l.id === lineId)?.quantity ?? 0),
      });
      try {
        const result = await removeCartLineAction(lineId);
        if (result.cart) setCart(result.cart);
      } finally {
        setIsPending(false);
      }
    },
    [cart, setOptimisticCart],
  );

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        isOpen,
        isPending,
        openCart,
        closeCart,
        addItem,
        updateLine,
        removeLine,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
