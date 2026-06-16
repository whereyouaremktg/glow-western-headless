import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/product/product-detail-client";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { FAQ } from "@/components/sections/faq";
import { RichHtml } from "@/components/sections/shared/rich-html";
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  buildProductMetadata,
} from "@/lib/seo";
import { commerceConfig } from "@/lib/config";
import { getCollection, getProduct, getProductsByHandles } from "@/lib/shopify";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const crossSellHandles = product.crossSellHandles.length
    ? product.crossSellHandles
    : null;

  const crossSellProducts = crossSellHandles
    ? await getProductsByHandles(crossSellHandles)
    : (
        await getCollection(commerceConfig.defaultCrossSellCollectionHandle, { first: 4 })
      )?.products.filter((p) => p.handle !== handle) ?? [];

  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/products/${handle}`;
  const productJsonLd = buildProductJsonLd(product, productUrl);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: product.title, url: `/products/${handle}` },
  ]);

  const faqItems =
    product.faqItems.length > 0
      ? product.faqItems
      : product.accordions.map((a) => ({
          question: a.title,
          answerHtml: a.bodyHtml,
        }));

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container-glow section-padding-y">
        <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">{product.title}</li>
          </ol>
        </nav>

        <ProductDetailClient product={product} />

        {product.callouts.length > 0 && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {product.callouts.map((callout) => (
              <div key={callout.title} className="rounded-lg bg-warm-gray p-6">
                <p className="mb-2 font-eyebrow">{callout.icon}</p>
                <h3 className="mb-2 text-base">{callout.title}</h3>
                <p className="text-sm text-muted">{callout.body}</p>
              </div>
            ))}
          </div>
        )}

        {product.descriptionHtml && (
          <div className="mx-auto mt-16 max-w-3xl">
            <RichHtml html={product.descriptionHtml} />
          </div>
        )}

        {product.accordions.length > 0 && (
          <div className="mx-auto mt-16 max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
            {product.accordions.map((item) => (
              <details key={item.title} className="group py-4">
                <summary className="cursor-pointer list-none font-medium normal-case tracking-normal [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.title}
                    <span className="text-muted transition group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <div className="pt-3 text-muted">
                  <RichHtml html={item.bodyHtml} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {crossSellProducts.length > 0 && (
        <CollectionGrid
          id="pdp-cross-sell"
          heading="Complete your routine"
          variant="products"
          products={crossSellProducts.slice(0, 4)}
          columns={4}
          carouselOnMobile
        />
      )}

      {faqItems.length > 0 && (
        <FAQ id="pdp-faq" heading="Product FAQ" items={faqItems} theme="warm-gray" />
      )}
    </main>
  );
}
