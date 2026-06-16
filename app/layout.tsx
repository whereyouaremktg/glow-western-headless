import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { bodyFontClass, gothamUltra } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Glow Beauty Hair",
    template: "%s | Glow Beauty Hair",
  },
  description: "Functional luxury hair tools — stylist-created, salon-tested.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={gothamUltra.variable}>
      <body className={bodyFontClass}>
        <SiteShell>{children}</SiteShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
