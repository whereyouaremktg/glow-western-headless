import Link from "next/link";
import { redirect } from "next/navigation";

import { getCustomerAccessToken, isCustomerAccountConfigured } from "@/lib/shopify/customer";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  if (!isCustomerAccountConfigured()) redirect("/account");
  const token = await getCustomerAccessToken();
  if (!token) redirect("/account");

  return (
    <main className="container-glow section-padding-y">
      <Link href="/account/orders" className="mb-6 inline-block text-sm text-muted hover:underline">
        ← Orders
      </Link>
      <h1 className="mb-4">Order {id}</h1>
      <p className="text-muted">Order detail will render here via Customer Account API GraphQL.</p>
    </main>
  );
}
