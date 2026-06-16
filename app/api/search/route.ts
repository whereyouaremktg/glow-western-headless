import { NextResponse } from "next/server";

import { commerceConfig } from "@/lib/config";
import { searchStorefront } from "@/lib/shopify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], collections: [] });
  }

  const { products, collections } = await searchStorefront(
    q,
    commerceConfig.predictiveSearch.maxResults,
  );

  return NextResponse.json({ products, collections });
}
