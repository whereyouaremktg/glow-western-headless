import { commerceConfig } from "@/lib/config";
import {
  baseFragments,
  cartFragment,
  collectionFragment,
  menuFragment,
  productCardFragment,
  productFragment,
  productVariantFragment,
} from "@/lib/shopify/fragments";

export const getProductByHandleQuery = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${baseFragments}
  ${productVariantFragment}
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
  ${baseFragments}
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
  ${baseFragments}
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
  ${baseFragments}
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
  ${baseFragments}
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
  ${baseFragments}
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
  ${baseFragments}
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
  ${baseFragments}
  ${cartFragment}
`;

export const getFirstProductQuery = /* GraphQL */ `
  query GetFirstProduct {
    products(first: 1, sortKey: BEST_SELLING) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${baseFragments}
  ${productVariantFragment}
  ${productFragment}
`;

export const getProductsByQueryQuery = /* GraphQL */ `
  query GetProductsByQuery($first: Int!, $query: String!) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCardFields
      }
    }
  }
  ${baseFragments}
  ${productCardFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      ...CollectionFields
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...ProductCardFields
        }
      }
    }
  }
  ${baseFragments}
  ${collectionFragment}
  ${productCardFragment}
`;

export const searchStorefrontQuery = /* GraphQL */ `
  query SearchStorefront($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT, COLLECTION]) {
      nodes {
        ... on Product {
          ...ProductCardFields
        }
        ... on Collection {
          id
          handle
          title
        }
      }
    }
  }
  ${baseFragments}
  ${productCardFragment}
`;

export const getPageByHandleQuery = /* GraphQL */ `
  query GetPageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      handle
      title
      body
      bodySummary
      seo {
        title
        description
      }
    }
  }
`;

export const SHOPIFY_API_VERSION = commerceConfig.shopifyApiVersion;
