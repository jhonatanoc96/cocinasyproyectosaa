import type { Metadata } from "next";
import { Texto, TextoRico } from "@/components/Pendiente";
import { SanityImg } from "@/components/SanityImg";
import {
  Container,
  CtaBanner,
  EnlaceFlecha,
  PageHeader,
  SectionHead,
} from "@/components/ui";
import { cotizarHref, esPendiente } from "@/lib/contacto";
import { getPagina } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-nosotros");
  return { title: pagina?.titulo ?? "Nosotros", description: pagina?.intro };
}

export default async function NosotrosPage() {
  const pagina = await getPagina("pagina-nosotros");
  const imagenes = (pagina?.imagenes ?? []).slice(0, 2);
  const cifras = (pagina?.cifras ?? []).filter((c) => c.valor || c.etiqueta);
  const proceso = (pagina?.proceso ?? []).filter((p) => p.titulo);
  const valores = (pagina?.valores ?? []).filter((v) => v.titulo);

  return (
    <>
      <PageHeader pagina={pagina} fallbackTitulo="Nosotros" />

      {/* Historia */}
      {(pagina?.texto?.length || imagenes.length > 0) && (
        <section className="bg-bone pb-24 lg:pb-36">
          <Container className="grid gap-16 border-t border-line pt-16 lg:grid-cols-12 lg:pt-24">
            {pagina?.texto && pagina.texto.length > 0 && (
              <div className="reveal lg:col-span-6">
                <div className="prose-aa text-xl leading-relaxed text-ink/85">
                  <TextoRico value={pagina.texto} />
                </div>
                <div className="mt-10">
                  <EnlaceFlecha href="/proyectos">Ver proyectos</EnlaceFlecha>
                </div>
              </div>
            )}
            {imagenes.length > 0 && (
              <div className="grid grid-cols-2 gap-4 self-start lg:col-span-5 lg:col-start-8">
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
                      sizes="(min-width: 1024px) 22vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Cifras */}
      {cifras.length > 0 && (
        <section className="bg-stone py-20 lg:py-28">
          <Container>
            <dl className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {cifras.map((c) => (
                <div key={c._key} className="reveal min-w-0 bg-stone p-8 lg:p-10">
                  <dd
                    className={`display break-words ${
                      esPendiente(c.valor)
                        ? "text-[clamp(1.6rem,2.4vw,2.2rem)]"
                        : "text-[clamp(2.6rem,4.4vw,4rem)]"
                    }`}
                  >
                    <Texto>{c.valor}</Texto>
                  </dd>
                  <dt className="eyebrow mt-4 text-muted">
                    <Texto>{c.etiqueta}</Texto>
                  </dt>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {/* Frase destacada */}
      {pagina?.cita && (
        <section className="bg-ink py-24 text-bone lg:py-36">
          <Container>
            <figure className="reveal mx-auto max-w-4xl text-center">
              <span className="display block text-7xl leading-none text-walnut-light" aria-hidden>
                “
              </span>
              <blockquote className="display mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1.12]">
                <Texto>{pagina.cita}</Texto>
              </blockquote>
              {pagina.citaAutor && (
                <figcaption className="eyebrow mt-10 text-sand">
                  <Texto>{pagina.citaAutor}</Texto>
                </figcaption>
              )}
            </figure>
          </Container>
        </section>
      )}

      {/* Proceso */}
      {proceso.length > 0 && (
        <section className="bg-bone py-24 lg:py-36">
          <Container>
            <SectionHead etiqueta="Proceso" titulo={pagina?.procesoTitulo ?? "Cómo trabajamos"} />
            <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {proceso.map((p, i) => (
                <li key={p._key} className="reveal border-t border-ink/20 pt-6">
                  <span className="text-xs tabular-nums text-walnut">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-6 text-3xl">
                    <Texto>{p.titulo}</Texto>
                  </h3>
                  {p.texto && (
                    <p className="mt-4 leading-relaxed text-muted">
                      <Texto>{p.texto}</Texto>
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Compromisos */}
      {valores.length > 0 && (
        <section className="bg-bone pb-24 lg:pb-36">
          <Container>
            <SectionHead etiqueta="Compromiso" titulo={pagina?.valoresTitulo ?? "Nuestro compromiso"} />
            <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {valores.map((v) => (
                <li key={v._key} className="reveal bg-bone p-8 lg:p-12">
                  <h3 className="display text-[2.1rem]">
                    <Texto>{v.titulo}</Texto>
                  </h3>
                  {v.texto && (
                    <p className="mt-4 max-w-md leading-relaxed text-muted">
                      <Texto>{v.texto}</Texto>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBanner
        titulo="Hablemos de su proyecto"
        texto="Cuéntenos qué espacio quiere transformar y le ayudamos a definirlo."
        href={cotizarHref()}
        boton="Cotizar proyecto"
        imagen={imagenes[0]}
      />
    </>
  );
}
