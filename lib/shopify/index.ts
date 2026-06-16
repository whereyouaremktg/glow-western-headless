import { shopifyFetch } from "@/lib/shopify/client";
import {
  buildProductFilters,
  handlesToProductQuery,
  parseCollectionSort,
} from "@/lib/shopify/collection-utils";
import {
  isExcludedProduct,
  mapCart,
  mapCollection,
  mapMenu,
  mapPage,
  mapPaginatedCollection,
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
  getCollectionProductsQuery,
  getFirstProductQuery,
  getMenuQuery,
  getPageByHandleQuery,
  getProductByHandleQuery,
  getProductsByQueryQuery,
  getProductsQuery,
  searchStorefrontQuery,
} from "@/lib/shopify/queries";
import type {
  Cart,
  CollectionWithProducts,
  PaginatedCollection,
  Menu,
  Product,
  ShopifyPage,
} from "@/types";

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

export async function getCollectionProducts(
  handle: string,
  options?: {
    first?: number;
    after?: string;
    sort?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
    filterInputs?: string[];
  },
): Promise<PaginatedCollection | null> {
  const { sortKey, reverse } = parseCollectionSort(options?.sort);
  const filters = buildProductFilters({
    availability: options?.availability,
    minPrice: options?.minPrice,
    maxPrice: options?.maxPrice,
    filterInputs: options?.filterInputs,
  });

  const data = await shopifyFetch<{
    collection: Parameters<typeof mapPaginatedCollection>[0] | null;
  }>({
    query: getCollectionProductsQuery,
    variables: {
      handle,
      first: options?.first ?? 24,
      after: options?.after ?? null,
      sortKey,
      reverse,
      filters: filters.length ? filters : null,
    },
    tags: [`collection-${handle}`],
  });

  if (!data.collection) return null;
  return mapPaginatedCollection(data.collection);
}

export async function searchStorefront(query: string, first = 6): Promise<{
  products: Product[];
  collections: { handle: string; title: string }[];
}> {
  const data = await shopifyFetch<{
    search: {
      nodes: (
        | Parameters<typeof mapProductCard>[0]
        | { id: string; handle: string; title: string }
      )[];
    };
  }>({
    query: searchStorefrontQuery,
    variables: { query, first },
    cache: "no-store",
  });

  const products: Product[] = [];
  const collections: { handle: string; title: string }[] = [];

  for (const node of data.search.nodes) {
    if ("priceRange" in node) {
      if (!isExcludedProduct(node.handle)) products.push(mapProductCard(node));
    } else if ("handle" in node && "title" in node) {
      collections.push({ handle: node.handle, title: node.title });
    }
  }

  return { products, collections };
}

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  if (!handles.length) return [];
  const data = await shopifyFetch<{ products: { nodes: Parameters<typeof mapProductCard>[0][] } }>({
    query: getProductsByQueryQuery,
    variables: { first: handles.length, query: handlesToProductQuery(handles) },
    tags: ["products"],
  });

  return data.products.nodes
    .filter((p) => !isExcludedProduct(p.handle))
    .map(mapProductCard);
}

export async function getPage(handle: string): Promise<ShopifyPage | null> {
  const data = await shopifyFetch<{ page: Parameters<typeof mapPage>[0] | null }>({
    query: getPageByHandleQuery,
    variables: { handle },
    tags: [`page-${handle}`],
  });

  if (!data.page) return null;
  return mapPage(data.page);
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
