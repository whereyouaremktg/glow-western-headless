// ---- Money & media ----

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

// ---- Product ----

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  compareAtPrice: Money | null;
  image: ShopifyImage | null;
  sku: string | null;
  quantityAvailable: number | null;
}

export interface ProductCallout {
  icon: string;
  title: string;
  body: string;
}

export interface ProductAccordion {
  title: string;
  bodyHtml: string;
}

export interface SiblingProduct {
  handle: string;
  title: string;
  optionLabel: string;
  swatch: ShopifyImage | string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  options: { name: string; values: string[] }[];
  variants: ProductVariant[];
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  availableForSale: boolean;
  tags: string[];
  seo: { title: string | null; description: string | null };
  subtitle: string | null;
  callouts: ProductCallout[];
  accordions: ProductAccordion[];
  faqItems: FaqItem[];
  rating: { value: number; count: number } | null;
  siblings: SiblingProduct[] | null;
  crossSellHandles: string[];
}

// ---- Collection ----

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  seo: { title: string | null; description: string | null };
}

export interface CollectionWithProducts extends Collection {
  products: Product[];
}

export interface FilterValue {
  id: string;
  label: string;
  count: number;
  input: string;
}

export interface ProductFilterGroup {
  id: string;
  label: string;
  type: string;
  values: FilterValue[];
}

export interface PaginatedCollection extends Collection {
  products: Product[];
  filters: ProductFilterGroup[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export interface ShopifyPage {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  seo: { title: string | null; description: string | null };
}

// ---- Cart ----

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: Pick<Product, "id" | "handle" | "title" | "featuredImage">;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
}

// ---- Navigation ----

export interface MenuItem {
  title: string;
  url: string;
  items?: MenuItem[];
}

export interface Menu {
  items: MenuItem[];
}

// ---- Customer (Customer Account API — Phase 4) ----

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
}

export interface CustomerAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  provinceCode: string | null;
  zip: string | null;
  countryCode: string;
  phone: string | null;
  isDefault: boolean;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: Money;
}

// ---- Content ----

export interface FaqItem {
  question: string;
  answerHtml: string;
  topic?: string;
}

export interface CTA {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

export interface ResponsiveImage {
  desktop: ShopifyImage;
  mobile?: ShopifyImage;
  focalPoint?: { x: number; y: number };
}

// ---- Section props (Phase 3) ----

export interface SectionBase {
  id: string;
  theme?: "cream" | "warm-gray" | "ink" | "blush";
}

export interface HeroProps extends SectionBase {
  chip?: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  ctas: CTA[];
  image: ResponsiveImage;
  height: "full" | "large" | "medium";
  align: "left" | "center" | "right";
}

export interface SplitHeroProps extends SectionBase {
  eyebrowBand?: string;
  chipOverlay?: string;
  rating?: { value: number; label: string };
  eyebrow?: string;
  heading: string;
  subheading?: string;
  body?: string;
  ctas: CTA[];
  image: ResponsiveImage;
  mediaSide: "left" | "right";
}

export interface VideoHeroProps extends SectionBase {
  videoUrl: string;
  poster?: ShopifyImage;
  heading?: string;
  body?: string;
  ctas: CTA[];
  overlayOpacity?: number;
}

export interface BenefitsGridProps extends SectionBase {
  heading?: string;
  subheading?: string;
  columns: 3 | 4;
  items: { icon: string; title: string; body: string }[];
}

export interface BeforeAfterProps extends SectionBase {
  heading?: string;
  subheading?: string;
  before: ShopifyImage;
  after: ShopifyImage;
  labels: { before: string; after: string };
  caption?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  rating?: number;
  avatar?: ShopifyImage;
  photo?: ShopifyImage;
}

export interface TestimonialsProps extends SectionBase {
  heading?: string;
  variant: "single" | "carousel" | "grid";
  items: Testimonial[];
}

export interface ReviewCarouselProps extends SectionBase {
  heading?: string;
  reviews: {
    rating: number;
    title?: string;
    body: string;
    author: string;
    photo?: ShopifyImage;
    productHandle?: string;
  }[];
}

export interface FAQProps extends SectionBase {
  heading?: string;
  intro?: string;
  items: FaqItem[];
}

export interface FounderStoryProps extends SectionBase {
  eyebrow?: string;
  heading?: string;
  moments: {
    image: ShopifyImage;
    eyebrow?: string;
    heading: string;
    body: string;
    cta?: CTA;
    reverse?: boolean;
  }[];
}

export interface FeaturedProductProps extends SectionBase {
  product: Product;
  eyebrow?: string;
  framing?: string;
  mediaSide: "left" | "right";
}

export interface CollectionGridProps extends SectionBase {
  heading?: string;
  variant: "products" | "collections";
  products?: Product[];
  collections?: Collection[];
  columns: 2 | 3 | 4;
  carouselOnMobile?: boolean;
  cta?: CTA;
}

export interface GuaranteeProps extends SectionBase {
  pillars: { label: string; body?: string; icon?: string }[];
}

export interface EmailCaptureProps extends SectionBase {
  heading: string;
  body?: string;
  incentive?: string;
  placeholder?: string;
  successMessage: string;
}

export interface FooterProps {
  menus: { heading: string; menu: Menu }[];
  newsletter: EmailCaptureProps;
  social: { platform: "instagram" | "tiktok" | "facebook"; url: string }[];
  legalName: string;
}

// ---- v2 extension points ----

export interface WishlistEntry {
  productHandle: string;
  addedAt: string;
}

export type SubscriptionPlan = never;
export type BundleSelection = never;
