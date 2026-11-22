import Link from "next/link";
import { cotizarHref, datosContacto, whatsappUrl } from "@/lib/contacto";
import { NAV } from "@/lib/nav";
import type { Categoria, Configuracion } from "@/sanity/types";
import { Anio } from "./Anio";
import { LogoMarca } from "./Logo";
import { Texto } from "./Pendiente";
import { RedesSociales } from "./RedesSociales";
import { Boton, Container, Flecha, WhatsAppIcon } from "./ui";

export function Footer({
  config,
  categorias,
}: {
  config: Configuracion;
  categorias: Categoria[];
}) {
  const wa = whatsappUrl(config);
  // The footer shows every contact field, placeholders included, so the
  // client can see what is still missing.
  const datos = datosContacto(config, true);
  const servicios = categorias.map((c) => ({
    href: c.seccion === "cocinas" ? "/cocinas" : `/mobiliario#${c.slug}`,
    label: c.titulo,
  }));
  const [first, ...rest] = config.nombre.split(" y ");

  return (
    <footer className="bg-ink text-bone">
      {/* Quote band */}
      <div className="border-b border-bone/10">
        <Container className="flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5 text-sand">Cotización</p>
            <p className="display text-[clamp(2.6rem,5vw,4.6rem)]">
              ¿Tiene un espacio en mente?
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Boton href={cotizarHref()} variante="claro">
              Cotizar proyecto <Flecha />
            </Boton>
            {wa && (
              <Boton href={wa} externo variante="borde-claro">
                <WhatsAppIcon /> WhatsApp
              </Boton>
            )}
          </div>
        </Container>
      </div>

      <Container className="grid gap-14 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-4" aria-label={`${config.nombre} — inicio`}>
            <LogoMarca fondo className="h-14 w-14 shrink-0 rounded-[14px] ring-1 ring-bone/15" />
            <span className="leading-none">
              <span className="display block text-3xl">{first}</span>
              {rest.length > 0 && (
                <span className="mt-1 block font-serif text-2xl italic text-bone/60">
                  y {rest.join(" y ")}
                </span>
              )}
            </span>
          </Link>
          {config.descripcion && (
            <p className="mt-7 max-w-sm leading-relaxed text-bone/60">
              <Texto>{config.descripcion}</Texto>
            </p>
          )}
          <RedesSociales
            redes={config.redes}
            className="mt-8"
            itemClassName="border-bone/20 text-bone/80 hover:border-bone hover:bg-bone hover:text-ink"
          />
        </div>

        {/* Navigation */}
        <nav className="lg:col-span-2" aria-label="Pie de página">
          <p className="eyebrow mb-6 text-bone/40">Sitio</p>
          <ul className="space-y-3.5">
            <li>
              <Link href="/" className="text-bone/75 transition-colors hover:text-bone">
                Inicio
              </Link>
            </li>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-bone/75 transition-colors hover:text-bone">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services */}
        {servicios.length > 0 && (
          <nav className="lg:col-span-2" aria-label="Servicios">
            <p className="eyebrow mb-6 text-bone/40">Servicios</p>
            <ul className="space-y-3.5">
              {servicios.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-bone/75 transition-colors hover:text-bone">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Contact */}
        <div className="sm:col-span-2 lg:col-span-4">
          <p className="eyebrow mb-6 text-bone/40">Contacto</p>
          {datos.length > 0 ? (
            <dl className="space-y-4">
              {datos.map((d) => (
                <div key={d.label} className="grid grid-cols-[6.5rem_1fr] gap-4">
                  <dt className="text-sm text-bone/40">{d.label}</dt>
                  <dd className="min-w-0 break-words text-bone/85">
                    {d.href ? (
                      <a
                        href={d.href}
                        className="transition-colors hover:text-sand"
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
          ) : (
            <p className="text-bone/50">
              <Texto>[PENDIENTE: datos de contacto]</Texto>
            </p>
          )}
        </div>
      </Container>

      <div className="border-t border-bone/10">
        <Container className="flex flex-col gap-4 py-7 text-xs text-bone/45 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © <Anio /> {config.nombre}
            {config.nit && (
              <>
                {" · NIT "}
                <Texto>{config.nit}</Texto>
              </>
            )}
            . Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/terminos" className="hover:text-bone">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="hover:text-bone">
                Política de privacidad
              </Link>
            </li>
            <li>
              <a href="#top" className="inline-flex items-center gap-1.5 hover:text-bone">
                Volver arriba
                <Flecha className="h-3.5 w-3.5 -rotate-90" />
              </a>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
