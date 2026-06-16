export const imageFragment = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const moneyFragment = /* GraphQL */ `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

export const productVariantFragment = /* GraphQL */ `
  fragment ProductVariantFields on ProductVariant {
    id
    title
    availableForSale
    sku
    quantityAvailable
    selectedOptions {
      name
      value
    }
    price {
      ...MoneyFields
    }
    compareAtPrice {
      ...MoneyFields
    }
    image {
      ...ImageFields
    }
  }
  ${moneyFragment}
  ${imageFragment}
`;

export const productCardFragment = /* GraphQL */ `
  fragment ProductCardFields on Product {
    id
    handle
    title
    vendor
    availableForSale
    tags
    featuredImage {
      ...ImageFields
    }
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
    ratingMetafield: metafield(namespace: "reviews", key: "rating") {
      value
    }
    ratingCountMetafield: metafield(namespace: "reviews", key: "rating_count") {
      value
    }
    siblingOptionMetafield: metafield(namespace: "stiletto", key: "sibling_option_name") {
      value
    }
    siblingCollectionMetafield: metafield(namespace: "stiletto", key: "sibling_collection") {
      reference {
        ... on Collection {
          products(first: 12) {
            nodes {
              id
              handle
              title
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
    siblingsCollectionMetafield: metafield(namespace: "stiletto", key: "siblings_collection") {
      reference {
        ... on Collection {
          products(first: 12) {
            nodes {
              id
              handle
              title
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
  }
  ${moneyFragment}
  ${imageFragment}
`;

export const productFragment = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    vendor
    description
    descriptionHtml
    availableForSale
    tags
    options {
      name
      values
    }
    featuredImage {
      ...ImageFields
    }
    images(first: 20) {
      nodes {
        ...ImageFields
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
    variants(first: 100) {
      nodes {
        ...ProductVariantFields
      }
    }
    seo {
      title
      description
    }
    subtitleMetafield: metafield(namespace: "glow", key: "subtitle") {
      value
    }
    siblingOptionMetafield: metafield(namespace: "stiletto", key: "sibling_option_name") {
      value
    }
    siblingCollectionMetafield: metafield(namespace: "stiletto", key: "sibling_collection") {
      reference {
        ... on Collection {
          products(first: 12) {
            nodes {
              id
              handle
              title
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
    siblingsCollectionMetafield: metafield(namespace: "stiletto", key: "siblings_collection") {
      reference {
        ... on Collection {
          products(first: 12) {
            nodes {
              id
              handle
              title
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
    ratingMetafield: metafield(namespace: "reviews", key: "rating") {
      value
    }
    ratingCountMetafield: metafield(namespace: "reviews", key: "rating_count") {
      value
    }
    crossSellMetafield: metafield(namespace: "glow", key: "cross_sell_products") {
      references(first: 8) {
        nodes {
          ... on Product {
            handle
          }
        }
      }
    }
  }
  ${moneyFragment}
  ${imageFragment}
  ${productVariantFragment}
`;

export const collectionFragment = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    image {
      ...ImageFields
    }
    seo {
      title
      description
    }
  }
  ${imageFragment}
`;

export const cartFragment = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFields
      }
      totalAmount {
        ...MoneyFields
      }
      totalTaxAmount {
        ...MoneyFields
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            ...MoneyFields
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            product {
              id
              handle
              title
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
  }
  ${moneyFragment}
  ${imageFragment}
`;

export const menuFragment = /* GraphQL */ `
  fragment MenuFields on Menu {
    items {
      title
      url
      items {
        title
        url
        items {
          title
          url
        }
      }
    }
  }
`;
