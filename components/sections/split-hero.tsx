import { cn } from "@/lib/utils";
import type { SplitHeroProps } from "@/types";

import { ReviewStars } from "@/components/ui/review-stars";

import { CtaGroup } from "./shared/cta-group";
import { MotionSection } from "./shared/motion-section";
import { RichHtml } from "./shared/rich-html";
import { ResponsiveMedia } from "./shared/responsiv-image";
import { SectionShell } from "./shared/section-shell";

export function SplitHero(props: SplitHeroProps) {
  const {
    eyebrowBand,
    chipOverlay,
    rating,
    eyebrow,
    heading,
    subheading,
    body,
    ctas,
    image,
    mediaSide,
  } = props;

  return (
    <SectionShell {...props} fullBleed padding={false}>
      {eyebrowBand && (
        <div className="bg-powder py-3 text-center font-eyebrow tracking-[0.22em]">{eyebrowBand}</div>
      )}
      <MotionSection>
        <div
          className={cn(
            "grid min-h-[480px] md:grid-cols-2",
            mediaSide === "right" && "md:[&>*:first-child]:order-2",
          )}
        >
          <div className="relative min-h-[320px] md:min-h-[520px]">
            <ResponsiveMedia image={image} alt={heading} className="absolute inset-0 h-full w-full" />
            {chipOverlay && (
              <span className="absolute left-4 top-4 rounded-full bg-blush px-3 py-1 font-chip text-ink md:left-8 md:top-8">
                {chipOverlay}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center bg-warm-gray px-6 py-12 md:px-12 md:py-16 lg:px-16">
            <div className="mx-auto max-w-lg space-y-4">
              {eyebrow && <p className="font-eyebrow">{eyebrow}</p>}
              {rating && (
                <div className="flex flex-wrap items-center gap-2">
                  <ReviewStars rating={rating.value} showCount={false} />
                  <span className="text-sm text-muted">{rating.label}</span>
                </div>
              )}
              <h2 className="text-2xl md:text-4xl">{heading}</h2>
              {subheading && <p className="font-heading text-lg tracking-[0.1em]">{subheading}</p>}
              {body && <RichHtml html={body} className="text-muted" />}
              <CtaGroup ctas={ctas} />
            </div>
          </div>
        </div>
      </MotionSection>
    </SectionShell>
  );
}
