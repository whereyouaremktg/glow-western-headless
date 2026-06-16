import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CollectionProductGrid } from "@/components/collection/collection-product-grid";
import { CollectionToolbar } from "@/components/collection/collection-toolbar";
import { RichHtml } from "@/components/sections/shared/rich-html";
import { getCollectionProducts } from "@/lib/shopify";

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{
    sort?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
    filter?: string | string[];
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionProducts(handle, { first: 1 });
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.seo.title ?? collection.title,
    description: collection.seo.description ?? collection.description.slice(0, 160),
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { handle } = await params;
  const sp = await searchParams;
  const filterInputs = sp.filter
    ? Array.isArray(sp.filter)
      ? sp.filter
      : [sp.filter]
    : [];

  const collection = await getCollectionProducts(handle, {
    first: 24,
    sort: sp.sort,
    availability: sp.availability,
    minPrice: sp.minPrice,
    maxPrice: sp.maxPrice,
    filterInputs,
  });

  if (!collection) notFound();

  return (
    <main className="container-glow section-padding-y">
      <header className="mb-10 grid gap-8 md:grid-cols-[1fr_280px] md:items-end">
        <div>
          <h1 className="mb-4">{collection.title}</h1>
          {collection.description && (
            <RichHtml html={collection.description} className="max-w-2xl text-muted" />
          )}
        </div>
        {collection.image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-warm-gray">
            <Image
              src={collection.image.url}
              alt={collection.image.altText ?? collection.title}
              fill
              className="object-cover"
              sizes="280px"
              priority
            />
          </div>
        )}
      </header>

      <Suspense fallback={null}>
        <CollectionToolbar filters={collection.filters} productCount={collection.products.length} />
      </Suspense>

      <CollectionProductGrid
        key={`${sp.sort ?? ""}-${sp.availability ?? ""}-${filterInputs.join(",")}`}
        handle={handle}
        initialProducts={collection.products}
        initialPageInfo={collection.pageInfo}
        searchParams={{
          sort: sp.sort,
          availability: sp.availability,
          minPrice: sp.minPrice,
          maxPrice: sp.maxPrice,
          filterInputs,
        }}
      />
    </main>
  );
}
