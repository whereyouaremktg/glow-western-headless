import type { Metadata } from "next";

import type { Product } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://glowbeautyhair.com";

export function buildProductJsonLd(product: Product, url: string) {
  const offers = product.variants.map((variant) => ({
    "@type": "Offer",
    sku: variant.sku ?? undefined,
    availability: variant.availableForSale
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    price: variant.price.amount,
    priceCurrency: variant.price.currencyCode,
    url,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.subtitle || undefined,
    image: product.images.map((img) => img.url),
    brand: {
      "@type": "Brand",
      name: product.vendor,
    },
    ...(product.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating.value,
            reviewCount: product.rating.count,
          },
        }
      : {}),
    offers: offers.length === 1 ? offers[0] : offers,
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function buildProductMetadata(product: Product): Metadata {
  const title = product.seo.title ?? product.title;
  const description =
    product.seo.description ?? product.subtitle ?? product.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : undefined,
    },
  };
}
