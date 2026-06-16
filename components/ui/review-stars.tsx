import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface ReviewStarsProps {
  rating: number;
  count?: number;
  max?: number;
  className?: string;
  showCount?: boolean;
}

export function ReviewStars({
  rating,
  count,
  max = 5,
  className,
  showCount = true,
}: ReviewStarsProps) {
  const clamped = Math.min(Math.max(rating, 0), max);

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)} aria-label={`${clamped} out of ${max} stars`}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: max }).map((_, i) => {
          const filled = clamped >= i + 1;
          const partial = !filled && clamped > i;
          return (
            <Star
              key={i}
              className={cn(
                "size-3.5",
                filled || partial ? "fill-ink text-ink" : "fill-none text-muted/40",
              )}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {showCount && count !== undefined && count > 0 && (
        <span className="text-sm text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
