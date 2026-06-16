import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ProductPrice } from "@/components/ui/price";
import { ReviewStars } from "@/components/ui/review-stars";
import { commerceConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

function getBadgeLabel(tags: string[]): string | null {
  for (const group of commerceConfig.badgeTagGroups) {
    if (tags.includes(group.tag)) return group.label;
  }
  return null;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const badge = getBadgeLabel(product.tags);
  const image = product.featuredImage;

  return (
    <article className={cn("group flex flex-col gap-3", className)}>
      <Link href={`/products/${product.handle}`} className="relative block overflow-hidden rounded-lg bg-warm-gray">
        <div className="relative aspect-[4/5] w-full">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">No image</div>
          )}
          {badge && (
            <Badge className="absolute left-3 top-3">{badge}</Badge>
          )}
          {!product.availableForSale && (
            <Badge variant="secondary" className="absolute right-3 top-3">
              Sold out
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-1.5 px-1">
        {product.rating && (
          <ReviewStars rating={product.rating.value} count={product.rating.count} />
        )}
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-body text-base font-medium normal-case tracking-normal text-ink transition-colors hover:text-muted">
            {product.title}
          </h3>
        </Link>
        <ProductPrice product={product} />
      </div>
    </article>
  );
}
