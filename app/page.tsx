import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/ui/price";
import { ProductCard } from "@/components/ui/product-card";
import { ReviewStars } from "@/components/ui/review-stars";
import { isShopifyConfigured, verifyStorefrontConnection } from "@/lib/shopify";

export default async function HomePage() {
  const configured = isShopifyConfigured();
  const verification = configured ? await verifyStorefrontConnection() : null;

  return (
    <main className="min-h-screen">
      <div className="border-b border-powder/60 bg-powder/40 py-3 text-center font-eyebrow">
        Phase 2 foundation — design tokens, UI primitives, Shopify client
      </div>

      <div className="container-glow section-padding space-y-16">
        <header className="space-y-4 text-center">
          <p className="font-eyebrow">Glow Beauty Hair</p>
          <h1 className="text-4xl md:text-5xl">Headless Storefront</h1>
          <p className="mx-auto max-w-xl text-muted">
            Functional luxury — stylist-created, salon-tested. This page verifies Phase 2
            foundation: tokens, primitives, and live Storefront API connectivity.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button>Shop Brushes</Button>
            <Button variant="secondary">Our Story</Button>
          </div>
        </header>

        <section aria-labelledby="tokens-heading" className="space-y-6">
          <h2 id="tokens-heading" className="text-2xl">
            Design Tokens
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-7">
            {(
              [
                ["blush", "bg-blush"],
                ["blush-strong", "bg-blush-strong"],
                ["cream", "bg-cream border border-ink/10"],
                ["powder", "bg-powder"],
                ["warm-gray", "bg-warm-gray"],
                ["ink", "bg-ink"],
                ["sale", "bg-sale"],
              ] as const
            ).map(([name, cls]) => (
              <div key={name} className="space-y-2 text-center">
                <div className={`h-16 rounded-lg ${cls}`} />
                <span className="font-chip text-muted">{name}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="primitives-heading" className="space-y-6">
          <h2 id="primitives-heading" className="text-2xl">
            UI Primitives
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Buttons & Input</CardTitle>
                <CardDescription>Gotham Ultra, italic uppercase, hard shadow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">
                    Secondary
                  </Button>
                  <Button variant="ghost" size="sm">
                    Ghost
                  </Button>
                </div>
                <Input placeholder="Email address" type="email" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges & Price</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Best Seller</Badge>
                  <Badge variant="sale">Sale</Badge>
                  <Badge variant="outline">Limited</Badge>
                </div>
                <Price money={{ amount: "35.00", currencyCode: "USD" }} />
                <Price
                  money={{ amount: "28.00", currencyCode: "USD" }}
                  compareAt={{ amount: "35.00", currencyCode: "USD" }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Stars</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ReviewStars rating={4.9} count={2400} />
                <ReviewStars rating={3.5} count={12} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section aria-labelledby="shopify-heading" className="space-y-6">
          <h2 id="shopify-heading" className="text-2xl">
            Storefront API
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>
                Requires <code className="text-ink">.env.local</code> with Shopify credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!configured ? (
                <p className="rounded-lg border border-ink/10 bg-warm-gray/50 p-4 text-sm">
                  Not configured. Copy <code>.env.example</code> to <code>.env.local</code> and add
                  your Storefront API token.
                </p>
              ) : verification?.ok && verification.product ? (
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-sm">
                    <span className="inline-block size-2 rounded-full bg-green-700" aria-hidden />
                    Connected — fetched <strong>{verification.product.title}</strong> (
                    {verification.product.handle})
                  </p>
                  <div className="max-w-xs">
                    <ProductCard product={verification.product} priority />
                  </div>
                </div>
              ) : (
                <p className="rounded-lg border border-sale/30 bg-sale/5 p-4 text-sm text-sale">
                  {verification?.error ?? "Connection failed"}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
