import { BenefitsGrid } from "@/components/sections/benefits-grid";
import { BeforeAfter } from "@/components/sections/before-after";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { EmailCapture } from "@/components/sections/email-capture";
import { FAQ } from "@/components/sections/faq";
import { FeaturedProduct } from "@/components/sections/featured-product";
import { Footer } from "@/components/sections/footer";
import { FounderStory } from "@/components/sections/founder-story";
import { Guarantee } from "@/components/sections/guarantee";
import { Hero } from "@/components/sections/hero";
import { ReviewCarousel } from "@/components/sections/review-carousel";
import { SplitHero } from "@/components/sections/split-hero";
import { Testimonials } from "@/components/sections/testimonials";
import { VideoHero } from "@/components/sections/video-hero";
import type { HomeSection } from "@/lib/content/types";

export function SectionRenderer({ section }: { section: HomeSection }) {
  switch (section.type) {
    case "hero":
      return <Hero {...section.props} />;
    case "split-hero":
      return <SplitHero {...section.props} />;
    case "video-hero":
      return <VideoHero {...section.props} />;
    case "benefits-grid":
      return <BenefitsGrid {...section.props} />;
    case "before-after":
      return <BeforeAfter {...section.props} />;
    case "testimonials":
      return <Testimonials {...section.props} />;
    case "review-carousel":
      return <ReviewCarousel {...section.props} />;
    case "faq":
      return <FAQ {...section.props} />;
    case "founder-story":
      return <FounderStory {...section.props} />;
    case "featured-product":
      return <FeaturedProduct {...section.props} />;
    case "collection-grid":
      return <CollectionGrid {...section.props} />;
    case "guarantee":
      return <Guarantee {...section.props} />;
    case "email-capture":
      return <EmailCapture {...section.props} />;
    case "footer":
      return <Footer {...section.props} />;
    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
}
