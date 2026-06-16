import Image from "next/image";

import { ReviewStars } from "@/components/ui/review-stars";
import { cn } from "@/lib/utils";
import type { TestimonialsProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionHeader } from "./shared/section-header";
import { SectionShell } from "./shared/section-shell";
import { TestimonialsCarousel } from "./testimonials-carousel";

function TestimonialCard({
  quote,
  author,
  rating,
  avatar,
  photo,
}: TestimonialsProps["items"][number]) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-lg border border-ink/10 bg-cream p-6 md:flex-row md:items-center md:gap-8">
      {(photo || avatar) && (
        <div className="relative mx-auto aspect-square w-full max-w-[200px] shrink-0 overflow-hidden rounded-lg bg-warm-gray md:mx-0">
          <Image
            src={(photo ?? avatar)!.url}
            alt=""
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
      )}
      <blockquote className="flex flex-1 flex-col gap-3">
        {rating !== undefined && <ReviewStars rating={rating} showCount={false} />}
        <p className="text-lg leading-relaxed">&ldquo;{quote}&rdquo;</p>
        {author && <figcaption className="text-sm text-muted">{author}</figcaption>}
      </blockquote>
    </figure>
  );
}

export function Testimonials(props: TestimonialsProps) {
  const { heading, variant, items } = props;

  return (
    <SectionShell {...props}>
      <MotionSection>
        <SectionHeader heading={heading} />
        {variant === "carousel" ? (
          <TestimonialsCarousel items={items} />
        ) : variant === "grid" ? (
          <ul className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3")}>
            {items.map((item, i) => (
              <li key={`${item.author}-${i}`}>
                <TestimonialCard {...item} />
              </li>
            ))}
          </ul>
        ) : (
          items[0] && <TestimonialCard {...items[0]} />
        )}
      </MotionSection>
    </SectionShell>
  );
}
