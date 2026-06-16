"use client";
// Review cards carousel — client for horizontal scroll controls.

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { ReviewStars } from "@/components/ui/review-stars";
import type { ReviewCarouselProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionHeader } from "./shared/section-header";
import { SectionShell } from "./shared/section-shell";

export function ReviewCarousel(props: ReviewCarouselProps) {
  const { heading, reviews } = props;
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <SectionShell {...props}>
      <MotionSection>
        <SectionHeader heading={heading} />
        <div className="relative">
          <div
            ref={ref}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review, i) => (
              <article
                key={`${review.author}-${i}`}
                className="w-[min(100%,320px)] shrink-0 snap-center rounded-lg border border-ink/10 bg-cream p-4"
              >
                {review.photo && (
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-warm-gray">
                    <Image
                      src={review.photo.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                )}
                <ReviewStars rating={review.rating} showCount={false} className="mb-2" />
                {review.title && <h3 className="mb-1 font-medium normal-case">{review.title}</h3>}
                <p className="mb-2 text-sm text-muted line-clamp-4">{review.body}</p>
                <p className="text-xs text-muted">{review.author}</p>
                {review.productHandle && (
                  <Link
                    href={`/products/${review.productHandle}`}
                    className="mt-2 inline-block text-xs underline"
                  >
                    View product
                  </Link>
                )}
              </article>
            ))}
          </div>
          {reviews.length > 1 && (
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                className="rounded-lg border-2 border-ink p-2"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                className="rounded-lg border-2 border-ink p-2"
                aria-label="Next reviews"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </MotionSection>
    </SectionShell>
  );
}
