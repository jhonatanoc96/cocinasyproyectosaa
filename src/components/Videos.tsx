import Link from "next/link";
import { hasAsset, imageUrl } from "@/lib/image";
import type { Video } from "@/sanity/types";
import { Container } from "./ui";

export type VideoItem = Video & { proyecto?: { titulo: string; slug: string } };

/**
 * Video section (dark band). Native <video> with preload="none": nothing is
 * downloaded until the visitor presses play, so it doesn't slow the page.
 */
export function Videos({
  videos,
  etiqueta = "En video",
  titulo = "Recorridos",
}: {
  videos: VideoItem[];
  etiqueta?: string;
  titulo?: string;
}) {
  const lista = videos.filter((v) => v.url);
  if (lista.length === 0) return null;
  return (
    <section className="bg-ink py-24 text-bone lg:py-32">
      <Container>
        <p className="eyebrow mb-5 text-sand">{etiqueta}</p>
        <h2 className="display mb-12 text-[clamp(2.4rem,5vw,4rem)]">{titulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((v) => {
            const horizontal = v.formato === "horizontal";
            return (
              <figure
                key={v._key}
                className={`reveal ${horizontal ? "sm:col-span-2" : ""}`}
              >
                <video
                  src={v.url!}
                  poster={hasAsset(v.poster) ? imageUrl(v.poster, 960) : undefined}
                  controls
                  playsInline
                  preload={hasAsset(v.poster) ? "none" : "metadata"}
                  className={`w-full bg-graphite object-cover ${
                    horizontal ? "aspect-video" : "aspect-[9/16]"
                  }`}
                />
                {(v.titulo || v.proyecto) && (
                  <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                    {v.titulo && <span className="text-bone/75">{v.titulo}</span>}
                    {v.proyecto && (
                      <Link
                        href={`/proyectos/${v.proyecto.slug}`}
                        className="text-bone/45 underline-offset-4 hover:text-bone hover:underline"
                      >
                        {v.proyecto.titulo}
                      </Link>
                    )}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
