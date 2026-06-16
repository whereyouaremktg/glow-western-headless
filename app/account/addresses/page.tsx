import Link from "next/link";
import { redirect } from "next/navigation";

import { getCustomerAccessToken, isCustomerAccountConfigured } from "@/lib/shopify/customer";

export default async function AccountAddressesPage() {
  if (!isCustomerAccountConfigured()) redirect("/account");
  const token = await getCustomerAccessToken();
  if (!token) redirect("/account");

  return (
    <main className="container-glow section-padding-y">
      <Link href="/account" className="mb-6 inline-block text-sm text-muted hover:underline">
        ← Account
      </Link>
      <h1 className="mb-4">Addresses</h1>
      <p className="text-muted">
        Address CRUD will render here via Customer Account API GraphQL. You are signed in.
      </p>
    </main>
  );
}
