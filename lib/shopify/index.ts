import { shopifyFetch } from "@/lib/shopify/client";
import {
  isExcludedProduct,
  mapCart,
  mapCollection,
  mapMenu,
  mapProduct,
  mapProductCard,
} from "@/lib/shopify/mappers";
import {
  cartCreateMutation,
  cartLinesAddMutation,
  cartLinesRemoveMutation,
  cartLinesUpdateMutation,
  getCartQuery,
  getCollectionByHandleQuery,
  getFirstProductQuery,
  getMenuQuery,
  getProductByHandleQuery,
  getProductsQuery,
} from "@/lib/shopify/queries";
import type { Cart, CollectionWithProducts, Menu, Product } from "@/types";

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: Parameters<typeof mapProduct>[0] | null }>({
    query: getProductByHandleQuery,
    variables: { handle },
    tags: [`product-${handle}`],
  });

  if (!data.product) return null;
  return mapProduct(data.product);
}

export async function getProducts(options?: {
  first?: number;
  query?: string;
}): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: Parameters<typeof mapProductCard>[0][] } }>({
    query: getProductsQuery,
    variables: { first: options?.first ?? 12, query: options?.query },
    tags: ["products"],
  });

  return data.products.nodes
    .filter((p) => !isExcludedProduct(p.handle))
    .map(mapProductCard);
}

export async function getCollection(
  handle: string,
  options?: { first?: number },
): Promise<CollectionWithProducts | null> {
  const data = await shopifyFetch<{
    collection: (Parameters<typeof mapCollection>[0] & {
      products: { nodes: Parameters<typeof mapProductCard>[0][] };
    }) | null;
  }>({
    query: getCollectionByHandleQuery,
    variables: { handle, first: options?.first ?? 24 },
    tags: [`collection-${handle}`],
  });

  if (!data.collection) return null;

  const { products, ...rest } = data.collection;
  return {
    ...mapCollection(rest),
    products: products.nodes
      .filter((p) => !isExcludedProduct(p.handle))
      .map(mapProductCard),
  };
}

export async function getMenu(handle: string): Promise<Menu | null> {
  const data = await shopifyFetch<{ menu: Parameters<typeof mapMenu>[0] | null }>({
    query: getMenuQuery,
    variables: { handle },
    tags: [`menu-${handle}`],
  });

  if (!data.menu) return null;
  return mapMenu(data.menu);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Parameters<typeof mapCart>[0] | null }>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });

  if (!data.cart) return null;
  return mapCart(data.cart);
}

export async function createCart(lines?: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: Parameters<typeof mapCart>[0] | null;
      userErrors: { field: string[] | null; message: string }[];
    };
  }>({
    query: cartCreateMutation,
    variables: { lines: lines ?? [] },
    cache: "no-store",
  });

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; "));
  }
  if (!data.cartCreate.cart) throw new Error("Cart creation failed");
  return mapCart(data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: Parameters<typeof mapCart>[0] | null;
      userErrors: { message: string }[];
    };
  }>({
    query: cartLinesAddMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join("; "));
  }
  if (!data.cartLinesAdd.cart) throw new Error("Add to cart failed");
  return mapCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: Parameters<typeof mapCart>[0] | null;
      userErrors: { message: string }[];
    };
  }>({
    query: cartLinesUpdateMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join("; "));
  }
  if (!data.cartLinesUpdate.cart) throw new Error("Cart update failed");
  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: Parameters<typeof mapCart>[0] | null;
      userErrors: { message: string }[];
    };
  }>({
    query: cartLinesRemoveMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join("; "));
  }
  if (!data.cartLinesRemove.cart) throw new Error("Cart remove failed");
  return mapCart(data.cartLinesRemove.cart);
}

/** Phase 2 verification — returns first bestseller or null */
export async function verifyStorefrontConnection(): Promise<{
  ok: boolean;
  product: Product | null;
  error?: string;
}> {
  try {
    const data = await shopifyFetch<{
      products: { nodes: Parameters<typeof mapProduct>[0][] };
    }>({
      query: getFirstProductQuery,
      cache: "no-store",
    });

    const raw = data.products.nodes[0];
    if (!raw) return { ok: true, product: null, error: "Store connected but no products returned" };

    return { ok: true, product: mapProduct(raw) };
  } catch (err) {
    return {
      ok: false,
      product: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export { isShopifyConfigured } from "@/lib/shopify/client";
