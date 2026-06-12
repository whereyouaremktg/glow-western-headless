# MIGRATION-REPORT.md — Glow Beauty Hair Headless Rebuild

**Phase 1 deliverable.** Full audit of the existing Shopify theme (`OLD-theme/`) and classification
of every asset into: **Rebuild** (React section/component), **Shopify data** (metafield/metaobject/
native content), or **Discard**.

- **Source theme:** Stiletto v5.2.2 by Fluorescent Design, heavily customized
- **Customization layers:** bespoke `glow-*` section library (8 sections, own design-token system),
  CreatorCommerce `cc-*` sections (7), custom "Glow" theme-settings group, `glow-stiletto.css/js`
- **Counts:** 89 sections · 138 snippets · 63 templates · 13 app embeds · 7 app-block integrations

---

## 1. Executive summary

1. **The brand system is fully extractable.** All Glow design tokens (palette, type, spacing,
   buttons, container) live in `snippets/glow-vars.liquid` + the "Glow" settings group and map 1:1
   to Tailwind tokens (§2).
2. **The bespoke `glow-*` sections are the visual soul of the site** and map almost 1:1 onto the
   Phase 3 launch section list (§3.1).
3. **Most of the 89 sections are Stiletto stock**, many unused or carrying leftover demo content
   from the theme vendor (fashion/jewelry/ceramics copy). These are discarded.
4. **Per-SKU product templates are an anti-pattern to eliminate.** The old theme has 19 product
   templates; 9 are per-SKU near-duplicates whose only real differences are marketing copy and
   accordion content. That content becomes **product metafields** rendered by ONE PDP template (§5).
5. **Hardcoded copy must become Shopify data.** Homepage hero copy, FAQ answers, press pillars,
   testimonials, and founder story are hardcoded in section presets/settings today. These become
   **metaobjects** (§6.2).
6. **The cart drawer in production is an app (UpCart), not the theme.** Headless replaces it with a
   native Cart Drawer on the Storefront Cart API — strictly better (§7).
7. **App stack needs decisions.** Loox (reviews), Smile.io (loyalty), Redo (returns), Rebuy,
   CreatorCommerce, and Instafeed have no automatic headless equivalent. Recommendations in §7;
   only reviews and email capture block launch.

---

## 2. Design system extraction (source of Phase 2 tokens)

Extracted from `snippets/glow-vars.liquid`, `config/settings_schema.json` ("Glow" group),
`config/settings_data.json`, and `assets/glow-stiletto.css`.

### 2.1 Color palette

| Token | Hex | Usage in old theme |
|---|---|---|
| `blush` | `#F4D5D2` | Announcement bar, chips, accent strip, primary CTA |
| `blush-strong` | `#E8B5B0` | Hover states, deeper accent (live setting overrides button bg to this) |
| `cream` | `#FAF6F1` | Page background, light text on dark |
| `powder` | `#B8C5D6` | Divider bands (announcement bar live value `#b2cae7`) |
| `warm-gray` | `#EBE9E6` | Feature-section backgrounds (editorial split content side) |
| `ink` | `#171819` | Type, dark sections, footer, buttons |
| `ink-alt` | `#22292D` | Alternate dark surface |
| `muted` | `#7A7873` | Eyebrows, captions |
| `sale` | `#D21404` | Sale price / sale badge |
| stock good/med/bad | `#435830` / `#E69B1D` / `#AAAAAA` | Inventory indicators |

### 2.2 Typography

| Role | Font | Treatment |
|---|---|---|
| Headings (h1–h6) | **Gotham Ultra** (custom OTF in `assets/`) | UPPERCASE, letter-spacing ~0.1em (live setting `100/1000em`) |
| Buttons | Gotham Ultra | UPPERCASE, *italic*, letter-spacing 0.14em |
| Eyebrows | body font | UPPERCASE, letter-spacing 0.22em |
| Chips/badges | body font | UPPERCASE, letter-spacing 0.18em |
| Body | **Proxima Nova** (loaded from a HubSpot CDN — must be self-hosted in rebuild) | 17px base, 95% mobile scale |
| Nav | Proxima Nova, weight 500, no transform | Explicitly excluded from Gotham treatment |
| Fallback | Inter (theme setting) | |

> ⚠️ **Licensing/action item:** Gotham Ultra ships as an OTF in theme assets; Proxima Nova is
> hot-linked from HubSpot. Both need properly licensed, self-hosted woff2 files (`next/font/local`).

### 2.3 Spacing, shape, layout

- Spacing scale: `xs 8 / s 16 / m 32 / l 64 / xl 96` px
- Section rhythm: 96px default top/bottom padding
- Container max-width: **1320px**
- Buttons: soft 8px corner (live setting; schema default pill), 2px border, hard-shadow border
  color `ink`, hover swaps blush→blush-strong
- Swatches: round; product cards show hover second image; quick-add enabled, quick-view disabled

### 2.4 Motion

- Old theme: section scroll-in animations (theme-level toggle, on), Swiper carousels, marquee.
- Rebuild: Framer Motion micro-interactions only (fade/rise on scroll-in, button/hotspot
  transitions). No parallax, no Three.js (only used by discarded CreatorCommerce hero).

---

## 3. Section inventory & classification

### 3.1 REBUILD — Phase 3 launch section library

Mapping from old theme → the 14 launch sections. One React section often replaces several
overlapping Liquid sections.

| New section (Phase 3) | Replaces (old) | Content source | Notes |
|---|---|---|---|
| **Hero** | `glow-hero`, `image-hero`, `slideshow` (single-slide use) | metaobject `section_hero` | Blocks: chip, eyebrow, heading, body, 2 buttons; desktop/mobile image + focal point; full-bleed option |
| **Split Hero** | `glow-editorial-split`, `image-hero-split`, `image-with-text`, `image-with-text-split` | metaobject `section_split_hero` | Eyebrow band ("THE LINEUP"), chip overlay, star-rating row, alternating media side |
| **Video Hero** | `video-hero`, `video`, `video-with-text` | metaobject `section_video_hero` | Shopify-hosted MP4 (`Glow Beauty - Hero Video.mp4` in use), overlay text, autoplay muted |
| **Benefits Grid** | `multi-column` (icon columns) | metaobject `section_benefits` | Icon + title + body columns; 3–4 cols; the homepage "why it works" block |
| **Before/After** | `glow-results-compare`, `image-compare` | metaobject `section_before_after` | Drag-to-reveal slider; labels BEFORE/AFTER; caption ("After 4 weeks of daily use") |
| **Testimonials** | `testimonials`, `quote`, `glow-quote` | metaobject `testimonial` (list) | Quote, author, stars, optional avatar/photo; single-quote and carousel variants |
| **Review Carousel** | Loox app blocks (`loox-gallery-carousel`, `loox-dynamic`) | Reviews provider (§7 decision) | Product-review cards w/ photos; needs Loox API or replacement |
| **FAQ** | `faq`, `collapsible-row-list` | metaobject `faq_item` (list, taggable by topic) | Native `<details>` in old theme → accessible accordion + **FAQPage JSON-LD**. ⚠️ 2 answers marked "TODO — Paul to provide" (cleaning instructions; bristle QC/warranty) |
| **Founder Story** | `glow-story-stack`, about-page `image-with-text-split` | metaobject `section_founder_story` | Marissa, 14 yrs behind the chair; alternating "moments" |
| **Featured Product** | `featured-product`, homepage `featured-product` use | Storefront API (product by handle) + metaobject for framing copy | Live product data, price, ATC |
| **Collection Grid** | `featured-collection-grid`, `collection-list-grid`, `collection-list-slider`, `featured-collection-slider` | Storefront API (collection by handle) | Product-cards variant + collection-cards variant; optional mobile carousel |
| **Guarantee** | `glow-press-strip` (pillar variant) | metaobject `section_guarantee` | CRUELTY FREE / ECO-FRIENDLY / LIFETIME PROMISE / FREE SHIPPING pillars on blush band |
| **Email Capture** | `newsletter`, `newsletter-compact`, footer newsletter block | typed content map + Klaviyo API | "Save 10% off your first order"; server action → Klaviyo list |
| **Footer** | `footer` | Shopify menus (`footer`, `follow-us`, `wholesale`) + content map | Newsletter block, 3 link columns, social icons, payment icons, "Hair By Marissa Sue DBA Glow Beauty" |

**Site chrome rebuilt in Phase 4** (not in the section library, but required):

| Component | Replaces | Notes |
|---|---|---|
| Announcement Bar | `announcement-bar` | Sticky, rotating messages, powder-blue bg; both live messages currently disabled |
| Header + Meganav | `header`, `meganav-*`, `navigation*` | Logo left / nav center, sticky, transparent-on-home, full-width meganav on "Shop" with promo image, bag icon + live count |
| Mobile Drawer Nav | `drawer-menu*`, `mobile-menu-image-thumbnail` | Drill-down panels, optional link thumbnails (metafield-driven) |
| Cart Drawer | `quick-cart` + **UpCart app** | Native rebuild: optimistic line updates, free-shipping progress bar, cross-sells, checkout redirect |
| Predictive Search | `predictive-search`, `quick-search` | Storefront `predictiveSearch` query; suggested-links ("See Our Most Popular Brushes") |
| PDP module set | `main-product--default` + 19 `product-block-*` snippets | See §5 |
| Collection toolkit | `main-collection-product-grid`, `filter-*`, `active-filters`, `pagination` | Storefront `filters` arg; sidebar + mobile drawer; infinite scroll in old theme → "load more" + URL state |
| Contact form | `contact-form` | Server action (Shopify contact or email provider) |

### 3.2 DEFER to v2 (typed extension points only)

| Old section(s) | v2 feature |
|---|---|
| `glow-shoppable-look`, `shoppable-image`, `shoppable-feature` | Shoppable Look (hotspots) |
| `glow-routine-grid` | How It Works / routine steps |
| `glow-press-strip` (logo variant: Anthropologie, Nordstrom, Neiman Marcus…) | Press Logos |
| `grid` (homepage UGC video grid "REAL RESULTS") | UGC Grid |
| `complete-the-look`, `recommended-products` (beyond PDP cross-sell), `recently-viewed-products` | Cross-sell expansions |
| `scrolling-content` | Marquee |
| `gallery-carousel` | Gallery |
| `blog-posts`, `main-blog`, `main-article` | Blog (no /blog route in launch scope) |
| `product-tabs` | — (only used by demo template) |
| `popup` | Promo popups (or Klaviyo onsite) |

### 3.3 DISCARD

| Item | Reason |
|---|---|
| `cc-hero-equinox`, `cc-hero-primavera-mini-shell`, `cc-banner-momentum`, `cc-product-quote-badge`, `cc-product-quote-editorial`, `cc-drops-*` (7 sections + 5 snippets) | CreatorCommerce app coupling (Liquid-injected metaobjects, cart-attribute session, Three.js hero). Creator program needs a headless-compatible affiliate decision first (§7) |
| `slideshow`, `promo-banner`, `promotion-bar`, `sales-banner`, `countdown-banner`, `countdown-bar`, `events` | Unused or demo-only on live templates |
| `apps`, `custom-liquid`, `page-section` | Liquid app-block / injection mechanisms — no headless equivalent |
| `store-availability` + drawer snippet | No retail pickup locations in use |
| `purchase-confirmation-popup-item` | Superseded by cart drawer UX |
| `main-password`, `password-header`, `layout/password.liquid` | Vercel preview protection replaces password page |
| `main-list-collections` | Not in launch routes; collection grid section covers the need |
| All locale files except `en.default.json` | Store sells in English/US only (`markets.json`: single US market) |
| Theme JS/CSS (`theme.js`, Swiper/PhotoSwipe/noUiSlider chunks, all `template-*.css`) | Replaced by React implementations |

---

## 4. Template inventory & classification

### 4.1 Routes to rebuild (Phase 4)

| Old template | New route | Notes |
|---|---|---|
| `index.json` | `/` | Section order to reproduce: Hero → Guarantee/press strip → Benefits → Featured Product → Collection Grid → Testimonials → (UGC grid → v2) → Split Hero ×2 → Video Hero → Review Carousel |
| `product.json` **+ 9 per-SKU templates** | `/products/[handle]` | ONE template; per-SKU differences move to product metafields (§5) |
| `collection.json` | `/collections/[handle]` | Hero image header, filters, sort, product grid |
| `search.json` | `/search` | Results + same filter toolkit + predictive search |
| `cart.json` | Cart Drawer (+ `/cart` fallback page) | |
| `customers/*` (7 templates) | `/account/*` | Login, register, account, orders/[id], addresses — via **Customer Account API** (OAuth), replacing Liquid forms |
| `404.json` | `not-found.tsx` | |
| `gift_card.liquid` | — | Shopify-hosted gift card page remains (issued post-checkout) |

### 4.2 Content pages → `/pages/[handle]` (Shopify data)

Real content pages keep their handles and render from Shopify page content + metaobject-driven
sections: **about** (founder story), **faq**, **contact**, **brush-care**, **missing-bristle**
(drainage-hole explainer — key brand claim), **our-locations**, **salon-directory**,
**joblistings**, **testimonials**, **wholesale**, **wholesale-guide**, **shipping-claims**.

App-dependent pages — blocked on §7 decisions: **smile-landing-page** (Smile.io blocks),
**collabs** (Shopify Collabs), **affiliate** (Snowball), **stylists** (Klaviyo form + Instafeed).

### 4.3 Discard (leftover Stiletto demo content)

`page.fit-guide`, `page.guide`, `page.lookbook`, `page.team`, `collection.collection-alternate`,
`collection.collection-landing`, `collection.collection-sale`, `collection.flash-sale`,
`collection.subcollections`, `product.custom-options`, `product.events-product`,
`product.product-bundle`, `product.product-with-look`, `metaobject/creator.json` (CreatorCommerce),
`password.json`.

---

## 5. PDP module audit → one template + metafields

The old PDP (`main-product--default` + block snippets) supports 19 block types. Disposition:

| Old PDP block | Disposition |
|---|---|
| `product_header` (title, price, badges, rating) | **Rebuild** — Title/Price/Badge/ReviewStars primitives |
| `variant_picker` (swatches/chips/dropdown + sibling products) | **Rebuild** — keep sibling-product pattern via metafields (§6.1) |
| `buy_buttons` + sticky ATC bar | **Rebuild** — server-action ATC, sticky mobile bar (launch requirement) |
| `quantity_selector` | **Rebuild** |
| `description`, `accordion`, `text` | **Rebuild**, content from `product.description` + metafield accordions |
| `product_callouts` / `callouts_mini` (icon + copy) | **Rebuild**, content from metafield (extension-safe, wet & dry, drainage hole…) |
| `featured_products` (cross-sell) | **Rebuild** — cross-sell row (launch requirement) |
| `inventory-counter`, `information_popup`, `custom_option`, `secure_payment`, `image`, `share`, `spacer`, `custom_liquid`, `@app` | **Defer/discard** — not used on live Glow templates or app-coupled |
| Gift-card recipient form | **Defer v2** — gift card product keeps default treatment |

**Per-SKU template content → product metafields.** The 9 SKU templates differ only in: marketing
subtitle, accordion items (bristle specs, handle, cushion, dust bag, warranty), below-fold
rich-text/hero modules, and FAQ presence. New model (§6.1) captures all of it; every product uses
the single PDP route.

Media: thumbnails-left desktop / carousel mobile, lightbox, variant-scoped media groups → rebuild
as PDP Gallery with the same behaviors.

---

## 6. Data model: metafields & metaobjects

### 6.1 Existing definitions to KEEP (already in the store)

| Owner | Key | Type | Purpose |
|---|---|---|---|
| Product | `stiletto.sibling_collection` (+ `siblings_collection` fallback) | collection ref | Sibling-product swatches (color variants as separate products) — used by PDP + cards |
| Product | `stiletto.sibling_option_name` | text | Sibling swatch label |
| Product | `reviews.rating`, `reviews.rating_count` | rating / int | Aggregate rating (Loox-populated) — powers ReviewStars + Product JSON-LD |
| Shop metaobject | `custom_badges.custom_badges_translations` | metaobject | Tag → badge label map |
| Product/Collection | `stiletto.mobile_menu_thumbnail` | file ref | Mobile-nav link thumbnails |

> Migration choice: read `stiletto.*` keys as-is (zero store migration). Optionally alias into a
> `glow.*` namespace later.

### 6.2 NEW definitions to create (replace hardcoded copy)

**Product metafields (namespace `glow`):** `subtitle` (text), `callouts`
(list.metaobject → `product_callout`: icon + title + body), `accordions`
(list.metaobject → `product_accordion`: title + rich body), `faq_items`
(list.metaobject → `faq_item`), `cross_sell_products` (list.product_reference).

**Content metaobjects (one per launch section that carries copy):** `section_hero`,
`section_split_hero`, `section_video_hero`, `section_benefits` (+ `benefit_item`),
`section_before_after`, `testimonial`, `faq_item` (question, rich answer, topic tag),
`section_founder_story` (+ `story_moment`), `section_guarantee` (+ `guarantee_pillar`),
`page_sections` (page handle → ordered list of section metaobject refs — lets Shopify admin
compose landing pages without code).

Fallback: a **typed content map** in the repo seeds every section so the site renders before
metaobjects are populated; metaobject data overrides when present.

### 6.3 Navigation (Shopify menus — fetched via Storefront `menu` query)

`main-menu-copy` (header — note: a copy, confirm canonical), `footer`, `follow-us`, `wholesale`.
Meganav promo image/CTA moves to a `section_meganav_promo` metaobject (it's hardcoded in the
header section settings today).

---

## 7. Third-party app stack → headless disposition

| App | Role today | Headless disposition |
|---|---|---|
| **Loox** | Reviews (PDP widgets, homepage carousel, rating metafields) | **Decision needed (blocks Review Carousel/PDP reviews).** Options: (a) keep Loox, render via its API server-side; (b) switch to Judge.me/Okendo (first-class headless APIs); (c) interim: render aggregate from `reviews.*` metafields only. Recommend (a) attempt, (c) fallback for launch |
| **UpCart** | Cart drawer | **Replace** with native Cart Drawer (Phase 4) |
| **Klaviyo** | Email/SMS, stylist signup form | **Keep** — server-side list-subscribe API for Email Capture; embed form replaced by API call |
| **Smile.io** | Loyalty (launcher + landing page) | **Defer v2** — no clean headless widget; loyalty page parked; flag in PARITY-REPORT |
| **Redo** | Returns/package protection (`/apps/redo` proxy links) | **Partially survives** — checkout-level features fine; `/apps/redo/account` proxy links must point to the Shopify-hosted domain. Update FAQ/shipping-claims copy |
| **Rebuy** | Personalization embed | **Drop**; cross-sell via Storefront `productRecommendations` + `glow.cross_sell_products` |
| **CreatorCommerce** | Creator co-branded pages/drops | **Defer** — Liquid-injection model incompatible; creator program needs product decision |
| **Snowball / Shopify Collabs** | Affiliate signup pages | **Keep apps on Shopify-hosted URLs** or replace forms; pages parked at launch |
| **Instafeed** | IG feed on stylists page | **Defer v2** |
| **Smart SEO, Microsoft Clarity, Accessibility Assistant, GSC countdown, Google/YouTube channel** | Embeds | **Replace**: `lib/seo` (metadata/JSON-LD), Vercel Analytics + Speed Insights; others drop |
| **Shopify Forms, HubSpot** (wholesale form embed) | Lead forms | Wholesale HubSpot form → server-side HubSpot Forms API or keep embed on that single page |

---

## 8. Risks & open items

1. **Reviews provider decision** (§7) — only true launch blocker among apps.
2. **Font licensing** — self-host Gotham Ultra + Proxima Nova as woff2; current Proxima Nova loads
   from a HubSpot CDN (perf + licensing smell).
3. **FAQ content gaps** — two answers in the live theme literally say "TODO before publishing —
   Paul to provide" (brush cleaning; bristle QC/warranty).
4. **Menu hygiene** — header uses `main-menu-copy`; confirm which menu is canonical before launch.
5. **Checkout add-ons** (Redo package protection product, "Perks" checkout) live at Shopify
   checkout and survive redirect unchanged — but the `package-protection` product must be excluded
   from search/collection listings in the new storefront.
6. **Customer Account API** replaces Liquid auth — customers will authenticate via Shopify's
   hosted OAuth (new login UX vs. old forms). Password reset/activation emails keep Shopify URLs;
   account domain settings must be updated at go-live.
7. **Single market (US/EN)** today — no i18n scaffolding needed at launch; don't port the 4 unused
   locales or currency-selector chrome.

---

## 9. Old-theme inventory ledger (for Phase 6 parity check)

**Sections (89):** 14 launch rebuilds (§3.1) · 8 chrome rebuilds (§3.1) · 14 deferred (§3.2) ·
remainder discarded (§3.3). 
**Snippets (138):** absorbed into React components (product cards, filters, nav, media, price,
badges, forms) — no snippet ports 1:1; the ledger above tracks them by feature area. 
**Templates (63):** 8 route rebuilds · 12 content pages · 4 app-dependent pages parked ·
16 demo/legacy discards · 9 per-SKU templates collapsed into one PDP. 
**Settings:** design tokens → Tailwind theme (§2); commerce toggles (free-shipping threshold $50,
badge tag groups, swatch option names, cross-sell source) → typed config in `lib/config.ts`.
