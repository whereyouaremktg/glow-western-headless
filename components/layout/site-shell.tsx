import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/components/layout/cart-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/sections/footer";
import { homeContent } from "@/lib/content/home";
import { fetchCartAction } from "@/lib/shopify/actions/cart";
import { getMenu } from "@/lib/shopify";
import type { Menu } from "@/types";

const fallbackMenu: Menu = {
  items: [
    { title: "Shop", url: "/collections/the-detangling-brush" },
    { title: "About", url: "/pages/about" },
    { title: "FAQ", url: "/pages/faq" },
  ],
};

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [cart, mainMenu, footerMenu, followMenu, wholesaleMenu] = await Promise.all([
    fetchCartAction(),
    getMenu("main-menu-copy"),
    getMenu("footer"),
    getMenu("follow-us"),
    getMenu("wholesale"),
  ]);

  const footerProps = {
    ...homeContent.footer,
    menus: [
      { heading: "Glow Beauty", menu: footerMenu ?? homeContent.footer.menus[0]!.menu },
      { heading: "Connect", menu: followMenu ?? homeContent.footer.menus[1]!.menu },
      { heading: "Wholesale", menu: wholesaleMenu ?? homeContent.footer.menus[2]!.menu },
    ],
  };

  return (
    <CartProvider initialCart={cart}>
      <AnnouncementBar />
      <Header menu={mainMenu ?? fallbackMenu} />
      {children}
      <Footer {...footerProps} />
      <CartDrawer />
    </CartProvider>
  );
}
