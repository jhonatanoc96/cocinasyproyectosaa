"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FotoData } from "@/lib/image";

export interface GaleriaProps {
  fotos: FotoData[];
  /** Masonry columns at each breakpoint. */
  columnas?: "dos" | "tres" | "cuatro";
  sizes?: string;
}

const COLS = {
  dos: "columns-1 sm:columns-2",
  tres: "columns-2 lg:columns-3",
  cuatro: "columns-2 md:columns-3 xl:columns-4",
};

/** Masonry gallery with a keyboard/swipe-friendly lightbox. */
export function Galeria({
  fotos,
  columnas = "tres",
  sizes = "(min-width: 1024px) 33vw, 50vw",
}: GaleriaProps) {
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const total = fotos.length;

  const close = useCallback(() => setIndex(null), []);
  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i === null ? i : (i + dir + total) % total)),
    [total]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, go]);

  if (total === 0) return null;
  const actual = index === null ? null : fotos[index];

  return (
    <>
      <ul className={`${COLS[columnas]} gap-3 sm:gap-4`}>
        {fotos.map((f, i) => (
          <li key={f.key} className="reveal mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-walnut"
              aria-label={`Ampliar: ${f.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Sanity CDN */}
              <img
                src={f.src}
                srcSet={f.srcSet}
                sizes={sizes}
                alt={f.alt}
                width={f.width}
                height={f.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.035]"
                style={{
                  backgroundImage: f.lqip ? `url(${f.lqip})` : undefined,
                  backgroundSize: "cover",
                }}
              />
              <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
            </button>
          </li>
        ))}
      </ul>

      {actual && index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotografías"
          className="fixed inset-0 z-[100] flex flex-col bg-ink/97 text-bone"
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX;
            if (
              start !== null &&
              end !== undefined &&
              Math.abs(end - start) > 50
            )
              go(end < start ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-8">
            <span className="text-sm tabular-nums text-bone/60">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={close}
              className="-mr-2 flex h-11 w-11 items-center justify-center text-bone/80 hover:text-bone"
              aria-label="Cerrar"
              autoFocus
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 3l14 14M17 3L3 17" />
              </svg>
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
            onClick={close}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Sanity CDN */}
            <img
              key={actual.key}
              src={actual.large}
              alt={actual.alt}
              className="max-h-full max-w-full object-contain"
              style={{ animation: "reveal-up .5s var(--ease-out-soft) both" }}
              onClick={(e) => e.stopPropagation()}
            />
            {total > 1 && (
              <>
                <NavBtn dir={-1} onClick={() => go(-1)} />
                <NavBtn dir={1} onClick={() => go(1)} />
              </>
            )}
          </div>

          <p className="mx-auto min-h-16 max-w-2xl shrink-0 px-6 py-4 text-center text-sm leading-relaxed text-bone/70">
            {actual.descripcion ?? actual.alt}
          </p>
        </div>
      )}
    </>
  );
}

function NavBtn({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={dir === 1 ? "Siguiente" : "Anterior"}
      className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-bone/20 text-bone/80 transition-colors hover:bg-bone hover:text-ink sm:flex ${
        dir === 1 ? "right-5" : "left-5"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d={dir === 1 ? "M6 3l6 6-6 6" : "M12 3L6 9l6 6"} />
      </svg>
    </button>
  );
}
