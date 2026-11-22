"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FotoData } from "@/lib/image";

export type SlideData =
  | { key: string; tipo: "imagen"; foto: FotoData }
  | { key: string; tipo: "video"; src: string; poster?: FotoData };

/**
 * Full-bleed hero carousel (photos and videos), configured in the CMS.
 * - Each slide's progress bar drives the timing: when its CSS animation ends,
 *   the next slide shows. Pausing (hover, focus, hidden tab) pauses the bar.
 * - Videos play muted and stay until they end (max. 30 s).
 * - Only the first image loads eagerly; the rest load one step ahead.
 */
export function HeroCarousel({
  slides,
  intervalo = 6,
  autoplay = true,
}: {
  slides: SlideData[];
  intervalo?: number;
  autoplay?: boolean;
}) {
  const total = slides.length;
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [reducido, setReducido] = useState(false);
  const [duraciones, setDuraciones] = useState<Record<string, number>>({});
  // Highest slide index allowed to load (current + 1).
  const [cargadas, setCargadas] = useState(1);
  const videos = useRef<Record<string, HTMLVideoElement | null>>({});
  const toque = useRef<number | null>(null);

  const ir = useCallback(
    (i: number) => {
      const n = (i + total) % total;
      setActual(n);
      setCargadas((c) => Math.max(c, n + 1));
    },
    [total]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducido(mq.matches);
    update();
    mq.addEventListener("change", update);
    const onVis = () => setPausado(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mq.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Play the active video from the start, pause the others.
  useEffect(() => {
    slides.forEach((s, i) => {
      if (s.tipo !== "video") return;
      const v = videos.current[s.key];
      if (!v) return;
      if (i === actual && !pausado) {
        if (v.dataset.activo !== "1") v.currentTime = 0;
        v.dataset.activo = "1";
        v.play().catch(() => {});
      } else {
        if (i !== actual) v.dataset.activo = "0";
        v.pause();
      }
    });
  }, [actual, pausado, slides, cargadas]);

  if (total === 0) return null;
  const corre = autoplay && !reducido && total > 1;

  const duracion = (s: SlideData) =>
    s.tipo === "video"
      ? Math.min(duraciones[s.key] ?? intervalo, 30)
      : intervalo;

  return (
    <div
      className="absolute inset-0"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Trabajos destacados"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(actual + 1);
        if (e.key === "ArrowLeft") ir(actual - 1);
      }}
      onTouchStart={(e) => {
        toque.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const inicio = toque.current;
        const fin = e.changedTouches[0]?.clientX;
        if (inicio !== null && fin !== undefined && Math.abs(fin - inicio) > 50)
          ir(fin < inicio ? actual + 1 : actual - 1);
        toque.current = null;
      }}
    >
      {slides.map((s, i) => {
        const activa = i === actual;
        const montar = i <= cargadas || i === total - 1;
        return (
          <div
            key={s.key}
            aria-hidden={!activa}
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${total}`}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-[1.4s] ease-in-out ${
              activa ? "z-[1] opacity-100" : "opacity-0"
            }`}
          >
            {montar && s.tipo === "imagen" && (
              // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN
              <img
                src={s.foto.src}
                srcSet={s.foto.srcSet}
                sizes="100vw"
                alt={activa ? s.foto.alt : ""}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
                className={`h-full w-full object-cover ${
                  activa && !reducido ? "hero-kenburns" : ""
                }`}
                style={{
                  objectPosition: s.foto.position,
                  backgroundImage: s.foto.lqip ? `url(${s.foto.lqip})` : undefined,
                  backgroundSize: "cover",
                  animationDuration: `${duracion(s) + 2}s`,
                }}
              />
            )}
            {montar && s.tipo === "video" && (
              <video
                ref={(el) => {
                  videos.current[s.key] = el;
                }}
                src={s.src}
                poster={s.poster?.src}
                muted
                playsInline
                loop={!corre}
                preload={i === 0 ? "auto" : "metadata"}
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration;
                  if (Number.isFinite(d) && d > 0)
                    setDuraciones((prev) => ({ ...prev, [s.key]: d }));
                }}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: s.poster?.position,
                }}
              />
            )}
          </div>
        );
      })}

      {total > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-10 sm:bottom-8">
          {/* Right padding leaves room for the floating WhatsApp button. */}
          <div className="mx-auto flex max-w-[1440px] items-center justify-end gap-5 pr-24 pl-5 sm:pr-28 sm:pl-8 lg:pl-12">
            <span className="hidden text-xs tabular-nums text-bone/60 sm:block">
              {String(actual + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => ir(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  aria-current={i === actual}
                  className="group flex h-6 items-center"
                >
                  <span className="relative block h-[2px] w-7 overflow-hidden bg-bone/30 sm:w-10">
                    {i === actual && (
                      <span
                        key={`${s.key}-${actual}`}
                        className="hero-progress absolute inset-0 origin-left bg-bone"
                        style={{
                          animationDuration: `${duracion(s)}s`,
                          animationPlayState: corre && !pausado ? "running" : "paused",
                          transform: corre ? undefined : "scaleX(1)",
                        }}
                        onAnimationEnd={() => corre && ir(actual + 1)}
                      />
                    )}
                    {i < actual && <span className="absolute inset-0 bg-bone/70" />}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Flecha dir={-1} onClick={() => ir(actual - 1)} />
              <Flecha dir={1} onClick={() => ir(actual + 1)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Flecha({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Siguiente" : "Anterior"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/30 text-bone/85 backdrop-blur-sm transition-colors hover:bg-bone hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d={dir === 1 ? "M6 3l6 6-6 6" : "M12 3L6 9l6 6"} />
      </svg>
    </button>
  );
}
