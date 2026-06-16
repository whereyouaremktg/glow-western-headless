"use client";
// Horizontal scroll carousel — client for scroll controls and touch UX.

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { ReviewStars } from "@/components/ui/review-stars";
import type { Testimonial } from "@/types";

interface TestimonialsCarouselProps {
  items: Testimonial[];
}

export function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="w-[min(100%,520px)] shrink-0 snap-center rounded-lg border border-ink/10 bg-cream p-6"
          >
            {item.rating !== undefined && (
              <ReviewStars rating={item.rating} showCount={false} className="mb-3" />
            )}
            <blockquote className="space-y-3">
              <p>&ldquo;{item.quote}&rdquo;</p>
              {item.author && <figcaption className="text-sm text-muted">{item.author}</figcaption>}
            </blockquote>
          </figure>
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="rounded-lg border-2 border-ink p-2"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="rounded-lg border-2 border-ink p-2"
            aria-label="Next testimonial"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
