"use server";

import { getCollectionProducts } from "@/lib/shopify";

export async function loadMoreCollectionProductsAction(input: {
  handle: string;
  after: string;
  sort?: string;
  availability?: string;
  minPrice?: string;
  maxPrice?: string;
  filterInputs?: string[];
}) {
  const result = await getCollectionProducts(input.handle, {
    first: 24,
    after: input.after,
    sort: input.sort,
    availability: input.availability,
    minPrice: input.minPrice,
    maxPrice: input.maxPrice,
    filterInputs: input.filterInputs,
  });

  if (!result) return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };

  return {
    products: result.products,
    pageInfo: result.pageInfo,
  };
}
