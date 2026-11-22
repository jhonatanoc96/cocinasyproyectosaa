"use client";

import Link from "next/link";
import { useState } from "react";
import type { FotoData } from "@/lib/image";

export interface LineaMobiliario {
  id: string;
  titulo: string;
  slug: string;
  descripcion?: string;
  foto: FotoData | null;
}

/** Numbered index of furniture lines; hovering a row swaps the preview photo. */
export function MobiliarioIndex({ lineas }: { lineas: LineaMobiliario[] }) {
  const [activa, setActiva] = useState(0);
  const preview =
    lineas[activa]?.foto ?? lineas.find((l) => l.foto)?.foto ?? null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <ol className="lg:col-span-7">
        {lineas.map((l, i) => (
          <li key={l.id} className="border-t border-ink/15 last:border-b">
            <Link
              href={`/mobiliario#${l.slug}`}
              onMouseEnter={() => setActiva(i)}
              onFocus={() => setActiva(i)}
              className="group flex items-center gap-5 py-6 sm:gap-8 sm:py-7"
            >
              <span className="w-8 shrink-0 text-xs tabular-nums text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              {l.foto && (
                // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN
                <img
                  src={l.foto.src}
                  alt=""
                  className="h-16 w-12 shrink-0 object-cover lg:hidden"
                  style={{ objectPosition: l.foto.position }}
                  loading="lazy"
                />
              )}
              <span className="min-w-0 flex-1">
                <span
                  className={`display block text-3xl transition-all duration-500 sm:text-[2.6rem] ${
                    i === activa ? "lg:translate-x-3" : "lg:opacity-60"
                  }`}
                >
                  {l.titulo}
                </span>
                {l.descripcion && (
                  <span className="mt-2 line-clamp-2 block max-w-md text-sm leading-relaxed text-muted">
                    {l.descripcion}
                  </span>
                )}
              </span>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="shrink-0 transition-transform duration-500 group-hover:translate-x-1"
              >
                <path d="M4 11h14M12 5l6 6-6 6" />
              </svg>
            </Link>
          </li>
        ))}
      </ol>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden bg-stone">
          {lineas.map((l, i) =>
            l.foto ? (
              // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN
              <img
                key={l.id}
                src={l.foto.src}
                srcSet={l.foto.srcSet}
                sizes="40vw"
                alt={i === activa ? l.foto.alt : ""}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ${
                  l.foto === preview
                    ? "scale-100 opacity-100"
                    : "scale-105 opacity-0"
                }`}
                style={{ objectPosition: l.foto.position }}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
