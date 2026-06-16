import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/ui/product-card";
import { searchStorefront } from "@/lib/shopify";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results =
    query.length >= 2 ? await searchStorefront(query, 24) : { products: [], collections: [] };

  return (
    <main className="container-glow section-padding-y">
      <h1 className="mb-8">Search</h1>

      {!query && <p className="text-muted">Enter a search term using the header search.</p>}

      {query && query.length < 2 && (
        <p className="text-muted">Type at least 2 characters to search.</p>
      )}

      {query.length >= 2 && (
        <div className="space-y-10">
          {results.collections.length > 0 && (
            <section>
              <h2 className="mb-4 text-base">Collections</h2>
              <ul className="flex flex-wrap gap-3">
                {results.collections.map((collection) => (
                  <li key={collection.handle}>
                    <Link
                      href={`/collections/${collection.handle}`}
                      className="rounded-full border border-ink/20 px-4 py-2 text-sm hover:bg-warm-gray"
                    >
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="mb-6 text-base">
              {results.products.length} product{results.products.length === 1 ? "" : "s"}
            </h2>
            {results.products.length > 0 ? (
              <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {results.products.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No products found for &ldquo;{query}&rdquo;.</p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
