import type { Metadata } from "next";
import { Texto } from "@/components/Pendiente";
import { RedesSociales } from "@/components/RedesSociales";
import { SanityImg } from "@/components/SanityImg";
import { Boton, Container, Flecha, WhatsAppIcon } from "@/components/ui";
import { cotizarHref, datosContacto, whatsappUrl } from "@/lib/contacto";
import { getConfig, getPagina } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-contacto");
  return { title: pagina?.titulo ?? "Contacto", description: pagina?.intro };
}

export default async function ContactoPage() {
  const [pagina, config] = await Promise.all([
    getPagina("pagina-contacto"),
    getConfig(),
  ]);
  const wa = whatsappUrl(config);
  const datos = datosContacto(config, true);

  return (
    <section className="bg-bone pt-28 pb-24 lg:pt-36 lg:pb-36">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="hero-copy lg:col-span-6">
          {pagina?.etiqueta && (
            <p className="eyebrow mb-6 text-walnut">{pagina.etiqueta}</p>
          )}
          <h1 className="display text-[clamp(3rem,7vw,6.5rem)]">
            {pagina?.titulo ?? "Contacto"}
          </h1>
          {pagina?.intro && (
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
              {pagina.intro}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Boton href={cotizarHref()}>
              Cotizar proyecto <Flecha />
            </Boton>
            {wa && (
              <Boton href={wa} externo variante="borde">
                <WhatsAppIcon /> Escribir por WhatsApp
              </Boton>
            )}
          </div>

          {datos.length > 0 && (
            <dl className="mt-14 divide-y divide-line border-y border-line">
              {datos.map((d) => (
                <div
                  key={d.label}
                  className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8"
                >
                  <dt className="eyebrow w-32 shrink-0 pt-1 text-muted">
                    {d.label}
                  </dt>
                  <dd className="min-w-0 text-lg break-words">
                    {d.href ? (
                      <a
                        href={d.href}
                        className="hover:text-walnut"
                        {...(d.externo
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {d.value}
                      </a>
                    ) : (
                      <Texto>{d.value}</Texto>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <RedesSociales
            redes={config.redes}
            className="mt-8"
            itemClassName="border-ink/15 text-ink/80 hover:border-ink hover:bg-ink hover:text-bone"
          />
        </div>

        {pagina?.imagen && (
          <div className="relative aspect-[4/5] overflow-hidden bg-stone lg:col-span-5 lg:col-start-8">
            <SanityImg
              foto={pagina.imagen}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="hero-img"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
