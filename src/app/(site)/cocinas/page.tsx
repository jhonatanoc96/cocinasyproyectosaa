import type { Metadata } from "next";
import { Galeria } from "@/components/Galeria";
import { Videos } from "@/components/Videos";
import {
  Container,
  CtaBanner,
  EnlaceFlecha,
  PageHeader,
} from "@/components/ui";
import { cotizarHref } from "@/lib/contacto";
import { fotosData } from "@/lib/image";
import { getFotosPorSeccion, getPagina, getVideosPorSeccion } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-cocinas");
  return { title: pagina?.titulo ?? "Cocinas", description: pagina?.intro };
}

export default async function CocinasPage() {
  const [pagina, proyectos] = await Promise.all([
    getPagina("pagina-cocinas"),
    getFotosPorSeccion("cocinas"),
  ]);
  const videos = await getVideosPorSeccion("cocinas", pagina?.videos);

  return (
    <>
      <PageHeader pagina={pagina} fallbackTitulo="Cocinas" />
      {proyectos.map((p) => (
        <section key={p._id} className="bg-bone pb-24 lg:pb-36">
          <Container>
            <div className="reveal mb-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="display text-[clamp(2rem,4vw,3.4rem)]">
                {p.titulo}
              </h2>
              <EnlaceFlecha href={`/proyectos/${p.slug}`}>
                Ver proyecto completo
              </EnlaceFlecha>
            </div>
            <Galeria fotos={fotosData(p.galeria)} columnas="tres" />
          </Container>
        </section>
      ))}
      <Videos videos={videos} titulo="Cocinas en video" />
      <CtaBanner
        titulo="Cotice su cocina"
        texto="Envíenos las medidas o fotos del espacio y le ayudamos a definir el diseño."
        boton="Cotizar mi cocina"
        href={cotizarHref("cocina")}
        imagen={pagina?.imagen}
      />
    </>
  );
}
