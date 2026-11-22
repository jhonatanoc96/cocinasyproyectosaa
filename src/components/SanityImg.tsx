import { hasAsset, toFotoData } from "@/lib/image";
import type { Foto } from "@/sanity/types";

export interface SanityImgProps {
  foto: Foto | null | undefined;
  /** `sizes` attribute — how wide the image renders at each breakpoint. */
  sizes: string;
  className?: string;
  /** Cover its parent box (parent must be positioned and sized). */
  fill?: boolean;
  priority?: boolean;
}

/**
 * Responsive <img> from a Sanity photo: srcset capped at the original width,
 * blurred LQIP background while it loads and hotspot-aware cropping.
 */
export function SanityImg({
  foto,
  sizes,
  className = "",
  fill = false,
  priority = false,
}: SanityImgProps) {
  if (!hasAsset(foto)) return null;
  const d = toFotoData(foto);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN already resizes/encodes
    <img
      src={d.src}
      srcSet={d.srcSet}
      sizes={sizes}
      alt={d.alt}
      width={d.width}
      height={d.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={`${
        fill ? "absolute inset-0 h-full w-full object-cover" : ""
      } ${className}`}
      style={{
        objectPosition: d.position,
        backgroundImage: d.lqip ? `url(${d.lqip})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: d.position,
      }}
    />
  );
}
