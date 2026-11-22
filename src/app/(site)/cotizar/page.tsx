import type { Metadata } from "next";
import { Suspense } from "react";
import { CotizadorForm, CotizadorFormConParams } from "@/components/CotizadorForm";
import { SanityImg } from "@/components/SanityImg";
import { Container } from "@/components/ui";
import { datosContacto, numeroWhatsapp } from "@/lib/contacto";
import { getConfig, getCotizador } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getCotizador();
  return {
    title: c.titulo ?? "Cotizar proyecto",
    description: c.intro,
  };
}

export default async function CotizarPage() {
  const [cotizador, config] = await Promise.all([getCotizador(), getConfig()]);
  const numero = numeroWhatsapp(config);
  const datos = datosContacto(config).filter((d) => d.label !== "WhatsApp");
  const props = { cotizador, numero };

  return (
    <section className="bg-bone pt-28 pb-24 lg:pt-36 lg:pb-36">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="hero-copy lg:col-span-5">
          <p className="eyebrow mb-6 text-walnut">
            {cotizador.etiqueta ?? "Cotización"}
          </p>
          <h1 className="display text-[clamp(3rem,6.4vw,5.8rem)]">
            {cotizador.titulo ?? "Cotice su proyecto"}
          </h1>
          {cotizador.intro && (
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              {cotizador.intro}
            </p>
          )}
          {cotizador.imagen && (
            <div className="relative mt-12 hidden aspect-[4/3] overflow-hidden bg-stone lg:block">
              <SanityImg
                foto={cotizador.imagen}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            </div>
          )}
          {datos.length > 0 && (
            <dl className="mt-10 grid gap-5 sm:grid-cols-2">
              {datos.map((d) => (
                <div key={d.label}>
                  <dt className="eyebrow text-muted">{d.label}</dt>
                  <dd className="mt-2 break-words">
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
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="lg:col-span-7">
          {/* The static shell renders the form without URL params; the client
              then applies ?tipo= / ?proyecto= (cocina, mobiliario, project). */}
          <Suspense fallback={<CotizadorForm {...props} />}>
            <CotizadorFormConParams {...props} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
