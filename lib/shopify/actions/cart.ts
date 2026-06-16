"use server";

import { revalidatePath } from "next/cache";

import {
  clearCartIdCookie,
  getCartIdFromCookies,
  setCartIdCookie,
} from "@/lib/cart/cookies";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCartLines,
} from "@/lib/shopify";
import type { Cart } from "@/types";

async function ensureCart(): Promise<{ cartId: string; cart: Cart }> {
  const cartId = await getCartIdFromCookies();
  if (cartId) {
    const existing = await getCart(cartId);
    if (existing) return { cartId, cart: existing };
  }
  const cart = await createCart();
  await setCartIdCookie(cart.id);
  return { cartId: cart.id, cart };
}

export async function fetchCartAction(): Promise<Cart | null> {
  const cartId = await getCartIdFromCookies();
  if (!cartId) return null;
  return getCart(cartId);
}

export async function addToCartAction(
  merchandiseId: string,
  quantity: number,
): Promise<{ cart: Cart | null; error?: string }> {
  try {
    const { cartId, cart } = await ensureCart();
    const updated =
      cart.lines.length === 0 && cart.totalQuantity === 0
        ? await addToCart(cartId, [{ merchandiseId, quantity }])
        : await addToCart(cartId, [{ merchandiseId, quantity }]);
    revalidatePath("/", "layout");
    return { cart: updated };
  } catch (err) {
    return { cart: null, error: err instanceof Error ? err.message : "Add to cart failed" };
  }
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<{ cart: Cart | null; error?: string }> {
  try {
    const cartId = await getCartIdFromCookies();
    if (!cartId) return { cart: null, error: "No cart" };
    const updated = await updateCartLines(cartId, [{ id: lineId, quantity }]);
    revalidatePath("/", "layout");
    return { cart: updated };
  } catch (err) {
    return { cart: null, error: err instanceof Error ? err.message : "Update failed" };
  }
}

export async function removeCartLineAction(
  lineId: string,
): Promise<{ cart: Cart | null; error?: string }> {
  try {
    const cartId = await getCartIdFromCookies();
    if (!cartId) return { cart: null, error: "No cart" };
    const updated = await removeFromCart(cartId, [lineId]);
    revalidatePath("/", "layout");
    return { cart: updated };
  } catch (err) {
    return { cart: null, error: err instanceof Error ? err.message : "Remove failed" };
  }
}

export async function clearCartAction(): Promise<void> {
  await clearCartIdCookie();
  revalidatePath("/", "layout");
}
