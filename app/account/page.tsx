import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  getCustomerAccessToken,
  isCustomerAccountConfigured,
} from "@/lib/shopify/customer";

interface AccountPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { error } = await searchParams;
  const configured = isCustomerAccountConfigured();
  const token = configured ? await getCustomerAccessToken() : null;

  if (!configured) {
    return (
      <main className="container-glow section-padding-y">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="mb-4">Account</h1>
          <p className="mb-6 text-muted">
            Customer Account API credentials are not configured yet. Add{" "}
            <code className="text-sm">SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID</code> and{" "}
            <code className="text-sm">SHOPIFY_CUSTOMER_ACCOUNT_API_URL</code> to enable login.
          </p>
          <Button asChild variant="secondary">
            <Link href="/">Continue shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="container-glow section-padding-y">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="mb-4">Sign in</h1>
          {error && (
            <p className="mb-4 text-sm text-sale">
              {error === "auth-failed" && "Sign in was cancelled or failed."}
              {error === "token-exchange" && "Could not complete sign in. Try again."}
              {error === "not-configured" && "Account login is not configured."}
            </p>
          )}
          <p className="mb-6 text-muted">Access your orders and saved addresses.</p>
          <Button asChild>
            <Link href="/api/auth/customer/login">Sign in with Shopify</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container-glow section-padding-y">
      <h1 className="mb-8">Your account</h1>
      <nav className="mb-10 flex flex-wrap gap-4">
        <Link href="/account/orders" className="underline underline-offset-4">
          Orders
        </Link>
        <Link href="/account/addresses" className="underline underline-offset-4">
          Addresses
        </Link>
        <Link href="/api/auth/customer/logout" className="text-muted underline underline-offset-4">
          Sign out
        </Link>
      </nav>
      <p className="text-muted">
        Welcome back. Order history and address management will load from the Customer Account API
        once GraphQL queries are wired in Phase 5.
      </p>
    </main>
  );
}
