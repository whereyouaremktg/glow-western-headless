import { cn } from "@/lib/utils";
import type { HeroProps } from "@/types";

import { CtaGroup } from "./shared/cta-group";
import { MotionSection } from "./shared/motion-section";
import { ResponsiveMedia } from "./shared/responsiv-image";
import { SectionShell } from "./shared/section-shell";

const heightClasses: Record<HeroProps["height"], string> = {
  full: "min-h-[85vh]",
  large: "min-h-[70vh]",
  medium: "min-h-[55vh]",
};

export function Hero(props: HeroProps) {
  const { chip, eyebrow, heading, body, ctas, image, height, align } = props;

  return (
    <SectionShell {...props} fullBleed padding={false}>
      <MotionSection>
        <div className={cn("relative w-full overflow-hidden", heightClasses[height])}>
          <ResponsiveMedia
            image={image}
            alt={heading}
            className="absolute inset-0 h-full w-full"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/25" aria-hidden />
          <div
            className={cn(
              "container-glow relative flex h-full min-h-[inherit] items-end pb-16 pt-24 md:items-center md:pb-24",
              align === "center" && "justify-center text-center",
              align === "left" && "justify-start text-left",
              align === "right" && "ml-auto justify-end text-right",
            )}
          >
            <div className="max-w-xl space-y-4 text-cream">
              {chip && (
                <span className="inline-block rounded-full bg-blush px-3 py-1 font-chip text-ink">
                  {chip}
                </span>
              )}
              {eyebrow && <p className="font-eyebrow text-cream/90">{eyebrow}</p>}
              <h1 className="text-3xl md:text-5xl lg:text-6xl">{heading}</h1>
              {body && <p className="text-lg text-cream/90">{body}</p>}
              <CtaGroup
                ctas={ctas}
                className={
                  align === "center"
                    ? "justify-center"
                    : align === "right"
                      ? "justify-end"
                      : undefined
                }
              />
            </div>
          </div>
        </div>
      </MotionSection>
    </SectionShell>
  );
}
