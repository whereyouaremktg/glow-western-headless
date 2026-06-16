import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CollectionGridProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionHeader } from "./shared/section-header";
import { SectionShell } from "./shared/section-shell";

export function CollectionGrid(props: CollectionGridProps) {
  const { heading, variant, products, collections, columns, carouselOnMobile, cta } = props;

  const gridCols =
    columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";

  const listClass = cn(
    "grid gap-6",
    gridCols,
    carouselOnMobile &&
      "max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:overflow-x-auto max-md:pb-4 max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden",
  );

  return (
    <SectionShell {...props}>
      <MotionSection>
        <SectionHeader heading={heading} />
        {variant === "products" && products && (
          <ul className={listClass}>
            {products.map((product, i) => (
              <li
                key={product.id}
                className={cn(carouselOnMobile && "max-md:w-[min(85%,280px)] max-md:shrink-0 max-md:snap-center")}
              >
                <ProductCard product={product} priority={i < 4} />
              </li>
            ))}
          </ul>
        )}
        {variant === "collections" && collections && (
          <ul className={listClass}>
            {collections.map((collection) => (
              <li
                key={collection.id}
                className={cn(carouselOnMobile && "max-md:w-[min(85%,280px)] max-md:shrink-0 max-md:snap-center")}
              >
                <Link href={`/collections/${collection.handle}`} className="group block space-y-3">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-warm-gray">
                    {collection.image && (
                      <Image
                        src={collection.image.url}
                        alt={collection.image.altText ?? collection.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <h3 className="font-medium normal-case tracking-normal">{collection.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {cta && (
          <div className="mt-8 text-center">
            <Button asChild variant={cta.variant ?? "secondary"}>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        )}
      </MotionSection>
    </SectionShell>
  );
}
