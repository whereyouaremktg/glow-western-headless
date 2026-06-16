"use client";
// Slide-out cart drawer — open/close state and line-item interactions are client-only.

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { useCart } from "@/components/layout/cart-provider";
import { commerceConfig } from "@/lib/config";
import { formatMoney } from "@/lib/utils";

function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const threshold = commerceConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="space-y-2 border-b border-ink/10 px-4 py-3">
      <p className="text-center text-sm">
        {remaining > 0
          ? `Add ${formatMoney({ amount: remaining.toFixed(2), currencyCode: "USD" })} for free shipping`
          : "You've unlocked free shipping!"}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-warm-gray">
        <div className="h-full bg-blush-strong transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateLine, removeLine, isPending } = useCart();

  if (!isOpen) return null;

  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="absolute right-0 flex h-full w-full max-w-md flex-col bg-cream shadow-xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
          <h2 className="font-heading text-lg tracking-[0.1em]">
            Cart {cart ? `(${cart.totalQuantity})` : ""}
          </h2>
          <button type="button" onClick={closeCart} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        {cart && cart.totalQuantity > 0 ? (
          <>
            <FreeShippingBar subtotal={subtotal} />
            <ul className="flex-1 overflow-y-auto px-4 py-4">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-3 border-b border-ink/10 py-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-warm-gray">
                    {line.merchandise.product.featuredImage && (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      className="font-medium normal-case tracking-normal hover:underline"
                      onClick={closeCart}
                    >
                      {line.merchandise.product.title}
                    </Link>
                    {line.merchandise.selectedOptions.map((opt) => (
                      <p key={opt.name} className="text-xs text-muted">
                        {opt.name}: {opt.value}
                      </p>
                    ))}
                    <Price money={line.cost.totalAmount} />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="size-8 rounded border border-ink/20"
                        onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))}
                        disabled={isPending}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        className="size-8 rounded border border-ink/20"
                        onClick={() => updateLine(line.id, line.quantity + 1)}
                        disabled={isPending}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-muted underline"
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
            <div className="border-t border-ink/10 px-4 py-4">
              <div className="mb-4 flex justify-between text-sm">
                <span>Subtotal</span>
                <Price money={cart.cost.subtotalAmount} />
              </div>
              <Button asChild className="w-full">
                <a href={cart.checkoutUrl}>Checkout</a>
              </Button>
              <Button variant="ghost" className="mt-2 w-full" asChild>
                <Link href="/cart" onClick={closeCart}>
                  View cart
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <p className="text-muted">Your cart is empty.</p>
            <Button asChild onClick={closeCart}>
              <Link href="/collections/the-detangling-brush">Shop brushes</Link>
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}
