/** Parse collection URL search params into Storefront API filter/sort inputs. */

export type CollectionSortKey =
  | "best-selling"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "title-asc";

const SORT_MAP: Record<
  CollectionSortKey,
  { sortKey: string; reverse: boolean }
> = {
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  newest: { sortKey: "CREATED", reverse: true },
  "title-asc": { sortKey: "TITLE", reverse: false },
};

export function parseCollectionSort(sort?: string): {
  sortKey: string;
  reverse: boolean;
} {
  const key = (sort ?? "best-selling") as CollectionSortKey;
  return SORT_MAP[key] ?? SORT_MAP["best-selling"];
}

export function buildProductFilters(params: {
  availability?: string;
  minPrice?: string;
  maxPrice?: string;
  filterInputs?: string[];
}): Record<string, unknown>[] {
  const filters: Record<string, unknown>[] = [];

  if (params.availability === "1") {
    filters.push({ available: true });
  }

  const min = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const max = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  if (min !== undefined || max !== undefined) {
    filters.push({
      price: {
        ...(min !== undefined && !Number.isNaN(min) ? { min } : {}),
        ...(max !== undefined && !Number.isNaN(max) ? { max } : {}),
      },
    });
  }

  for (const input of params.filterInputs ?? []) {
    try {
      filters.push(JSON.parse(input) as Record<string, unknown>);
    } catch {
      // ignore malformed filter inputs
    }
  }

  return filters;
}

export function handlesToProductQuery(handles: string[]): string {
  return handles.map((h) => `handle:${h}`).join(" OR ");
}
