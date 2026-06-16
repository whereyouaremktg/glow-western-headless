# CLAUDE.md — Glow Beauty Hair Headless Storefront

**Source of truth for this project.** Update at every phase boundary.
Companion doc: `MIGRATION-REPORT.md` (Phase 1 theme audit — old-theme inventory & classification).

**Status:** Phase 2 complete (foundation). App scaffolded; Shopify client + UI primitives ready. Live API verification pending `.env.local` credentials.

---

## 1. Project

Production headless storefront for **Glow Beauty Hair** (glowbeautyhair.com), replacing a
customized Shopify Stiletto theme (`OLD-theme/` — visual/UX/content reference ONLY, never an
implementation source). Shopify remains the source of truth for products, collections, content
(metafields/metaobjects), and checkout.

**Brand:** functional luxury — stylist-created, salon-tested, elevated but approachable.
Founder Marissa, 14 years behind the chair. Key claims: extension-safe, wet & dry hair, reduced
breakage, faster styling, drainage-hole brush design, salon results at home.
Design benchmarks: Caraway, Grüns, AG1, Ridge. NOT a default Shopify look.

## 2. Stack (no substitutions)

- **Next.js 15+ App Router**, TypeScript `strict`, React Server Components by default
  - Every `"use client"` requires a justifying comment
- **Tailwind CSS** + **shadcn/ui**; **Framer Motion** for micro-interactions only
- **Shopify Storefront API `2025-04`** (GraphQL, version pinned)
- **Shopify Customer Account API** (OAuth confidential client) for accounts
- **Storefront Cart API** (`cartCreate` / `cartLinesAdd` / `cartLinesUpdate` / `cartLinesRemove`)
  → redirect to `cart.checkoutUrl` (Shopify-hosted checkout). No custom checkout.
- **Vercel** deploy + Analytics + Speed Insights
- Reference Shopify's Next.js Commerce template for Storefront patterns; never copy wholesale.

**Avoid:** Pages Router, Redux, client-side fetching where an RSC works, monorepo tooling,
Storybook (v2), any second CMS.

## 3. Structure (single app)

```
app/                        # routes
  page.tsx                  # home
  products/[handle]/
  collections/[handle]/
  search/
  account/                  # login, orders, orders/[id], addresses
  pages/[handle]/           # Shopify content pages
  cart/                     # fallback page (drawer is primary)
  sitemap.ts  robots.ts  not-found.tsx
components/ui/              # primitives: Button, Input, Card, Badge, Price,
                            #   ProductCard, ReviewStars (+ shadcn/ui)
components/sections/        # Phase 3 library — data-driven via typed props
components/layout/          # Header, AnnouncementBar, MobileNav, CartDrawer, Footer chrome
lib/shopify/                # client.ts, queries/, fragments/, mutations/, cart actions,
                            #   customer auth, content (metaobjects)
lib/seo/                    # metadata + JSON-LD builders
lib/content/                # typed fallback content map (seeds sections pre-metaobjects)
lib/config.ts               # commerce config (free-shipping threshold, badge tags, etc.)
types/                      # ALL shared interfaces — single source, no duplicates
```

## 4. Env contract (`.env.example`, Phase 2)

```
SHOPIFY_STORE_DOMAIN=                       # xxxx.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID=
SHOPIFY_CUSTOMER_ACCOUNT_API_URL=
NEXT_PUBLIC_SITE_URL=
```

`next.config` images.remotePatterns: `https://cdn.shopify.com/**`.

## 5. Design tokens (extracted from old theme — see MIGRATION-REPORT §2)

```ts
// Tailwind theme extension (Phase 2)
colors: {
  blush:        { DEFAULT: "#F4D5D2", strong: "#E8B5B0" },
  cream:        "#FAF6F1",          // page background
  powder:       "#B8C5D6",          // divider bands / announcement bar
  "warm-gray":  "#EBE9E6",          // feature-section surfaces
  ink:          { DEFAULT: "#171819", alt: "#22292D" }, // text, dark surfaces, footer
  muted:        "#7A7873",          // eyebrows, captions
  sale:         "#D21404",
}
```

- **Type:** Gotham Ultra (headings + buttons, UPPERCASE; buttons italic) · Proxima Nova (body,
  17px base) · both self-hosted woff2 via `next/font/local`. Letter-spacing: headings 0.1em,
  buttons 0.14em, eyebrows 0.22em, chips 0.18em. Nav stays in body font, weight 500, no transform.
- **Spacing:** 8 / 16 / 32 / 64 / 96; section padding-y 96px desktop.
- **Layout:** container max 1320px.
- **Buttons:** 8px radius, 2px ink border, hard shadow; blush bg → blush-strong hover.
- **Motion:** subtle fade/rise on section entry; micro-interactions only; respect
  `prefers-reduced-motion`.

## 6. Data models (`/types` — authoritative shapes)

```ts
// ---- Shopify commerce (mapped from Storefront API, never raw API types in components) ----
interface Money { amount: string; currencyCode: string }
interface ShopifyImage { url: string; altText: string | null; width: number; height: number }

interface ProductVariant {
  id: string; title: string; availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money; compareAtPrice: Money | null;
  image: ShopifyImage | null; sku: string | null; quantityAvailable: number | null;
}

interface Product {
  id: string; handle: string; title: string; vendor: string;
  description: string; descriptionHtml: string;
  options: { name: string; values: string[] }[];
  variants: ProductVariant[];
  featuredImage: ShopifyImage | null; images: ShopifyImage[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  availableForSale: boolean; tags: string[]; seo: { title: string | null; description: string | null };
  // Glow metafields (see §7)
  subtitle: string | null;
  callouts: ProductCallout[];
  accordions: ProductAccordion[];
  faqItems: FaqItem[];
  rating: { value: number; count: number } | null;   // reviews.rating / rating_count
  siblings: SiblingProduct[] | null;                 // stiletto.sibling_collection
  crossSellHandles: string[];
}

interface ProductCallout { icon: string; title: string; body: string }
interface ProductAccordion { title: string; bodyHtml: string }
interface SiblingProduct { handle: string; title: string; optionLabel: string; swatch: ShopifyImage | string }

interface Collection {
  id: string; handle: string; title: string; description: string;
  image: ShopifyImage | null; seo: { title: string | null; description: string | null };
}

interface CartLine {
  id: string; quantity: number; cost: { totalAmount: Money };
  merchandise: { id: string; title: string; selectedOptions: { name: string; value: string }[];
    product: Pick<Product, "id" | "handle" | "title" | "featuredImage"> };
}
interface Cart {
  id: string; checkoutUrl: string; totalQuantity: number;
  lines: CartLine[];
  cost: { subtotalAmount: Money; totalAmount: Money; totalTaxAmount: Money | null };
}

interface Menu { items: MenuItem[] }
interface MenuItem { title: string; url: string; items?: MenuItem[] }

// ---- Customer (Customer Account API) ----
interface Customer { id: string; firstName: string | null; lastName: string | null; emailAddress: string | null }
interface CustomerAddress {
  id: string; firstName: string | null; lastName: string | null;
  address1: string | null; address2: string | null; city: string | null;
  provinceCode: string | null; zip: string | null; countryCode: string; phone: string | null;
  isDefault: boolean;
}
interface OrderSummary {
  id: string; orderNumber: string; processedAt: string;
  financialStatus: string | null; fulfillmentStatus: string | null; totalPrice: Money;
}

// ---- v2 extension points (typed, unimplemented) ----
interface WishlistEntry { productHandle: string; addedAt: string }
type SubscriptionPlan = never   // reserved
type BundleSelection = never    // reserved
```

### Section props (every section = pure function of typed props; zero hardcoded business copy)

```ts
interface SectionBase { id: string; theme?: "cream" | "warm-gray" | "ink" | "blush" }
interface CTA { label: string; href: string; variant?: "primary" | "secondary" }
interface ResponsiveImage { desktop: ShopifyImage; mobile?: ShopifyImage; focalPoint?: { x: number; y: number } }

interface HeroProps extends SectionBase { chip?: string; eyebrow?: string; heading: string; body?: string; ctas: CTA[]; image: ResponsiveImage; height: "full" | "large" | "medium"; align: "left" | "center" }
interface SplitHeroProps extends SectionBase { eyebrowBand?: string; chipOverlay?: string; rating?: { value: number; label: string }; eyebrow?: string; heading: string; subheading?: string; body?: string; ctas: CTA[]; image: ResponsiveImage; mediaSide: "left" | "right" }
interface VideoHeroProps extends SectionBase { videoUrl: string; poster?: ShopifyImage; heading?: string; body?: string; ctas: CTA[]; overlayOpacity?: number }
interface BenefitsGridProps extends SectionBase { heading?: string; subheading?: string; columns: 3 | 4; items: { icon: string; title: string; body: string }[] }
interface BeforeAfterProps extends SectionBase { heading?: string; subheading?: string; before: ShopifyImage; after: ShopifyImage; labels: { before: string; after: string }; caption?: string }
interface Testimonial { quote: string; author: string; rating?: number; avatar?: ShopifyImage; photo?: ShopifyImage }
interface TestimonialsProps extends SectionBase { heading?: string; variant: "single" | "carousel" | "grid"; items: Testimonial[] }
interface ReviewCarouselProps extends SectionBase { heading?: string; reviews: { rating: number; title?: string; body: string; author: string; photo?: ShopifyImage; productHandle?: string }[] }
interface FaqItem { question: string; answerHtml: string; topic?: string }
interface FAQProps extends SectionBase { heading?: string; intro?: string; items: FaqItem[] }  // renders FAQPage JSON-LD
interface FounderStoryProps extends SectionBase { eyebrow?: string; heading?: string; moments: { image: ShopifyImage; eyebrow?: string; heading: string; body: string; cta?: CTA; reverse?: boolean }[] }
interface FeaturedProductProps extends SectionBase { product: Product; eyebrow?: string; framing?: string; mediaSide: "left" | "right" }
interface CollectionGridProps extends SectionBase { heading?: string; variant: "products" | "collections"; products?: Product[]; collections?: Collection[]; columns: 2 | 3 | 4; carouselOnMobile?: boolean; cta?: CTA }
interface GuaranteeProps extends SectionBase { pillars: { label: string; body?: string; icon?: string }[] }
interface EmailCaptureProps extends SectionBase { heading: string; body?: string; incentive?: string; placeholder?: string; successMessage: string }
interface FooterProps { menus: { heading: string; menu: Menu }[]; newsletter: EmailCaptureProps; social: { platform: "instagram" | "tiktok" | "facebook"; url: string }[]; legalName: string }
```

## 7. Shopify data contract

### Existing metafields (keep, read as-is)
| Owner | Key | Use |
|---|---|---|
| product | `stiletto.sibling_collection` / `siblings_collection` | sibling-product swatches |
| product | `stiletto.sibling_option_name` | sibling swatch label |
| product | `reviews.rating`, `reviews.rating_count` | aggregate rating (Loox-populated) |
| shop metaobject | `custom_badges.custom_badges_translations` | tag → badge label |

### New definitions (create in admin; `glow` namespace)
Product: `glow.subtitle`, `glow.callouts` (list → `product_callout`), `glow.accordions`
(list → `product_accordion`), `glow.faq_items` (list → `faq_item`),
`glow.cross_sell_products` (list.product_reference).

Content metaobjects: `section_hero`, `section_split_hero`, `section_video_hero`,
`section_benefits` (+ `benefit_item`), `section_before_after`, `testimonial`, `faq_item`,
`section_founder_story` (+ `story_moment`), `section_guarantee` (+ `guarantee_pillar`),
`section_meganav_promo`, `page_sections` (page handle → ordered section refs).

Fallback: `lib/content/` typed content map seeds all sections; metaobject data overrides when
present. Same prop types either way.

### Menus
`main-menu-copy` (header — confirm canonical), `footer`, `follow-us`, `wholesale`.

### Commerce config (`lib/config.ts`)
Free-shipping threshold $50 · badge tag groups · swatch option names · cross-sell defaults ·
products excluded from listings (e.g. `package-protection`).

## 8. Routes & features (Phase 4 scope)

| Route | Features |
|---|---|
| `/` | Section stack per MIGRATION-REPORT §4.1 |
| `/products/[handle]` | Gallery (thumbs desktop / carousel mobile, lightbox, variant media), variant selector (incl. siblings), qty, ATC server action, **sticky mobile ATC**, accordions, callouts, reviews, cross-sell, Product + Breadcrumb JSON-LD |
| `/collections/[handle]` | Hero header, Storefront filters (price, availability, options), sort, load-more pagination w/ URL state |
| `/search` | Full results + filters; **predictive search** in header overlay |
| Cart Drawer | Optimistic updates (`useOptimistic` + server actions), free-shipping progress, cross-sells, → `checkoutUrl` |
| `/account/*` | Customer Account API OAuth login, orders list/detail, addresses CRUD |
| `/pages/[handle]` | Metaobject-composed sections + page content |

Deferred v2 (typed extension points only): wishlist, subscriptions, bundles, loyalty page,
creator/affiliate pages, blog, shoppable look, routine grid, press logos, UGC grid.

## 9. SEO & performance (Phase 5 targets)

- Dynamic `generateMetadata` + OG per route; canonicals; `sitemap.ts`; `robots.ts`
- JSON-LD: `Product`, `BreadcrumbList`, `FAQPage`, `Organization`
- Lighthouse ≥ 95 · LCP < 2.0s · CLS < 0.1
- RSC-first; audit every client component; `next/image` everywhere (Shopify CDN loader)

## 10. Conventions

- **Conventional commits**, one commit per logical unit
- All shared types in `/types` — never duplicate; components consume mapped domain types, never
  raw Storefront API shapes (mapping lives in `lib/shopify`)
- GraphQL: typed fragments per entity; queries colocated in `lib/shopify/queries`
- Server Components by default; every `"use client"` carries a justification comment
- Zero hardcoded business copy in sections — props only (metaobjects or `lib/content` map)
- Tokens only — no raw hex/px in components
- `OLD-theme/` is read-only reference; nothing imports from it

## 11. Phase log

- **Phase 1 ✅** — Theme audit complete → `MIGRATION-REPORT.md`; this spec written. No app code.
- **Phase 2 ✅** — Foundation:
  - Next.js 15 App Router scaffold (TypeScript strict, Tailwind v4, ESLint, Vercel Analytics + Speed Insights)
  - `/types` — all shared domain interfaces (commerce, cart, customer, section props, v2 extension points)
  - `lib/shopify/` — Storefront API `2025-04` client, typed fragments, queries, mappers, cart mutations; `verifyStorefrontConnection()` smoke test
  - `lib/config.ts` — commerce config (free-shipping $50, badge tags, swatch/chip options, excluded handles)
  - Design tokens in `app/globals.css` + Gotham Ultra via `next/font/local` (`app/fonts/gotham-ultra.otf`); Proxima Nova pending licensed woff2
  - UI primitives: `Button`, `Input`, `Card`, `Badge`, `Price`, `ProductCard`, `ReviewStars` (+ shadcn `components.json`)
  - Foundation page at `/` showcases tokens, primitives, and Shopify connection status
  - `.env.example` created; `next.config.ts` images.remotePatterns for `cdn.shopify.com`
  - Build verified: `npm run typecheck && npm run build` pass
  - Live fetch: **not yet verified** — requires `.env.local` with `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- Phase 3 — Section library (14 launch sections)
- Phase 4 — Pages & commerce
- Phase 5 — SEO & performance
- Phase 6 — Deploy & `PARITY-REPORT.md`

## 12. Open items (carried from audit)

1. **Reviews provider** — Loox API vs. Judge.me/Okendo switch vs. metafield-aggregate interim (launch blocker for Review Carousel/PDP reviews)
2. **Fonts** — license + self-host Gotham Ultra & Proxima Nova woff2
3. **FAQ copy gaps** — 2 answers marked "TODO — Paul to provide" in old theme (cleaning; bristle QC/warranty)
4. **Menu hygiene** — header bound to `main-menu-copy`; confirm canonical menu
5. **Redo links** — `/apps/redo/*` proxy URLs must target the Shopify-hosted domain post-launch
