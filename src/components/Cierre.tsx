import { cotizarHref, type DatoContacto } from "@/lib/contacto";
import type { Foto } from "@/sanity/types";
import { Indice } from "./efectos";
import { SanityImg } from "./SanityImg";
import { Boton, Container, Flecha, WhatsAppIcon } from "./ui";

/**
 * Closing section of the landing: quote call-to-action + contact rows in one
 * dark, full-bleed block (replaces the separate CTA and contact grid).
 */
export function Cierre({
  indice,
  titulo,
  texto,
  boton,
  imagen,
  datos,
  whatsapp,
}: {
  indice?: number;
  titulo?: string;
  texto?: string;
  boton?: string;
  imagen?: Foto;
  datos: DatoContacto[];
  whatsapp: string | null;
}) {
  return (
    <section className="grano relative overflow-hidden bg-ink text-bone">
      {imagen && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <SanityImg foto={imagen} fill sizes="100vw" className="parallax opacity-40" />
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink to-transparent" />

      <Container className="relative z-[2] grid gap-16 py-28 lg:grid-cols-12 lg:gap-12 lg:py-40">
        <div className="lg:col-span-7">
          {indice ? <Indice n={indice} label="Cotización" tono="claro" /> : (
            <p className="eyebrow mb-6 text-sand">Cotización</p>
          )}
          <h2 data-fx="blur" className="display text-[clamp(3.2rem,7.4vw,7.2rem)]">
            {titulo ?? "Cotice su proyecto"}
          </h2>
          {texto && (
            <p data-fx style={{ ["--d" as string]: ".12s" }} className="mt-8 max-w-lg text-lg leading-relaxed text-bone/70">
              {texto}
            </p>
          )}
          <div data-fx style={{ ["--d" as string]: ".22s" }} className="mt-12 flex flex-wrap gap-3">
            <Boton href={cotizarHref()} variante="claro">
              {boton || "Cotizar proyecto"} <Flecha />
            </Boton>
            {whatsapp && (
              <Boton href={whatsapp} externo variante="borde-claro">
                <WhatsAppIcon /> Escribir por WhatsApp
              </Boton>
            )}
          </div>
        </div>

        {datos.length > 0 && (
          <div className="self-end lg:col-span-5">
            <div
              data-fx="right"
              className="border border-bone/12 bg-bone/[0.04] p-2 backdrop-blur-md"
            >
              <p className="eyebrow px-6 pt-6 pb-2 text-bone/45">Contacto directo</p>
              <ul data-fx-stagger>
                {datos.map((d) => {
                  const contenido = (
                    <>
                      <span className="min-w-0">
                        <span className="eyebrow block text-bone/40">{d.label}</span>
                        <span className="mt-2 block truncate text-xl text-bone/90 sm:text-2xl">
                          {d.value}
                        </span>
                      </span>
                      {d.href && (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/20 transition-colors duration-300 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                          <Flecha className="-rotate-45" />
                        </span>
                      )}
                    </>
                  );
                  const cls =
                    "group flex items-center justify-between gap-6 border-t border-bone/10 px-6 py-6 first:border-t-0";
                  return (
                    <li key={d.label} data-fx>
                      {d.href ? (
                        <a
                          href={d.href}
                          className={`${cls} transition-colors hover:bg-bone/[0.04]`}
                          {...(d.externo
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {contenido}
                        </a>
                      ) : (
                        <div className={cls}>{contenido}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
