import type { VideoHeroProps } from "@/types";

import { CtaGroup } from "./shared/cta-group";
import { MotionSection } from "./shared/motion-section";
import { SectionShell } from "./shared/section-shell";

export function VideoHero(props: VideoHeroProps) {
  const { videoUrl, poster, heading, body, ctas, overlayOpacity = 40 } = props;

  return (
    <SectionShell {...props} fullBleed padding={false}>
      <MotionSection>
        <div className="relative min-h-[50vh] w-full overflow-hidden md:min-h-[60vh]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={poster?.url}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-ink"
            style={{ opacity: overlayOpacity / 100 }}
            aria-hidden
          />
          {(heading || body || ctas.length > 0) && (
            <div className="container-glow relative flex min-h-[inherit] flex-col items-center justify-center py-24 text-center text-cream">
              <div className="max-w-2xl space-y-4">
                {heading && <h2 className="text-3xl md:text-4xl">{heading}</h2>}
                {body && <p className="text-lg text-cream/90">{body}</p>}
                <CtaGroup ctas={ctas} className="justify-center" />
              </div>
            </div>
          )}
        </div>
      </MotionSection>
    </SectionShell>
  );
}
