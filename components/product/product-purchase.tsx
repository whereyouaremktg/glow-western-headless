"use client";
// Variant selection, quantity, and add-to-cart need client state tied to cart server actions.

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/layout/cart-provider";
import { Button } from "@/components/ui/button";
import { ProductPrice } from "@/components/ui/price";
import { ReviewStars } from "@/components/ui/review-stars";
import { commerceConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";

interface ProductPurchaseProps {
  product: Product;
  id?: string;
  selectedOptions?: Record<string, string>;
  onOptionsChange?: (options: Record<string, string>) => void;
}

export function findMatchingVariant(
  product: Product,
  selected: Record<string, string>,
): ProductVariant | null {
  return (
    product.variants.find((variant) =>
      variant.selectedOptions.every((opt) => selected[opt.name] === opt.value),
    ) ?? product.variants[0] ??
    null
  );
}

export function ProductPurchase({
  product,
  id = "product-purchase",
  selectedOptions: controlledOptions,
  onOptionsChange,
}: ProductPurchaseProps) {
  const { addItem, isPending } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [internalOptions, setInternalOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const option of product.options) {
      initial[option.name] = option.values[0] ?? "";
    }
    return initial;
  });

  const selectedOptions = controlledOptions ?? internalOptions;
  const setSelectedOptions = onOptionsChange ?? setInternalOptions;

  const selectedVariant = useMemo(
    () => findMatchingVariant(product, selectedOptions),
    [product, selectedOptions],
  );

  const handleAdd = async () => {
    if (!selectedVariant) return;
    await addItem(selectedVariant.id, quantity);
  };

  const swatchNames = commerceConfig.swatchOptionNames as readonly string[];

  return (
    <div id={id} className="space-y-6">
      {product.subtitle && <p className="text-lg text-muted">{product.subtitle}</p>}

      {product.rating && (
        <ReviewStars rating={product.rating.value} count={product.rating.count} />
      )}

      <ProductPrice
        product={{
          ...product,
          priceRange: selectedVariant
            ? {
                minVariantPrice: selectedVariant.price,
                maxVariantPrice: selectedVariant.price,
              }
            : product.priceRange,
          compareAtPriceRange: selectedVariant?.compareAtPrice
            ? {
                minVariantPrice: selectedVariant.compareAtPrice,
                maxVariantPrice: selectedVariant.compareAtPrice,
              }
            : product.compareAtPriceRange,
        }}
      />

      {product.siblings && product.siblings.length > 0 && (
        <div className="space-y-2">
          <p className="font-eyebrow">{product.siblings[0]?.optionLabel ?? "Style"}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/products/${product.handle}`}
              className="relative size-10 overflow-hidden rounded-full ring-2 ring-ink ring-offset-2"
              aria-current="page"
            >
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              )}
            </Link>
            {product.siblings.map((sibling) => (
              <Link
                key={sibling.handle}
                href={`/products/${sibling.handle}`}
                className="relative size-10 overflow-hidden rounded-full ring-1 ring-ink/20 hover:ring-ink"
                title={sibling.title}
              >
                {typeof sibling.swatch === "string" ? (
                  <span className="flex size-full items-center justify-center bg-warm-gray text-[10px]">
                    {sibling.optionLabel}
                  </span>
                ) : (
                  <Image
                    src={sibling.swatch.url}
                    alt={sibling.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {product.options.map((option) => {
        if (product.siblings?.length && swatchNames.includes(option.name)) return null;

        return (
          <div key={option.name} className="space-y-2">
            <p className="font-eyebrow">{option.name}</p>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setSelectedOptions({ ...selectedOptions, [option.name]: value })
                    }
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm normal-case tracking-normal",
                      isSelected
                        ? "border-ink bg-blush"
                        : "border-ink/20 bg-cream hover:bg-warm-gray",
                    )}
                    aria-pressed={isSelected}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border border-ink/20">
          <button
            type="button"
            className="size-10"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            type="button"
            className="size-10"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <Button
          className="flex-1"
          disabled={!selectedVariant?.availableForSale || isPending}
          onClick={handleAdd}
        >
          {selectedVariant?.availableForSale ? "Add to cart" : "Sold out"}
        </Button>
      </div>
    </div>
  );
}

export function getInitialProductOptions(product: Product): Record<string, string> {
  const initial: Record<string, string> = {};
  for (const option of product.options) {
    initial[option.name] = option.values[0] ?? "";
  }
  return initial;
}
