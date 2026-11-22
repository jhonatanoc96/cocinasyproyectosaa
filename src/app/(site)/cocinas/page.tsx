import type { Metadata } from "next";
import { Galeria } from "@/components/Galeria";
import {
  Container,
  CtaBanner,
  EnlaceFlecha,
  PageHeader,
} from "@/components/ui";
import { cotizarHref } from "@/lib/contacto";
import { fotosData } from "@/lib/image";
import { getConfig, getFotosPorSeccion, getPagina } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-cocinas");
  return { title: pagina?.titulo ?? "Cocinas", description: pagina?.intro };
}

export default async function CocinasPage() {
  const [pagina, proyectos, config] = await Promise.all([
    getPagina("pagina-cocinas"),
    getFotosPorSeccion("cocinas"),
    getConfig(),
  ]);
  const cotizar = cotizarHref(config, "Hola, quiero cotizar una cocina.");

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
      <CtaBanner
        titulo="Cotice su cocina"
        texto="Envíenos las medidas o fotos del espacio y le ayudamos a definir el diseño."
        boton={
          cotizar.externo ? "Cotizar por WhatsApp" : "Solicitar cotización"
        }
        href={cotizar.href}
        externo={cotizar.externo}
        imagen={pagina?.imagen}
      />
    </>
  );
}
