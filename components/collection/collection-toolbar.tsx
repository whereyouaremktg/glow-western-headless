"use client";
// Collection toolbar updates URL search params for sort/filter state without full page reload.

import { useRouter, useSearchParams } from "next/navigation";

import type { ProductFilterGroup } from "@/types";

const SORT_OPTIONS = [
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
  { value: "title-asc", label: "A–Z" },
] as const;

interface CollectionToolbarProps {
  filters: ProductFilterGroup[];
  productCount: number;
}

export function CollectionToolbar({ filters, productCount }: CollectionToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const activeFilters = searchParams.getAll("filter");

  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <p className="text-sm text-muted">{productCount} products</p>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={searchParams.get("availability") === "1"}
            onChange={(e) =>
              updateParams({ availability: e.target.checked ? "1" : null })
            }
          />
          In stock only
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-eyebrow">Sort</span>
          <select
            value={searchParams.get("sort") ?? "best-selling"}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="rounded-lg border border-ink/20 bg-cream px-3 py-2 normal-case tracking-normal"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.flatMap((group) =>
            group.values.slice(0, 6).map((value) => {
              const isActive = activeFilters.includes(value.input);
              return (
                <button
                  key={value.id}
                  type="button"
                  onClick={() => {
                    const next = isActive
                      ? activeFilters.filter((f) => f !== value.input)
                      : [...activeFilters, value.input];
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("filter");
                    next.forEach((f) => params.append("filter", f));
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className={`rounded-full border px-3 py-1 text-xs normal-case tracking-normal ${
                    isActive ? "border-ink bg-blush" : "border-ink/20 hover:bg-warm-gray"
                  }`}
                >
                  {value.label} ({value.count})
                </button>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
}
