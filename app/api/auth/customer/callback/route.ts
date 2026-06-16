import { NextResponse } from "next/server";

import {
  clearCustomerAccessToken,
  isCustomerAccountConfigured,
  setCustomerAccessToken,
} from "@/lib/shopify/customer";

export async function GET(request: Request) {
  if (!isCustomerAccountConfigured()) {
    return NextResponse.redirect(new URL("/account?error=not-configured", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/account?error=auth-failed", request.url));
  }

  const tokenUrl = `${process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL!.replace(/\/$/, "")}/oauth/token`;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/customer/callback`;

  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID!,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/account?error=token-exchange", request.url));
  }

  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (tokens.access_token) {
    await setCustomerAccessToken(tokens.access_token);
  } else {
    await clearCustomerAccessToken();
  }

  return NextResponse.redirect(new URL("/account", request.url));
}
