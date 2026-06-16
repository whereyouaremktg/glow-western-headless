"use client";
// PDP client shell wires gallery to variant-driven media and sticky ATC to selected variant.

import { useMemo, useState } from "react";

import { ProductGallery } from "@/components/product/product-gallery";
import {
  findMatchingVariant,
  getInitialProductOptions,
  ProductPurchase,
} from "@/components/product/product-purchase";
import { StickyMobileAtc } from "@/components/product/sticky-mobile-atc";
import type { Product } from "@/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedOptions, setSelectedOptions] = useState(() =>
    getInitialProductOptions(product),
  );

  const selectedVariant = useMemo(
    () => findMatchingVariant(product, selectedOptions),
    [product, selectedOptions],
  );

  const displayImages = useMemo(() => {
    if (selectedVariant?.image) {
      const variantImage = selectedVariant.image;
      const rest = product.images.filter((img) => img.url !== variantImage.url);
      return [variantImage, ...rest];
    }
    return product.images.length
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : [];
  }, [product, selectedVariant]);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductGallery images={displayImages} title={product.title} />
      <ProductPurchase
        product={product}
        selectedOptions={selectedOptions}
        onOptionsChange={setSelectedOptions}
      />
      <StickyMobileAtc product={product} variant={selectedVariant} />
    </div>
  );
}
