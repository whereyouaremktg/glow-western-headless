import { getCollection, getMenu, getProduct, getProducts } from "@/lib/shopify";
import { homeContent } from "@/lib/content/home";
import type {
  BeforeAfterProps,
  CollectionGridProps,
  FeaturedProductProps,
  FounderStoryProps,
  HeroProps,
  ResponsiveImage,
  ShopifyImage,
  SplitHeroProps,
  VideoHeroProps,
} from "@/types";

import type { HomeSection } from "./types";

function toResponsiveImage(image: ShopifyImage | null, fallbackAlt: string): ResponsiveImage {
  const img = image ?? {
    url: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png",
    altText: fallbackAlt,
    width: 1200,
    height: 1200,
  };
  return { desktop: img };
}

export async function getHomePageSections(): Promise<HomeSection[]> {
  const [featuredProduct, detanglingCollection, lineupProducts, footerMenu, footerFollow, footerWholesale] =
    await Promise.all([
      getProduct("glow-beauty-hair-brush"),
      getCollection("the-detangling-brush", { first: 6 }),
      getProducts({ first: 6 }),
      getMenu("footer"),
      getMenu("follow-us"),
      getMenu("wholesale"),
    ]);

  const heroImage =
    featuredProduct?.featuredImage ??
    detanglingCollection?.products[0]?.featuredImage ??
    lineupProducts[0]?.featuredImage ??
    null;

  const hero: HeroProps = {
    ...homeContent.hero,
    image: toResponsiveImage(heroImage, homeContent.hero.heading),
  };

  const featured: FeaturedProductProps | null = featuredProduct
    ? {
        id: "home-featured-product",
        product: featuredProduct,
        eyebrow: "Featured",
        framing:
          "Detangles wet or dry hair without pulling. Metal bristles exfoliate the scalp and add shine.",
        mediaSide: "left",
      }
    : null;

  const collectionGrid: CollectionGridProps = {
    id: "home-lineup",
    heading: "The LINEUP",
    variant: "products",
    products: detanglingCollection?.products.length
      ? detanglingCollection.products
      : lineupProducts,
    columns: 3,
    carouselOnMobile: true,
    cta: { label: "View all", href: "/collections/the-detangling-brush", variant: "secondary" },
  };

  const splitDetangling: SplitHeroProps = {
    ...homeContent.splitHeroDetangling,
    image: toResponsiveImage(
      featuredProduct?.featuredImage ?? heroImage,
      homeContent.splitHeroDetangling.heading,
    ),
  };

  const smoothingProduct = lineupProducts.find((p) => p.handle.includes("smoothing"));
  const splitSmoothing: SplitHeroProps = {
    ...homeContent.splitHeroSmoothing,
    image: toResponsiveImage(
      smoothingProduct?.featuredImage ?? heroImage,
      homeContent.splitHeroSmoothing.heading,
    ),
  };

  const videoHero: VideoHeroProps | null = homeContent.videoHero.videoUrl
    ? {
        ...homeContent.videoHero,
        poster: featuredProduct?.featuredImage ?? undefined,
      }
    : null;

  const founderStory: FounderStoryProps = {
    ...homeContent.founderStory,
    moments: homeContent.founderStory.moments.map((moment, i) => ({
      ...moment,
      image: toResponsiveImage(
        i === 0 ? heroImage : smoothingProduct?.featuredImage ?? heroImage,
        moment.heading,
      ).desktop,
    })),
  };

  const beforeAfter: BeforeAfterProps | null =
    featuredProduct?.images.length && featuredProduct.images.length >= 2
      ? {
          id: "home-before-after",
          heading: "See the difference",
          subheading: "Real results from real customers.",
          before: featuredProduct.images[0]!,
          after: featuredProduct.images[1]!,
          labels: { before: "Before", after: "After" },
          caption: "After consistent daily use.",
        }
      : null;

  const footer = {
    ...homeContent.footer,
    menus: [
      { heading: "Glow Beauty", menu: footerMenu ?? homeContent.footer.menus[0]!.menu },
      { heading: "Connect", menu: footerFollow ?? homeContent.footer.menus[1]!.menu },
      { heading: "Wholesale", menu: footerWholesale ?? homeContent.footer.menus[2]!.menu },
    ],
  };

  const sections: HomeSection[] = [
    { type: "hero", props: hero },
    { type: "guarantee", props: homeContent.guarantee },
    { type: "benefits-grid", props: homeContent.benefits },
  ];

  if (featured) sections.push({ type: "featured-product", props: featured });
  sections.push({ type: "collection-grid", props: collectionGrid });
  sections.push({ type: "testimonials", props: homeContent.testimonials });
  if (beforeAfter) sections.push({ type: "before-after", props: beforeAfter });
  sections.push({ type: "split-hero", props: splitDetangling });
  sections.push({ type: "split-hero", props: splitSmoothing });
  if (videoHero) sections.push({ type: "video-hero", props: videoHero });
  if (homeContent.reviewCarousel.reviews.length) {
    sections.push({ type: "review-carousel", props: homeContent.reviewCarousel });
  }
  sections.push({ type: "founder-story", props: founderStory });
  sections.push({ type: "faq", props: homeContent.faq });
  sections.push({ type: "footer", props: footer });

  return sections;
}
