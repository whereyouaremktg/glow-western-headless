"use client";
// Image gallery thumbs, mobile swipe, and lightbox require client interactivity.

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import type { ShopifyImage } from "@/types";

interface ProductGalleryProps {
  images: ShopifyImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = images[activeIndex] ?? images[0];
  const hasMultiple = images.length > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!images.length) return;
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  if (!active) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-warm-gray text-muted">
        No image
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[5rem_1fr]">
        {hasMultiple && (
          <ul className="hidden flex-col gap-2 md:flex">
            {images.map((image, index) => (
              <li key={image.url}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative aspect-square w-full overflow-hidden rounded-lg border-2 bg-warm-gray",
                    index === activeIndex ? "border-ink" : "border-transparent",
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image src={image.url} alt="" fill className="object-cover" sizes="80px" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="relative">
          <button
            type="button"
            className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-warm-gray"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open image lightbox"
          >
            <Image
              src={active.url}
              alt={active.altText ?? title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-cream/90 p-2 opacity-0 transition group-hover:opacity-100">
              <ZoomIn className="size-4" />
            </span>
          </button>

          {hasMultiple && (
            <div className="mt-3 flex items-center justify-between md:hidden">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="rounded-full border border-ink/20 p-2"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm text-muted">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="rounded-full border border-ink/20 p-2"
                aria-label="Next image"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-cream/10 p-2 text-cream"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            <X className="size-6" />
          </button>
          {hasMultiple && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-cream/10 p-3 text-cream"
                onClick={() => goTo(activeIndex - 1)}
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-cream/10 p-3 text-cream"
                onClick={() => goTo(activeIndex + 1)}
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={active.url}
              alt={active.altText ?? title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
