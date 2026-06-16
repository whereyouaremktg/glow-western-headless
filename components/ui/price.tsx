import { cn, formatMoney } from "@/lib/utils";
import type { Money, Product } from "@/types";

interface PriceProps {
  money: Money;
  className?: string;
  compareAt?: Money | null;
}

export function Price({ money, compareAt, className }: PriceProps) {
  const isOnSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(money.amount);

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn(isOnSale && "text-sale")}>{formatMoney(money)}</span>
      {isOnSale && compareAt && (
        <span className="text-sm text-muted line-through">{formatMoney(compareAt)}</span>
      )}
    </span>
  );
}

interface ProductPriceProps {
  product: Product;
  className?: string;
}

export function ProductPrice({ product, className }: ProductPriceProps) {
  const { minVariantPrice } = product.priceRange;
  const { minVariantPrice: compareMin } = product.compareAtPriceRange;
  const hasRange =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

  const label = hasRange ? `From ${formatMoney(minVariantPrice)}` : formatMoney(minVariantPrice);

  const isOnSale =
    compareMin && parseFloat(compareMin.amount) > parseFloat(minVariantPrice.amount);

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn(isOnSale && "text-sale")}>{label}</span>
      {isOnSale && compareMin && (
        <span className="text-sm text-muted line-through">{formatMoney(compareMin)}</span>
      )}
    </span>
  );
}
