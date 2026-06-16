import type { Metadata } from "next";

import { CartPageClient } from "@/app/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <main className="container-glow section-padding-y">
      <h1 className="mb-8">Your cart</h1>
      <CartPageClient />
    </main>
  );
}
