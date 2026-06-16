import { NextResponse } from "next/server";

import { clearCustomerAccessToken, isCustomerAccountConfigured } from "@/lib/shopify/customer";

export async function GET(request: Request) {
  if (isCustomerAccountConfigured()) {
    await clearCustomerAccessToken();
  }
  return NextResponse.redirect(new URL("/account", request.url));
}
