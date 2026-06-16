"use client";
// Mobile drawer nav + search/cart toggles — client interactivity for overlay menus.

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/layout/cart-provider";
import { PredictiveSearch } from "@/components/layout/predictive-search";
import { shopifyPathFromUrl } from "@/lib/utils";
import type { Menu as NavMenu } from "@/types";

interface HeaderProps {
  menu: NavMenu;
}

export function Header({ menu }: HeaderProps) {
  const { cart, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
        <div className="container-glow flex h-16 items-center justify-between gap-4">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </button>

          <Link href="/" className="font-heading text-lg tracking-[0.12em]">
            Glow Beauty Hair
          </Link>

          <nav className="hidden flex-1 justify-center md:flex" aria-label="Main">
            <ul className="flex items-center gap-8">
              {menu.items.map((item) => (
                <li key={item.url}>
                  <Link
                    href={shopifyPathFromUrl(item.url)}
                    className="text-sm font-medium normal-case tracking-normal hover:text-muted"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="size-5" />
            </button>
            <Link href="/account" aria-label="Account">
              <User className="size-5" />
            </Link>
            <button type="button" onClick={openCart} className="relative" aria-label="Open cart">
              <ShoppingBag className="size-5" />
              {cart && cart.totalQuantity > 0 && (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-ink text-[10px] text-cream">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <nav className="absolute left-0 h-full w-80 max-w-[85vw] bg-cream p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-heading tracking-[0.1em]">Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <ul className="space-y-4">
              {menu.items.map((item) => (
                <li key={item.url}>
                  <Link
                    href={shopifyPathFromUrl(item.url)}
                    className="block text-lg font-medium normal-case"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.items && item.items.length > 0 && (
                    <ul className="mt-2 space-y-2 pl-4">
                      {item.items.map((child) => (
                        <li key={child.url}>
                          <Link
                            href={shopifyPathFromUrl(child.url)}
                            className="text-sm text-muted"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <PredictiveSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
