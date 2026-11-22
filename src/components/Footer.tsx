import Link from "next/link";
import { telHref, whatsappUrl } from "@/lib/contacto";
import type { Configuracion } from "@/sanity/types";
import { NAV } from "@/lib/nav";

export function Footer({ config }: { config: Configuracion }) {
  const wa = whatsappUrl(config);
  const datos = [
    wa && config.whatsapp
      ? { label: "WhatsApp", value: `+${config.whatsapp}`, href: wa }
      : null,
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
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-[1440px] px-5 pt-20 pb-10 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display text-5xl sm:text-6xl">{config.nombre}</p>
            {config.eslogan && (
              <p className="mt-4 max-w-sm text-bone/60">{config.eslogan}</p>
            )}
          </div>

          <nav className="lg:col-span-3" aria-label="Pie de página">
            <p className="eyebrow mb-5 text-bone/40">Sitio</p>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-bone/80 transition-colors hover:text-bone"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {(datos.length > 0 || redes.length > 0) && (
            <div className="lg:col-span-4">
              <p className="eyebrow mb-5 text-bone/40">Contacto</p>
              <ul className="space-y-3">
                {datos.map((d) => (
                  <li key={d.label} className="flex gap-4">
                    <span className="w-24 shrink-0 text-sm text-bone/40">
                      {d.label}
                    </span>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="truncate text-bone/85 hover:text-bone"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <span className="text-bone/85">{d.value}</span>
                    )}
                  </li>
                ))}
              </ul>
              {redes.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-5">
                  {redes.map((r) => (
                    <li key={r._key}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-bone/70 underline-offset-4 hover:text-bone hover:underline"
                      >
                        {r.red}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-bone/10 pt-6 text-xs text-bone/40 sm:flex-row sm:justify-between">
          <p>© {config.nombre}</p>
          <p>Diseño y fabricación a medida</p>
        </div>
      </div>
    </footer>
  );
}
