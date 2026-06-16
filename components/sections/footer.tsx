import Link from "next/link";

import { EmailCapture } from "@/components/sections/email-capture";
import { shopifyPathFromUrl } from "@/lib/utils";
import type { FooterProps } from "@/types";

export function Footer({ menus, newsletter, social, legalName }: FooterProps) {
  return (
    <footer className="bg-ink text-cream">
      <div className="container-glow section-padding space-y-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {menus.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="mb-4 text-sm tracking-[0.14em]">{group.heading}</h2>
              <ul className="space-y-2 text-sm text-cream/80">
                {group.menu.items.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={shopifyPathFromUrl(item.url)}
                      className="hover:text-cream"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-cream/15 pt-10">
          <EmailCapture {...newsletter} id="footer-newsletter" theme="ink" embedded />
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-8 text-sm text-cream/70 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {legalName}</p>
          <ul className="flex gap-4">
            {social.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-eyebrow hover:text-cream"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
