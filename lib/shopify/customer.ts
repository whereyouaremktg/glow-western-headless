import { cookies } from "next/headers";

const CUSTOMER_TOKEN_COOKIE = "glow_customer_token";

export function isCustomerAccountConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID &&
      process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL &&
      process.env.NEXT_PUBLIC_SITE_URL,
  );
}

export async function getCustomerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

export function buildCustomerLoginUrl(state?: string): string {
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID!;
  const baseUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL!.replace(/\/$/, "");
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/customer/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email customer-account-api:full",
    ...(state ? { state } : {}),
  });
  return `${baseUrl}/oauth/authorize?${params.toString()}`;
}

export function buildCustomerLogoutUrl(): string {
  const baseUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL!.replace(/\/$/, "");
  const postLogout = `${process.env.NEXT_PUBLIC_SITE_URL}/account`;
  return `${baseUrl}/logout?post_logout_redirect_uri=${encodeURIComponent(postLogout)}`;
}

export async function setCustomerAccessToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearCustomerAccessToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
}
