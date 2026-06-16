import type {
  BenefitsGridProps,
  BeforeAfterProps,
  CollectionGridProps,
  EmailCaptureProps,
  FAQProps,
  FeaturedProductProps,
  FooterProps,
  FounderStoryProps,
  GuaranteeProps,
  HeroProps,
  ReviewCarouselProps,
  SplitHeroProps,
  TestimonialsProps,
  VideoHeroProps,
} from "@/types";

export type HomeSection =
  | { type: "hero"; props: HeroProps }
  | { type: "split-hero"; props: SplitHeroProps }
  | { type: "video-hero"; props: VideoHeroProps }
  | { type: "benefits-grid"; props: BenefitsGridProps }
  | { type: "before-after"; props: BeforeAfterProps }
  | { type: "testimonials"; props: TestimonialsProps }
  | { type: "review-carousel"; props: ReviewCarouselProps }
  | { type: "faq"; props: FAQProps }
  | { type: "founder-story"; props: FounderStoryProps }
  | { type: "featured-product"; props: FeaturedProductProps }
  | { type: "collection-grid"; props: CollectionGridProps }
  | { type: "guarantee"; props: GuaranteeProps }
  | { type: "email-capture"; props: EmailCaptureProps }
  | { type: "footer"; props: FooterProps };

export type SectionType = HomeSection["type"];
