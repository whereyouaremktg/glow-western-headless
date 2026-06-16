import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FounderStoryProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionHeader } from "./shared/section-header";
import { SectionShell } from "./shared/section-shell";

export function FounderStory(props: FounderStoryProps) {
  const { eyebrow, heading, moments } = props;

  return (
    <SectionShell {...props}>
      <MotionSection>
        <SectionHeader eyebrow={eyebrow} heading={heading} align="left" className="mx-0 max-w-none" />
        <ul className="space-y-16 md:space-y-24">
          {moments.map((moment, i) => (
            <li
              key={`${moment.heading}-${i}`}
              className={cn(
                "grid items-center gap-8 md:grid-cols-2 md:gap-12",
                moment.reverse && "md:[&>*:first-child]:order-2",
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-warm-gray">
                <Image
                  src={moment.image.url}
                  alt={moment.image.altText ?? moment.heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4">
                {moment.eyebrow && <p className="font-eyebrow">{moment.eyebrow}</p>}
                <h3 className="text-2xl">{moment.heading}</h3>
                <p className="text-muted">{moment.body}</p>
                {moment.cta && (
                  <Button asChild variant={moment.cta.variant ?? "primary"}>
                    <Link href={moment.cta.href}>{moment.cta.label}</Link>
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </MotionSection>
    </SectionShell>
  );
}
