"use client";

import { useEffect, useState } from "react";
import type { FotoData } from "@/lib/image";

/** Mobile hero: cross-fades through every hero photo. */
export function HeroRotator({ fotos }: { fotos: FotoData[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (fotos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(
      () => setI((v) => (v + 1) % fotos.length),
      5000
    );
    return () => window.clearInterval(t);
  }, [fotos.length]);

  return (
    <div className="absolute inset-0">
      {fotos.map((f, idx) => (
        // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN
        <img
          key={f.key}
          src={f.src}
          srcSet={f.srcSet}
          sizes="100vw"
          alt={idx === i ? f.alt : ""}
          aria-hidden={idx !== i}
          loading={idx === 0 ? "eager" : "lazy"}
          fetchPriority={idx === 0 ? "high" : "auto"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.6s] ease-in-out ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
          style={{
            objectPosition: f.position,
            backgroundImage: f.lqip ? `url(${f.lqip})` : undefined,
            backgroundSize: "cover",
          }}
        />
      ))}
      <div className="absolute right-5 bottom-6 z-10 flex gap-1.5 sm:right-8">
        {fotos.map((f, idx) => (
          <span
            key={f.key}
            className={`h-px transition-all duration-500 ${
              idx === i ? "w-8 bg-bone" : "w-4 bg-bone/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
