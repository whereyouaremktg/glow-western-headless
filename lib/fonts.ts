import localFont from "next/font/local";

/** Gotham Ultra — headings & buttons (self-hosted from OLD-theme asset) */
export const gothamUltra = localFont({
  src: "../app/fonts/gotham-ultra.otf",
  variable: "--font-heading",
  display: "swap",
  weight: "400",
  style: "normal",
});

/**
 * Proxima Nova body font — add licensed woff2 to public/fonts/proxima-nova-regular.woff2
 * and swap this for localFont. Interim: system stack via CSS variable.
 */
export const bodyFontClass = "font-body";
