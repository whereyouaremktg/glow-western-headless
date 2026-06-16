import { NextResponse } from "next/server";

import { buildCustomerLoginUrl, isCustomerAccountConfigured } from "@/lib/shopify/customer";

export async function GET() {
  if (!isCustomerAccountConfigured()) {
    return NextResponse.redirect(new URL("/account?error=not-configured", process.env.NEXT_PUBLIC_SITE_URL));
  }

  return NextResponse.redirect(buildCustomerLoginUrl());
}
