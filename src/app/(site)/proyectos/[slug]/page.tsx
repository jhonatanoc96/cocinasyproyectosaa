import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PortableText } from "next-sanity";
import { Galeria } from "@/components/Galeria";
import { SanityImg } from "@/components/SanityImg";
import { Videos } from "@/components/Videos";
import { Container, CtaBanner, Flecha } from "@/components/ui";
import { cotizarHref } from "@/lib/contacto";
import { fotosData, hasAsset, imageUrl } from "@/lib/image";
import {
  getProyecto,
  getProyectoSlugs,
  getProyectoVecinos,
} from "@/sanity/data";

export async function generateStaticParams() {
  const slugs = await getProyectoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProyecto(slug);
  if (!p) return {};
  return {
    title: p.titulo,
    description: p.resumen,
    openGraph: {
      images: hasAsset(p.portada) ? [imageUrl(p.portada, 1200)] : undefined,
    },
  };
}

/**
 * params are awaited inside <Suspense> so Next can build the generic App Shell
 * for /proyectos/[slug] (needed with Partial Prefetching, e.g. after a CMS
 * publish revalidates the route or for a project created after the build).
 */
export default function ProyectoPage(props: PageProps<"/proyectos/[slug]">) {
  return (
    <Suspense fallback={<ProyectoCargando />}>
      <ProyectoContenido params={props.params} />
    </Suspense>
  );
}

function ProyectoCargando() {
  return (
    <section className="bg-bone pt-28 pb-16 lg:pt-36 lg:pb-24" aria-busy="true">
      <Container className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-6 lg:col-span-6">
          <div className="h-3 w-40 animate-pulse bg-stone" />
          <div className="h-24 w-full animate-pulse bg-stone" />
          <div className="h-16 w-3/4 animate-pulse bg-stone" />
        </div>
        <div className="aspect-[4/5] animate-pulse bg-stone lg:col-span-6 lg:aspect-[5/6]" />
      </Container>
    </section>
  );
}

async function ProyectoContenido({
  params,
}: Pick<PageProps<"/proyectos/[slug]">, "params">) {
  const { slug } = await params;
  const [proyecto, vecinos] = await Promise.all([
    getProyecto(slug),
    getProyectoVecinos(),
  ]);
  if (!proyecto) notFound();

  const idx = vecinos.findIndex((v) => v.slug === slug);
  const siguiente =
    vecinos.length > 1 ? vecinos[(idx + 1) % vecinos.length] : null;
  const fotos = fotosData(proyecto.galeria);
  const videos = (proyecto.videos ?? []).filter((v) => v.url);
  const cotizar = cotizarHref("proyecto", proyecto.titulo);
  const datos = [
    proyecto.ubicacion
      ? { label: "Ubicación", value: proyecto.ubicacion }
      : null,
    proyecto.anio ? { label: "Año", value: String(proyecto.anio) } : null,
    { label: "Fotografías", value: String(fotos.length) },
  ].filter((d): d is { label: string; value: string } => d !== null);

  return (
    <>
      <section className="bg-bone pt-28 pb-16 lg:pt-36 lg:pb-24">
        <Container>
          <Link
            href="/proyectos"
            className="group mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            <Flecha className="rotate-180 transition-transform group-hover:-translate-x-1" />{" "}
            Proyectos
          </Link>
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="hero-copy lg:col-span-6 lg:pb-6">
              {proyecto.categorias && proyecto.categorias.length > 0 && (
                <p className="eyebrow mb-6 text-walnut">
                  {proyecto.categorias.map((c) => c.titulo).join(" · ")}
                </p>
              )}
              <h1 className="display text-[clamp(2.8rem,6.4vw,6rem)]">
                {proyecto.titulo}
              </h1>
              {proyecto.resumen && (
                <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
                  {proyecto.resumen}
                </p>
              )}
              <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-6">
                {datos.map((d) => (
                  <div key={d.label}>
                    <dt className="eyebrow text-muted">{d.label}</dt>
                    <dd className="mt-2 text-lg">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-stone lg:col-span-6 lg:aspect-[5/6]">
              <SanityImg
                foto={proyecto.portada}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="hero-img"
              />
            </div>
          </div>
        </Container>
      </section>

      {proyecto.descripcion && proyecto.descripcion.length > 0 && (
        <section className="bg-bone pb-20 lg:pb-28">
          <Container className="grid gap-8 lg:grid-cols-12">
            <p className="eyebrow text-walnut lg:col-span-3">El proyecto</p>
            <div className="prose-aa reveal max-w-2xl text-xl leading-relaxed text-ink/85 lg:col-span-7">
              <PortableText value={proyecto.descripcion} />
            </div>
          </Container>
        </section>
      )}

      {fotos.length > 0 && (
        <section className="bg-bone pb-24 lg:pb-36">
          <Container>
            <div className="mb-10 flex items-baseline justify-between border-t border-line pt-6">
              <h2 className="eyebrow text-muted">Galería</h2>
              <span className="text-sm tabular-nums text-muted">
                {fotos.length} fotografías
              </span>
            </div>
            <Galeria fotos={fotos} columnas="tres" />
          </Container>
        </section>
      )}

      <Videos videos={videos} titulo="Recorrido" />

      {siguiente && siguiente.slug !== slug && (
        <section className="border-t border-line bg-bone">
          <Container>
            <Link
              href={`/proyectos/${siguiente.slug}`}
              className="group flex items-center justify-between gap-6 py-14 lg:py-20"
            >
              <span className="min-w-0">
                <span className="eyebrow block text-muted">
                  Siguiente proyecto
                </span>
                <span className="display mt-4 block truncate text-[clamp(2rem,5vw,4.5rem)]">
                  {siguiente.titulo}
                </span>
              </span>
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors group-hover:bg-ink group-hover:text-bone">
                <Flecha />
              </span>
            </Link>
          </Container>
        </section>
      )}

      <CtaBanner
        titulo="¿Quiere algo similar?"
        texto="Escríbanos y cuéntenos las medidas de su espacio."
        boton="Cotizar algo similar"
        href={cotizar}
        imagen={proyecto.portada}
      />
    </>
  );
}
