import type { Metadata } from "next";
import { SanityImg } from "@/components/SanityImg";
import { Boton, Container, WhatsAppIcon } from "@/components/ui";
import { telHref, whatsappUrl } from "@/lib/contacto";
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
  const datos = [
    config.telefono
      ? {
          label: "Teléfono",
          value: config.telefono,
          href: telHref(config.telefono),
        }
      : null,
    config.email
      ? { label: "Correo", value: config.email, href: `mailto:${config.email}` }
      : null,
    config.direccion ? { label: "Dirección", value: config.direccion } : null,
    config.ciudad ? { label: "Cobertura", value: config.ciudad } : null,
    config.horario ? { label: "Horario", value: config.horario } : null,
  ].filter(
    (d): d is { label: string; value: string; href?: string } => d !== null
  );
  const redes = (config.redes ?? []).filter((r) => r.url);

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

          {wa && (
            <div className="mt-10">
              <Boton href={wa} externo>
                <WhatsAppIcon /> Escribir por WhatsApp
              </Boton>
            </div>
          )}

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
                      <a href={d.href} className="hover:text-walnut">
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

          {redes.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-6">
              {redes.map((r) => (
                <li key={r._key}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold underline-offset-4 hover:underline"
                  >
                    {r.red}
                  </a>
                </li>
              ))}
            </ul>
          )}
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
