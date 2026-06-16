"use client";
// Cart fallback page reuses cart context for line updates.

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/layout/cart-provider";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { commerceConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils";

function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const threshold = commerceConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <p className="mb-6 text-center text-sm text-muted">
      {remaining > 0
        ? `Add ${formatMoney({ amount: remaining.toFixed(2), currencyCode: "USD" })} for free shipping`
        : "You've unlocked free shipping!"}
    </p>
  );
}

export function CartPageClient() {
  const { cart, updateLine, removeLine, isPending } = useCart();

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-6 text-muted">Your cart is empty.</p>
        <Button asChild>
          <Link href="/collections/the-detangling-brush">Shop brushes</Link>
        </Button>
      </div>
    );
  }

  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);

  return (
    <div className="mx-auto max-w-3xl">
      <FreeShippingBar subtotal={subtotal} />
      <ul className="divide-y divide-ink/10">
        {cart.lines.map((line) => (
          <li key={line.id} className="flex gap-4 py-6">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-warm-gray">
              {line.merchandise.product.featuredImage && (
                <Image
                  src={line.merchandise.product.featuredImage.url}
                  alt={line.merchandise.product.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Link
                href={`/products/${line.merchandise.product.handle}`}
                className="font-medium normal-case tracking-normal hover:underline"
              >
                {line.merchandise.product.title}
              </Link>
              <Price money={line.cost.totalAmount} />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="size-8 rounded border border-ink/20"
                  onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))}
                  disabled={isPending}
                >
                  −
                </button>
                <span>{line.quantity}</span>
                <button
                  type="button"
                  className="size-8 rounded border border-ink/20"
                  onClick={() => updateLine(line.id, line.quantity + 1)}
                  disabled={isPending}
                >
                  +
                </button>
                <button
                  type="button"
                  className="ml-auto text-sm text-muted underline"
                  onClick={() => removeLine(line.id)}
                  disabled={isPending}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 border-t border-ink/10 pt-6">
        <div className="mb-4 flex justify-between">
          <span>Subtotal</span>
          <Price money={cart.cost.subtotalAmount} />
        </div>
        <Button asChild className="w-full">
          <a href={cart.checkoutUrl}>Checkout</a>
        </Button>
      </div>
    </div>
  );
}
