import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { SanityImg } from "@/components/SanityImg";
import {
  Container,
  CtaBanner,
  EnlaceFlecha,
  PageHeader,
} from "@/components/ui";
import { cotizarHref } from "@/lib/contacto";
import { getConfig, getPagina } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-nosotros");
  return { title: pagina?.titulo ?? "Nosotros", description: pagina?.intro };
}

export default async function NosotrosPage() {
  const [pagina, config] = await Promise.all([
    getPagina("pagina-nosotros"),
    getConfig(),
  ]);
  const cotizar = cotizarHref(config);
  const imagenes = (pagina?.imagenes ?? []).slice(0, 2);

  return (
    <>
      <PageHeader pagina={pagina} fallbackTitulo="Nosotros" />

      {(pagina?.texto?.length || imagenes.length > 0) && (
        <section className="bg-bone pb-24 lg:pb-40">
          <Container className="grid gap-16 border-t border-line pt-16 lg:grid-cols-12 lg:pt-24">
            {pagina?.texto && pagina.texto.length > 0 && (
              <div className="reveal lg:col-span-5">
                <div className="prose-aa text-xl leading-relaxed text-ink/85">
                  <PortableText value={pagina.texto} />
                </div>
                <div className="mt-10">
                  <EnlaceFlecha href="/proyectos">Ver proyectos</EnlaceFlecha>
                </div>
              </div>
            )}
            {imagenes.length > 0 && (
              <div className="grid grid-cols-2 gap-4 lg:col-span-6 lg:col-start-7">
                {imagenes.map((f, i) => (
                  <div
                    key={f._key ?? i}
                    className={`reveal relative aspect-[3/4] overflow-hidden bg-stone ${
                      i === 1 ? "mt-16" : ""
                    }`}
                  >
                    <SanityImg
                      foto={f}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      <CtaBanner
        titulo="Hablemos de su proyecto"
        href={cotizar.href}
        externo={cotizar.externo}
        boton={
          cotizar.externo ? "Cotizar por WhatsApp" : "Solicitar cotización"
        }
      />
    </>
  );
}
