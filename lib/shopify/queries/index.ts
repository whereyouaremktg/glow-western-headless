import { commerceConfig } from "@/lib/config";
import {
  cartFragment,
  collectionFragment,
  menuFragment,
  productCardFragment,
  productFragment,
} from "@/lib/shopify/fragments";

export const getProductByHandleQuery = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCardFields
      }
    }
  }
  ${productCardFragment}
`;

export const getCollectionByHandleQuery = /* GraphQL */ `
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      ...CollectionFields
      products(first: $first) {
        nodes {
          ...ProductCardFields
        }
      }
    }
  }
  ${collectionFragment}
  ${productCardFragment}
`;

export const getMenuQuery = /* GraphQL */ `
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      ...MenuFields
    }
  }
  ${menuFragment}
`;

export const getCartQuery = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${cartFragment}
`;

export const cartCreateMutation = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesAddMutation = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesUpdateMutation = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const cartLinesRemoveMutation = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

/** Verification query — fetches first available product for Phase 2 smoke test */
export const getFirstProductQuery = /* GraphQL */ `
  query GetFirstProduct {
    products(first: 1, sortKey: BEST_SELLING) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${productFragment}
`;

export const SHOPIFY_API_VERSION = commerceConfig.shopifyApiVersion;
