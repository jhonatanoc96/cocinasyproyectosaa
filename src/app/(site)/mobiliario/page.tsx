import type { Metadata } from "next";
import Link from "next/link";
import { Galeria } from "@/components/Galeria";
import { Videos } from "@/components/Videos";
import { Container, CtaBanner, PageHeader } from "@/components/ui";
import { cotizarHref } from "@/lib/contacto";
import { fotosData } from "@/lib/image";
import {
  getCategorias,
  getFotosPorSeccion,
  getPagina,
  getVideosPorSeccion,
} from "@/sanity/data";
import type { Foto } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-mobiliario");
  return { title: pagina?.titulo ?? "Mobiliario", description: pagina?.intro };
}

export default async function MobiliarioPage() {
  const [pagina, categorias, proyectos] = await Promise.all([
    getPagina("pagina-mobiliario"),
    getCategorias("mobiliario"),
    getFotosPorSeccion("mobiliario"),
  ]);
  const videos = await getVideosPorSeccion("mobiliario", pagina?.videos);

  // Group every furniture photo (across all projects) by its work category.
  const porCategoria = new Map<string, Foto[]>();
  for (const p of proyectos) {
    for (const f of p.galeria ?? []) {
      const id = f.categoria?._id;
      if (!id) continue;
      porCategoria.set(id, [...(porCategoria.get(id) ?? []), f]);
    }
  }
  const secciones = categorias
    .map((c) => ({ ...c, fotos: fotosData(porCategoria.get(c._id)) }))
    .filter((c) => c.fotos.length > 0);

  return (
    <>
      <PageHeader pagina={pagina} fallbackTitulo="Mobiliario" />

      <nav
        aria-label="Líneas de mobiliario"
        className="sticky top-18 z-30 border-y border-line bg-bone/92 backdrop-blur-md lg:top-20"
      >
        <Container className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {secciones.map((s) => (
            <Link
              key={s._id}
              href={`#${s.slug}`}
              className="shrink-0 rounded-full border border-ink/15 px-4 py-2 text-sm whitespace-nowrap transition-colors hover:border-ink hover:bg-ink hover:text-bone"
            >
              {s.titulo}
            </Link>
          ))}
        </Container>
      </nav>

      {secciones.map((s, i) => (
        <section
          key={s._id}
          id={s.slug}
          className="scroll-mt-36 bg-bone py-20 lg:py-28"
        >
          <Container>
            <div className="reveal mb-12 grid gap-6 lg:grid-cols-12">
              <span className="text-xs tabular-nums text-walnut lg:col-span-1 lg:pt-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="display text-[clamp(2.4rem,5vw,4.2rem)] lg:col-span-6">
                {s.titulo}
              </h2>
              {s.descripcion && (
                <p className="max-w-md leading-relaxed text-muted lg:col-span-5 lg:pt-4">
                  {s.descripcion}
                </p>
              )}
            </div>
            <Galeria
              fotos={s.fotos}
              columnas={s.fotos.length >= 6 ? "cuatro" : "tres"}
            />
          </Container>
        </section>
      ))}

      <Videos videos={videos} titulo="Mobiliario en video" />

      <CtaBanner
        titulo="Muebles a la medida de su espacio"
        texto="Cuéntenos qué necesita: closet, vestidor, mueble de baño, estudio o revestimiento."
        boton="Cotizar mobiliario"
        href={cotizarHref("mobiliario")}
        imagen={pagina?.imagen}
      />
    </>
  );
}
