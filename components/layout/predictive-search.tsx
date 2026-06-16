"use client";
// Predictive search overlay — live query input and result panel require client state.

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Price } from "@/components/ui/price";
import { commerceConfig } from "@/lib/config";
import type { Product } from "@/types";

interface PredictiveSearchProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResults {
  products: Product[];
  collections: { handle: string; title: string }[];
}

export function PredictiveSearch({ open, onClose }: PredictiveSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults(null);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) setResults(await res.json());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close search" onClick={onClose} />
      <div className="relative mx-auto mt-16 w-full max-w-2xl px-4">
        <div className="rounded-lg border-2 border-ink bg-cream p-4 shadow-[4px_4px_0_0_#171819]">
          <div className="mb-4 flex items-center gap-2">
            <Search className="size-5 shrink-0" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brushes, collections…"
              className="border-0 shadow-none focus-visible:ring-0"
            />
            <button type="button" onClick={onClose} aria-label="Close">
              <X className="size-5" />
            </button>
          </div>
          {query.length < 2 && (
            <p className="text-sm text-muted">{commerceConfig.predictiveSearch.suggestedHeading}</p>
          )}
          {results && (
            <div className="max-h-[60vh] space-y-4 overflow-y-auto">
              {results.products.length > 0 && (
                <div>
                  <p className="mb-2 font-eyebrow">Products</p>
                  <ul className="space-y-2">
                    {results.products.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.handle}`}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-warm-gray"
                          onClick={onClose}
                        >
                          {product.featuredImage && (
                            <div className="relative size-12 overflow-hidden rounded bg-warm-gray">
                              <Image src={product.featuredImage.url} alt="" fill className="object-cover" sizes="48px" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium normal-case">{product.title}</p>
                            <Price money={product.priceRange.minVariantPrice} />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.collections.length > 0 && (
                <div>
                  <p className="mb-2 font-eyebrow">Collections</p>
                  <ul className="space-y-1">
                    {results.collections.map((c) => (
                      <li key={c.handle}>
                        <Link href={`/collections/${c.handle}`} className="text-sm hover:underline" onClick={onClose}>
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href={`/search?q=${encodeURIComponent(query)}`} className="text-sm underline" onClick={onClose}>
                View all results
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
