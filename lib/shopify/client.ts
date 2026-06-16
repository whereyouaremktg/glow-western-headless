import { commerceConfig } from "@/lib/config";
import { SHOPIFY_API_VERSION } from "@/lib/shopify/queries";

export class ShopifyStorefrontError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ShopifyStorefrontError";
  }
}

interface ShopifyGraphQLError {
  message: string;
  extensions?: Record<string, unknown>;
}

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: ShopifyGraphQLError[];
}

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new ShopifyStorefrontError(
      "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN. Copy .env.example to .env.local and add credentials.",
    );
  }

  const normalizedDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return {
    endpoint: `https://${normalizedDomain}/api/${commerceConfig.shopifyApiVersion}/graphql.json`,
    token,
  };
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  const { endpoint, token } = getShopifyConfig();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  });

  if (!response.ok) {
    throw new ShopifyStorefrontError(`Shopify HTTP ${response.status}: ${response.statusText}`);
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new ShopifyStorefrontError(
      json.errors.map((e) => e.message).join("; "),
      json.errors,
    );
  }

  if (!json.data) {
    throw new ShopifyStorefrontError("Shopify returned no data", json);
  }

  return json.data;
}

export function isShopifyConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}

export { SHOPIFY_API_VERSION };
