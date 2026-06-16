"use client";
// Drag-to-reveal before/after slider — requires client input handling.

import Image from "next/image";
import { useCallback, useState } from "react";

import type { BeforeAfterProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionHeader } from "./shared/section-header";
import { SectionShell } from "./shared/section-shell";

export function BeforeAfter(props: BeforeAfterProps) {
  const { heading, subheading, before, after, labels, caption } = props;
  const [position, setPosition] = useState(50);

  const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(e.target.value));
  }, []);

  return (
    <SectionShell {...props}>
      <MotionSection>
        <SectionHeader heading={heading} subheading={subheading} />
        <div className="relative mx-auto aspect-[4/3] max-w-4xl overflow-hidden rounded-lg bg-warm-gray">
          <Image
            src={after.url}
            alt={after.altText ?? labels.after}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src={before.url}
              alt={before.altText ?? labels.before}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-cream shadow-[0_0_8px_rgba(0,0,0,0.3)]"
            style={{ left: `${position}%` }}
            aria-hidden
          />
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={onInput}
            aria-label="Compare before and after"
            className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          />
          <span className="pointer-events-none absolute left-4 top-4 rounded bg-ink/70 px-2 py-1 text-xs uppercase tracking-wider text-cream">
            {labels.before}
          </span>
          <span className="pointer-events-none absolute right-4 top-4 rounded bg-ink/70 px-2 py-1 text-xs uppercase tracking-wider text-cream">
            {labels.after}
          </span>
        </div>
        {caption && <p className="mt-4 text-center text-sm text-muted">{caption}</p>}
      </MotionSection>
    </SectionShell>
  );
}
