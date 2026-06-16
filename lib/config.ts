/** Commerce and merchandising configuration — no secrets. */

export const commerceConfig = {
  /** Free-shipping threshold in USD (matches old theme) */
  freeShippingThreshold: 50,

  /** Product handles excluded from search/collection listings */
  excludedProductHandles: ["package-protection"] as const,

  /** Theme badge tag groups → display priority (first match wins) */
  badgeTagGroups: [
    { tag: "best-seller", label: "Best Seller" },
    { tag: "limited-edition", label: "Limited Edition" },
    { tag: "new", label: "New" },
  ] as const,

  /** Option names rendered as color swatches on PDP/cards */
  swatchOptionNames: ["Color", "Colour"] as const,

  /** Option names rendered as chips */
  chipOptionNames: ["Size"] as const,

  /** Default cross-sell collection handle when product metafield is empty */
  defaultCrossSellCollectionHandle: "the-detangling-brush",

  /** Predictive search */
  predictiveSearch: {
    maxResults: 6,
    suggestedHeading: "See Our Most Popular Brushes",
  },

  /** Storefront API version — pinned per CLAUDE.md */
  shopifyApiVersion: "2025-04" as const,
} as const;

export type BadgeTagGroup = (typeof commerceConfig.badgeTagGroups)[number];
