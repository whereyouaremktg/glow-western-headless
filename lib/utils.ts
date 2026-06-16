import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(money: { amount: string; currencyCode: string }): string {
  const amount = parseFloat(money.amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function shopifyPathFromUrl(url: string): string {
  try {
    const parsed = new URL(url, "https://placeholder.local");
    return parsed.pathname;
  } catch {
    return url;
  }
}
