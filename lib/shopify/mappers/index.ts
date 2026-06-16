import { commerceConfig } from "@/lib/config";
import type {
  Cart,
  CartLine,
  Collection,
  FilterValue,
  Menu,
  MenuItem,
  Money,
  PaginatedCollection,
  Product,
  ProductFilterGroup,
  ProductVariant,
  ShopifyImage,
  ShopifyPage,
  SiblingProduct,
} from "@/types";

// ---- Raw Storefront API shapes (internal to lib/shopify only) ----

interface RawImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface RawMoney {
  amount: string;
  currencyCode: string;
}

interface RawProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string | null;
  quantityAvailable: number | null;
  selectedOptions: { name: string; value: string }[];
  price: RawMoney;
  compareAtPrice: RawMoney | null;
  image: RawImage | null;
}

interface RawSiblingProduct {
  id: string;
  handle: string;
  title: string;
  featuredImage: RawImage | null;
}

interface RawProductBase {
  id: string;
  handle: string;
  title: string;
  vendor?: string;
  description?: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  tags: string[];
  options?: { name: string; values: string[] }[];
  featuredImage: RawImage | null;
  images?: { nodes: RawImage[] };
  priceRange: {
    minVariantPrice: RawMoney;
    maxVariantPrice: RawMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: RawMoney;
    maxVariantPrice: RawMoney;
  };
  variants?: { nodes: RawProductVariant[] };
  seo?: { title: string | null; description: string | null };
  subtitleMetafield?: { value: string } | null;
  siblingOptionMetafield?: { value: string } | null;
  siblingCollectionMetafield?: {
    reference?: { products?: { nodes: RawSiblingProduct[] } } | null;
  } | null;
  siblingsCollectionMetafield?: {
    reference?: { products?: { nodes: RawSiblingProduct[] } } | null;
  } | null;
  ratingMetafield?: { value: string } | null;
  ratingCountMetafield?: { value: string } | null;
  crossSellMetafield?: {
    references?: { nodes: { handle: string }[] } | null;
  } | null;
}

function mapImage(image: RawImage | null | undefined): ShopifyImage | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText,
    width: image.width,
    height: image.height,
  };
}

function mapMoney(money: RawMoney): Money {
  return { amount: money.amount, currencyCode: money.currencyCode };
}

function parseRating(
  ratingMetafield: { value: string } | null | undefined,
  countMetafield: { value: string } | null | undefined,
): { value: number; count: number } | null {
  if (!ratingMetafield?.value || !countMetafield?.value) return null;
  try {
    const parsed = JSON.parse(ratingMetafield.value) as { value?: string; scale_max?: string };
    const value = parseFloat(parsed.value ?? ratingMetafield.value);
    const count = parseInt(countMetafield.value, 10);
    if (Number.isNaN(value) || Number.isNaN(count) || count <= 0) return null;
    const scaleMax = parseFloat(parsed.scale_max ?? "5");
    const normalized = scaleMax > 0 ? (value / scaleMax) * 5 : value;
    return { value: normalized, count };
  } catch {
    const value = parseFloat(ratingMetafield.value);
    const count = parseInt(countMetafield.value, 10);
    if (Number.isNaN(value) || Number.isNaN(count) || count <= 0) return null;
    return { value, count };
  }
}

function mapSiblings(raw: RawProductBase): SiblingProduct[] | null {
  const optionLabel = raw.siblingOptionMetafield?.value ?? "Color";
  const collectionRef =
    raw.siblingCollectionMetafield?.reference?.products?.nodes ??
    raw.siblingsCollectionMetafield?.reference?.products?.nodes;

  if (!collectionRef?.length) return null;

  return collectionRef
    .filter((p) => p.handle !== raw.handle)
    .map((p) => ({
      handle: p.handle,
      title: p.title,
      optionLabel,
      swatch: mapImage(p.featuredImage) ?? optionLabel,
    }));
}

function mapVariant(variant: RawProductVariant): ProductVariant {
  return {
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    selectedOptions: variant.selectedOptions,
    price: mapMoney(variant.price),
    compareAtPrice: variant.compareAtPrice ? mapMoney(variant.compareAtPrice) : null,
    image: mapImage(variant.image),
    sku: variant.sku,
    quantityAvailable: variant.quantityAvailable,
  };
}

export function mapProduct(raw: RawProductBase): Product {
  const crossSellHandles =
    raw.crossSellMetafield?.references?.nodes?.map((n) => n.handle).filter(Boolean) ?? [];

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    vendor: raw.vendor ?? "Glow Beauty Hair",
    description: raw.description ?? "",
    descriptionHtml: raw.descriptionHtml ?? "",
    options: raw.options ?? [],
    variants: (raw.variants?.nodes ?? []).map(mapVariant),
    featuredImage: mapImage(raw.featuredImage),
    images: (raw.images?.nodes ?? []).map((img) => mapImage(img)!),
    priceRange: {
      minVariantPrice: mapMoney(raw.priceRange.minVariantPrice),
      maxVariantPrice: mapMoney(raw.priceRange.maxVariantPrice),
    },
    compareAtPriceRange: {
      minVariantPrice: mapMoney(raw.compareAtPriceRange.minVariantPrice),
      maxVariantPrice: mapMoney(raw.compareAtPriceRange.maxVariantPrice),
    },
    availableForSale: raw.availableForSale,
    tags: raw.tags,
    seo: raw.seo ?? { title: null, description: null },
    subtitle: raw.subtitleMetafield?.value ?? null,
    callouts: [],
    accordions: [],
    faqItems: [],
    rating: parseRating(raw.ratingMetafield, raw.ratingCountMetafield),
    siblings: mapSiblings(raw),
    crossSellHandles,
  };
}

export function mapProductCard(raw: RawProductBase): Product {
  return mapProduct({
    ...raw,
    description: "",
    descriptionHtml: "",
    options: [],
    variants: { nodes: [] },
    images: { nodes: raw.featuredImage ? [raw.featuredImage] : [] },
    seo: { title: null, description: null },
  });
}

interface RawCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: RawImage | null;
  seo?: { title: string | null; description: string | null };
}

export function mapCollection(raw: RawCollection): Collection {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    image: mapImage(raw.image),
    seo: raw.seo ?? { title: null, description: null },
  };
}

interface RawCartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: RawMoney };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: RawImage | null;
    };
  };
}

interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: RawMoney;
    totalAmount: RawMoney;
    totalTaxAmount: RawMoney | null;
  };
  lines: { nodes: RawCartLine[] };
}

export function mapCart(raw: RawCart): Cart {
  const lines: CartLine[] = raw.lines.nodes.map((line) => ({
    id: line.id,
    quantity: line.quantity,
    cost: { totalAmount: mapMoney(line.cost.totalAmount) },
    merchandise: {
      id: line.merchandise.id,
      title: line.merchandise.title,
      selectedOptions: line.merchandise.selectedOptions,
      product: {
        id: line.merchandise.product.id,
        handle: line.merchandise.product.handle,
        title: line.merchandise.product.title,
        featuredImage: mapImage(line.merchandise.product.featuredImage),
      },
    },
  }));

  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    lines,
    cost: {
      subtotalAmount: mapMoney(raw.cost.subtotalAmount),
      totalAmount: mapMoney(raw.cost.totalAmount),
      totalTaxAmount: raw.cost.totalTaxAmount ? mapMoney(raw.cost.totalTaxAmount) : null,
    },
  };
}

interface RawMenuItem {
  title: string;
  url: string;
  items?: RawMenuItem[];
}

function mapMenuItem(item: RawMenuItem): MenuItem {
  return {
    title: item.title,
    url: item.url,
    items: item.items?.map(mapMenuItem),
  };
}

export function mapMenu(raw: { items: RawMenuItem[] }): Menu {
  return { items: raw.items.map(mapMenuItem) };
}

export function isExcludedProduct(handle: string): boolean {
  return (commerceConfig.excludedProductHandles as readonly string[]).includes(handle);
}

interface RawFilterValue {
  id: string;
  label: string;
  count: number;
  input: string;
}

interface RawFilterGroup {
  id: string;
  label: string;
  type: string;
  values: RawFilterValue[];
}

function mapFilterValue(value: RawFilterValue): FilterValue {
  return {
    id: value.id,
    label: value.label,
    count: value.count,
    input: value.input,
  };
}

function mapFilterGroup(group: RawFilterGroup): ProductFilterGroup {
  return {
    id: group.id,
    label: group.label,
    type: group.type,
    values: group.values.map(mapFilterValue),
  };
}

export function mapPaginatedCollection(
  raw: RawCollection & {
    products: {
      filters: RawFilterGroup[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: RawProductBase[];
    };
  },
): PaginatedCollection {
  return {
    ...mapCollection(raw),
    products: raw.products.nodes
      .filter((p) => !isExcludedProduct(p.handle))
      .map(mapProductCard),
    filters: raw.products.filters.map(mapFilterGroup),
    pageInfo: raw.products.pageInfo,
  };
}

interface RawPage {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  seo?: { title: string | null; description: string | null };
}

export function mapPage(raw: RawPage): ShopifyPage {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    body: raw.body,
    bodySummary: raw.bodySummary,
    seo: raw.seo ?? { title: null, description: null },
  };
}
