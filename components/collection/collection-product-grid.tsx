"use client";
// Load-more pagination requires client fetch after initial RSC render.

import { useState, useTransition } from "react";

import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { loadMoreCollectionProductsAction } from "@/lib/shopify/actions/collection";
import type { Product } from "@/types";

interface CollectionProductGridProps {
  handle: string;
  initialProducts: Product[];
  initialPageInfo: { hasNextPage: boolean; endCursor: string | null };
  searchParams: {
    sort?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
    filterInputs?: string[];
  };
}

export function CollectionProductGrid({
  handle,
  initialProducts,
  initialPageInfo,
  searchParams,
}: CollectionProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    if (!pageInfo.endCursor) return;
    startTransition(async () => {
      const result = await loadMoreCollectionProductsAction({
        handle,
        after: pageInfo.endCursor!,
        ...searchParams,
      });
      setProducts((prev) => [...prev, ...result.products]);
      setPageInfo(result.pageInfo);
    });
  };

  return (
    <div>
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <li key={product.id}>
            <ProductCard product={product} priority={index < 4} />
          </li>
        ))}
      </ul>

      {pageInfo.hasNextPage && (
        <div className="mt-12 text-center">
          <Button variant="secondary" onClick={loadMore} disabled={isPending}>
            {isPending ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
