import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProductPrice } from "@/components/ui/price";
import { ReviewStars } from "@/components/ui/review-stars";
import { cn } from "@/lib/utils";
import type { FeaturedProductProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionShell } from "./shared/section-shell";

export function FeaturedProduct(props: FeaturedProductProps) {
  const { product, eyebrow, framing, mediaSide } = props;
  const image = product.featuredImage;

  return (
    <SectionShell {...props}>
      <MotionSection>
        <div
          className={cn(
            "grid items-center gap-8 md:grid-cols-2 md:gap-12",
            mediaSide === "right" && "md:[&>*:first-child]:order-2",
          )}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg bg-warm-gray">
            {image && (
              <Image
                src={image.url}
                alt={image.altText ?? product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="space-y-4">
            {eyebrow && <p className="font-eyebrow">{eyebrow}</p>}
            <h2 className="text-2xl md:text-3xl">{product.title}</h2>
            {product.subtitle && <p className="text-lg text-muted">{product.subtitle}</p>}
            {product.rating && (
              <ReviewStars rating={product.rating.value} count={product.rating.count} />
            )}
            <ProductPrice product={product} className="text-xl" />
            {framing && <p className="text-muted">{framing}</p>}
            <Button asChild>
              <Link href={`/products/${product.handle}`}>Shop now</Link>
            </Button>
          </div>
        </div>
      </MotionSection>
    </SectionShell>
  );
}
