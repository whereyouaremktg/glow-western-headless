import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ResponsiveImage, ShopifyImage } from "@/types";

interface ResponsiveImageProps {
  image: ResponsiveImage;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
}

function focalStyle(focal?: { x: number; y: number }) {
  if (!focal) return undefined;
  return { objectPosition: `${focal.x}% ${focal.y}%` };
}

function SingleImage({
  src,
  alt,
  className,
  priority,
  sizes,
  fill = true,
  focalPoint,
}: {
  src: ShopifyImage;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  focalPoint?: { x: number; y: number };
}) {
  return (
    <Image
      src={src.url}
      alt={src.altText ?? alt}
      fill={fill}
      width={fill ? undefined : src.width}
      height={fill ? undefined : src.height}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      className={cn("object-cover", className)}
      style={focalStyle(focalPoint)}
      priority={priority}
    />
  );
}

export function ResponsiveMedia({
  image,
  alt,
  className,
  priority,
  sizes,
}: ResponsiveImageProps) {
  const { desktop, mobile, focalPoint } = image;

  if (mobile) {
    return (
      <>
        <div className={cn("relative md:hidden", className)}>
          <SingleImage src={mobile} alt={alt} priority={priority} sizes={sizes} focalPoint={focalPoint} />
        </div>
        <div className={cn("relative hidden md:block", className)}>
          <SingleImage src={desktop} alt={alt} priority={priority} sizes={sizes} focalPoint={focalPoint} />
        </div>
      </>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <SingleImage src={desktop} alt={alt} priority={priority} sizes={sizes} focalPoint={focalPoint} />
    </div>
  );
}
