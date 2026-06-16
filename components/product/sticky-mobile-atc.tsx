"use client";
// Sticky mobile ATC bar tracks scroll position relative to the main purchase block.

import { useEffect, useState } from "react";

import { useCart } from "@/components/layout/cart-provider";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import type { Product, ProductVariant } from "@/types";

interface StickyMobileAtcProps {
  product: Product;
  variant: ProductVariant | null;
  purchaseBlockId?: string;
}

export function StickyMobileAtc({
  product,
  variant,
  purchaseBlockId = "product-purchase",
}: StickyMobileAtcProps) {
  const { addItem, isPending } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(purchaseBlockId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [purchaseBlockId]);

  if (!visible || !variant) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 p-4 backdrop-blur md:hidden">
      <div className="container-glow flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium normal-case">{product.title}</p>
          <Price money={variant.price} />
        </div>
        <Button
          disabled={!variant.availableForSale || isPending}
          onClick={() => addItem(variant.id, 1)}
          className="shrink-0"
        >
          {variant.availableForSale ? "Add to cart" : "Sold out"}
        </Button>
      </div>
    </div>
  );
}
