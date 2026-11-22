import { TextoRico } from "./Pendiente";
import { Container } from "./ui";
import type { Pagina } from "@/sanity/types";

function fecha(iso?: string): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(y, m - 1, d));
}

/** Legal page (terms / privacy): narrow, readable column. */
export function PaginaLegal({
  pagina,
  fallbackTitulo,
}: {
  pagina: Pagina | null;
  fallbackTitulo: string;
}) {
  const actualizado = fecha(pagina?.actualizado);
  return (
    <section className="bg-bone pt-28 pb-24 lg:pt-36 lg:pb-36">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-6 text-walnut">{pagina?.etiqueta ?? "Legal"}</p>
          <h1 className="display text-[clamp(2.8rem,6vw,5rem)]">
            {pagina?.titulo ?? fallbackTitulo}
          </h1>
          {actualizado && (
            <p className="mt-6 text-sm text-muted">Última actualización: {actualizado}</p>
          )}
          {pagina?.intro && (
            <p className="mt-8 text-lg leading-relaxed text-muted">{pagina.intro}</p>
          )}
          <div className="prose-aa mt-12 border-t border-line pt-10 text-[1.05rem] text-ink/85">
            <TextoRico value={pagina?.texto} />
          </div>
        </div>
      </Container>
    </section>
  );
}
