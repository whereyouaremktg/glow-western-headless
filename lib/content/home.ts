import type {
  BenefitsGridProps,
  FAQProps,
  FooterProps,
  FounderStoryProps,
  GuaranteeProps,
  HeroProps,
  ReviewCarouselProps,
  SplitHeroProps,
  TestimonialsProps,
  VideoHeroProps,
} from "@/types";

/** Static copy seeds — images/products filled by getHomePageSections() */
export const homeContent = {
  hero: {
    id: "home-hero",
    heading: "YOUR HAIR BRUSH MATTERS MORE THAN YOU THINK",
    ctas: [{ label: "SHOP THE LINEUP", href: "/collections/the-detangling-brush" }],
    height: "full" as const,
    align: "right" as const,
    theme: "cream" as const,
  } satisfies Omit<HeroProps, "image">,

  guarantee: {
    id: "home-guarantee",
    theme: "blush" as const,
    pillars: [
      { label: "CRUELTY FREE", icon: "🐰" },
      { label: "ECO-FRIENDLY", icon: "🌿" },
      { label: "LIFETIME PROMISE", body: "lifetime warranty", icon: "✦" },
      { label: "FREE SHIPPING", body: "orders over $50", icon: "📦" },
    ],
  } satisfies GuaranteeProps,

  benefits: {
    id: "home-benefits",
    theme: "warm-gray" as const,
    columns: 3 as const,
    items: [
      {
        icon: "💫",
        title: "Plastic bristles damage hair",
        body: "They snag. Create static. Break strands. Your brush shouldn't be working against you.",
      },
      {
        icon: "✨",
        title: "Metal does it better",
        body: "Stainless steel bristles glide through knots without breakage. They exfoliate the scalp, distribute oils, and add shine in one motion.",
      },
      {
        icon: "💎",
        title: "Built to last. Built for you",
        body: "Wet or dry. All hair types. Extension-safe. Behind the chair or at home. This is the brush you've been missing.",
      },
    ],
  } satisfies BenefitsGridProps,

  testimonials: {
    id: "home-testimonials",
    heading: "Real Glow Customers",
    variant: "carousel" as const,
    items: [
      {
        quote:
          "I'm 50, and I can honestly say this is the best hairbrush I've ever owned. It glides through wet or dry hair without tugging or pulling.",
        author: "Glow Customer",
        rating: 5,
      },
      {
        quote:
          "I will never buy another hair brush! These are the best and I have several of them now.",
        author: "Elizabeth T.",
        rating: 5,
      },
      {
        quote:
          "It is truly detangling, in all instances of my hair. Greasy, smooth, wet, dry — all of the above!",
        author: "Mya R.",
        rating: 5,
      },
    ],
  } satisfies TestimonialsProps,

  splitHeroDetangling: {
    id: "home-split-detangling",
    chipOverlay: "BEST SELLER",
    rating: { value: 4.9, label: "4.9/5 (2,400+ Reviews)" },
    eyebrow: "The Lineup",
    heading: "The Detangling Brush",
    subheading: "Functional. Reliable. Timeless.",
    body: "<p>Detangles wet or dry hair without pulling. Drainage hole keeps it dry. Metal bristles exfoliate the scalp, lift buildup, and bring out shine.</p>",
    ctas: [{ label: "Shop the brush", href: "/products/glow-beauty-hair-brush" }],
    mediaSide: "left" as const,
  } satisfies Omit<SplitHeroProps, "image">,

  splitHeroSmoothing: {
    id: "home-split-smoothing",
    chipOverlay: "RESTOCKED FAVORITE",
    rating: { value: 4.9, label: "4.9/5 (2,400+ Reviews)" },
    heading: "THE SMOOTHING BRUSH",
    body: "<p>100% natural boar + nylon bristles. Boar hydrates from root to tip, nylon exfoliates the scalp. Hand-polished acetate handle finished by hand.</p>",
    ctas: [{ label: "Shop the brush", href: "/products/the-smoothing-brush" }],
    mediaSide: "right" as const,
  } satisfies Omit<SplitHeroProps, "image">,

  videoHero: {
    id: "home-video",
    videoUrl: "",
    heading: "Salon results at home",
    body: "See the Glow difference in motion.",
    ctas: [{ label: "Shop brushes", href: "/collections/the-detangling-brush" }],
    overlayOpacity: 40,
  } satisfies Omit<VideoHeroProps, "poster">,

  reviewCarousel: {
    id: "home-reviews",
    heading: "Glow In The WILD",
    reviews: [],
  } satisfies ReviewCarouselProps,

  founderStory: {
    id: "home-founder",
    eyebrow: "Our Story",
    heading: "Meet Marissa",
    moments: [
      {
        eyebrow: "Behind the chair",
        heading: "14 years of styling",
        body: "Marissa built Glow Beauty Hair from real salon experience — brushes that work wet and dry, extension-safe, and built to last.",
        reverse: false,
      },
      {
        eyebrow: "The mission",
        heading: "Functional luxury",
        body: "Elevated tools that feel as good as they perform. Salon-tested, stylist-created, approachable at home.",
        reverse: true,
      },
    ],
  } satisfies Omit<FounderStoryProps, "moments"> & {
    moments: Omit<FounderStoryProps["moments"][number], "image">[];
  },

  faq: {
    id: "home-faq",
    heading: "Frequently asked questions",
    intro: "Everything you need to know about your Glow brush.",
    items: [
      {
        question: "Can I use my Glow brush on wet hair?",
        answerHtml:
          "<p>Yes — our metal bristles are designed for wet and dry detangling without snagging or breakage.</p>",
      },
      {
        question: "Is it extension-safe?",
        answerHtml:
          "<p>Yes. The bristle design and spacing are salon-tested for extensions and delicate strands.</p>",
      },
      {
        question: "What is the drainage hole?",
        answerHtml:
          "<p>The intentional drainage hole helps water escape so your brush dries faster and stays hygienic.</p>",
      },
    ],
  } satisfies FAQProps,

  footer: {
    menus: [
      {
        heading: "Glow Beauty",
        menu: {
          items: [
            { title: "Shop All", url: "/collections/all" },
            { title: "About", url: "/pages/about" },
            { title: "FAQ", url: "/pages/faq" },
          ],
        },
      },
      {
        heading: "Connect",
        menu: {
          items: [
            { title: "Instagram", url: "https://www.instagram.com/glowbeauty.hair/" },
            { title: "TikTok", url: "https://www.tiktok.com/@glowbeautyhair" },
          ],
        },
      },
      {
        heading: "Wholesale",
        menu: {
          items: [{ title: "Wholesale Guide", url: "/pages/wholesale" }],
        },
      },
    ],
    newsletter: {
      id: "footer-newsletter-content",
      heading: "Save 10% off your first order",
      body: "Join the list for launches, tips, and exclusive offers.",
      incentive: "10% off your first order",
      placeholder: "Email address",
      successMessage: "Thanks — check your inbox for your welcome offer.",
    },
    social: [
      { platform: "instagram" as const, url: "https://www.instagram.com/glowbeauty.hair/" },
      { platform: "tiktok" as const, url: "https://www.tiktok.com/@glowbeautyhair" },
      { platform: "facebook" as const, url: "https://www.facebook.com/glowbeautyhairofficial/" },
    ],
    legalName: "Hair By Marissa Sue DBA Glow Beauty",
  } satisfies FooterProps,
};
