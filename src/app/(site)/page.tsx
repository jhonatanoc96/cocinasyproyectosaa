import { Cierre } from "@/components/Cierre";
import { Contador } from "@/components/Contador";
import { Indice, Marquee, Palabras, Sello } from "@/components/efectos";
import { Galeria } from "@/components/Galeria";
import { HeroCarousel, type SlideData } from "@/components/HeroCarousel";
import {
  MobiliarioIndex,
  type LineaMobiliario,
} from "@/components/MobiliarioIndex";
import { Texto } from "@/components/Pendiente";
import { SanityImg } from "@/components/SanityImg";
import {
  Boton,
  Container,
  EnlaceFlecha,
  Flecha,
  ProyectoCard,
  SectionHead,
} from "@/components/ui";
import { cotizarHref, datosContacto, whatsappUrl } from "@/lib/contacto";
import { fotosData, hasAsset, toFotoData } from "@/lib/image";
import {
  getCategorias,
  getConfig,
  getInicio,
  getPagina,
  getProyectos,
} from "@/sanity/data";

export default async function HomePage() {
  const [inicio, config, lineasMob, lineasCoc, proyectosTodos, nosotros] =
    await Promise.all([
      getInicio(),
      getConfig(),
      getCategorias("mobiliario"),
      getCategorias("cocinas"),
      getProyectos(),
      getPagina("pagina-nosotros"),
    ]);

  // Section numbers ("01 — …") follow the sections actually rendered.
  let n = 0;
  const sig = () => ++n;

  const slides: SlideData[] = (inicio.heroSlides ?? []).flatMap(
    (s, i): SlideData[] => {
      if (s.tipo === "video") {
        if (!s.video) return [];
        return [
          {
            key: s._key,
            tipo: "video",
            src: s.video,
            poster: hasAsset(s.poster) ? toFotoData(s.poster, i) : undefined,
          },
        ];
      }
      return hasAsset(s.imagen)
        ? [{ key: s._key, tipo: "imagen", foto: toFotoData(s.imagen, i) }]
        : [];
    }
  );
  const proyectos = inicio.proyectos ?? [];
  const cocinas = (inicio.cocImagenes ?? []).filter(hasAsset);
  const lineas: LineaMobiliario[] = lineasMob.map((c) => ({
    id: c._id,
    titulo: c.titulo,
    slug: c.slug,
    descripcion: c.descripcion,
    foto: hasAsset(c.imagen) ? toFotoData(c.imagen) : null,
  }));
  const servicios = [...lineasCoc, ...lineasMob].map((c) => c.titulo);
  const diferenciales = (inicio.diferenciales ?? []).filter((d) => d.titulo);
  const proceso = (nosotros?.proceso ?? []).filter((p) => p.titulo);
  // Real figures from the CMS (no invented numbers).
  const cifras = [
    { valor: proyectosTodos.length, label: "Proyectos en portafolio" },
    {
      valor: proyectosTodos.reduce((t, p) => t + (p.totalFotos ?? 0), 0),
      label: "Fotografías de obra",
    },
    { valor: servicios.length, label: "Líneas de trabajo" },
  ].filter((c) => c.valor > 0);

  return (
    <>
      {/* Hero --------------------------------------------------------- */}
      <section className="grano relative h-[100svh] min-h-[640px] overflow-hidden bg-ink text-bone">
        <HeroCarousel
          slides={slides}
          intervalo={inicio.heroIntervalo ?? 6}
          autoplay={inicio.heroAutoplay ?? true}
        />
        <div className="lineas-guia pointer-events-none absolute inset-0 z-[2] hidden lg:block" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-ink/60 to-transparent" />

        <Container className="pointer-events-none relative z-[3] flex h-full flex-col justify-end pb-28 lg:pb-32">
          <div className="hero-copy pointer-events-auto max-w-5xl">
            {inicio.heroEtiqueta && (
              <p className="eyebrow mb-7 flex items-center gap-4 text-sand">
                <span className="h-px w-10 bg-sand/60" />
                {inicio.heroEtiqueta}
              </p>
            )}
            <h1 className="display text-[clamp(3.4rem,8.6vw,9rem)]">
              <Palabras texto={inicio.heroTitulo ?? config.nombre} />
            </h1>
            {inicio.heroTexto && (
              <p className="mt-8 max-w-xl text-base leading-relaxed text-bone/75 sm:text-lg">
                {inicio.heroTexto}
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Boton href="/proyectos" variante="claro">
                Ver proyectos <Flecha />
              </Boton>
              <Boton href={cotizarHref()} variante="borde-claro">
                Cotizar proyecto
              </Boton>
            </div>
          </div>
        </Container>

        <a
          href="#estudio"
          className="absolute bottom-7 left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] font-semibold tracking-[0.3em] text-bone/60 uppercase transition-colors hover:text-bone lg:flex"
        >
          Descubrir
          <span className="relative block h-12 w-px overflow-hidden bg-bone/20">
            <span className="pulso absolute inset-0 bg-bone" />
          </span>
        </a>
      </section>

      {/* Services band ------------------------------------------------- */}
      <section className="border-b border-bone/10 bg-ink py-8 text-bone sm:py-10" aria-label="Servicios">
        <Marquee items={servicios} />
      </section>

      {/* Estudio (presentation) ---------------------------------------- */}
      <section id="estudio" className="relative overflow-hidden bg-bone py-28 lg:py-44">
        <Container className="grid items-center gap-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div data-fx="fade">
              <Indice n={sig()} label={inicio.presEtiqueta ?? "Estudio"} />
            </div>
            {inicio.presTitulo && (
              <h2 data-fx="blur" className="display text-[clamp(2.6rem,4.6vw,4.4rem)]">
                {inicio.presTitulo}
              </h2>
            )}
            {inicio.presTexto && (
              <p data-fx style={{ ["--d" as string]: ".1s" }} className="mt-8 max-w-md text-lg leading-relaxed text-muted">
                {inicio.presTexto}
              </p>
            )}
            <div data-fx style={{ ["--d" as string]: ".2s" }} className="mt-10">
              <EnlaceFlecha href="/nosotros">Conocer el estudio</EnlaceFlecha>
            </div>

            {cifras.length > 0 && (
              <dl data-fx-stagger className="mt-16 grid grid-cols-3 gap-6 border-t border-line pt-8">
                {cifras.map((c) => (
                  <div key={c.label} data-fx>
                    <dd className="display text-[clamp(2.6rem,4vw,3.8rem)] leading-none">
                      <Contador valor={c.valor} />
                    </dd>
                    <dt className="mt-3 text-xs leading-snug text-muted">{c.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <div data-fx="clip" className="relative ml-auto aspect-[4/5] w-[84%] overflow-hidden bg-stone">
              <div className="parallax absolute inset-0">
                <SanityImg foto={inicio.presImagen} fill sizes="(min-width: 1024px) 42vw, 84vw" />
              </div>
            </div>
            {inicio.presImagen2 && (
              <div
                data-fx="clip"
                style={{ ["--d" as string]: ".2s" }}
                className="absolute -bottom-14 left-0 aspect-[3/4] w-[44%] overflow-hidden border-[7px] border-bone bg-stone shadow-[0_40px_80px_-40px_rgba(22,20,18,.5)] lg:-bottom-20"
              >
                <SanityImg foto={inicio.presImagen2} fill sizes="(min-width: 1024px) 20vw, 44vw" />
              </div>
            )}
            <Sello className="absolute -top-10 left-[8%] h-32 w-32 rounded-full bg-bone text-ink shadow-[0_20px_60px_-30px_rgba(22,20,18,.6)] sm:h-36 sm:w-36" />
          </div>
        </Container>
      </section>

      {/* Featured projects --------------------------------------------- */}
      {proyectos.length > 0 && (
        <section className="bg-bone pt-20 pb-28 lg:pt-28 lg:pb-44">
          <Container>
            <SectionHead
              indice={sig()}
              etiqueta="Portafolio"
              titulo={inicio.proyTitulo}
              texto={inicio.proyTexto}
              accion={<EnlaceFlecha href="/proyectos">Ver todos los proyectos</EnlaceFlecha>}
            />
            <div className="grid gap-x-10 gap-y-20 md:grid-cols-2 lg:gap-x-16">
              {proyectos.map((p, i) => (
                <div key={p._id} className={i % 2 === 1 ? "md:mt-32" : ""}>
                  <ProyectoCard
                    proyecto={p}
                    numero={i + 1}
                    aspecto={i % 4 === 0 || i % 4 === 3 ? "aspect-[4/5]" : "aspect-[5/6]"}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Kitchens -------------------------------------------------------- */}
      {cocinas.length > 0 && (
        <section className="grano relative overflow-hidden bg-ink py-28 text-bone lg:py-44">
          <p
            aria-hidden
            className="deriva contorno display pointer-events-none absolute top-10 left-0 text-[clamp(8rem,22vw,22rem)] leading-none whitespace-nowrap text-bone/[0.09]"
          >
            {inicio.cocTitulo ?? "Cocinas"} · {inicio.cocTitulo ?? "Cocinas"}
          </p>
          <Container className="relative z-[2] grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-36">
                <div data-fx="fade">
                  <Indice n={sig()} label="Especialidad" tono="claro" />
                </div>
                <h2 data-fx="blur" className="display text-[clamp(3.4rem,6.6vw,6.4rem)]">
                  {inicio.cocTitulo ?? "Cocinas"}
                </h2>
                {inicio.cocTexto && (
                  <p data-fx className="mt-8 max-w-sm leading-relaxed text-bone/65">
                    {inicio.cocTexto}
                  </p>
                )}
                <div data-fx className="mt-10 flex flex-wrap gap-6">
                  <EnlaceFlecha href="/cocinas" tono="claro">
                    Ver cocinas
                  </EnlaceFlecha>
                  <EnlaceFlecha href={cotizarHref("cocina")} tono="claro">
                    Cotizar mi cocina
                  </EnlaceFlecha>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-8">
              {cocinas.map((f, i) => {
                const ancha =
                  i === 0 || (i === cocinas.length - 1 && (cocinas.length - 1) % 2 === 1);
                return (
                  <div
                    key={f._key ?? i}
                    data-fx="clip"
                    style={{ ["--d" as string]: `${(i % 2) * 0.12}s` }}
                    className={`relative overflow-hidden bg-graphite [--cortina:var(--color-ink)] ${
                      ancha ? "col-span-2 aspect-[4/3] sm:aspect-[16/10]" : "aspect-[3/4]"
                    }`}
                  >
                    <div className="parallax absolute inset-0">
                      <SanityImg
                        foto={f}
                        fill
                        sizes={i === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 50vw"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Furniture -------------------------------------------------------- */}
      {lineas.length > 0 && (
        <section className="bg-stone py-28 lg:py-44">
          <Container>
            <SectionHead
              indice={sig()}
              etiqueta="Mobiliario"
              titulo={inicio.mobTitulo}
              texto={inicio.mobTexto}
              accion={<EnlaceFlecha href={cotizarHref("mobiliario")}>Cotizar mobiliario</EnlaceFlecha>}
            />
            <div data-fx>
              <MobiliarioIndex lineas={lineas} />
            </div>
          </Container>
        </section>
      )}

      {/* Process (from the "Nosotros" page) ------------------------------ */}
      {proceso.length > 0 && (
        <section className="relative overflow-hidden bg-bone py-28 lg:py-44">
          <Container>
            <SectionHead
              indice={sig()}
              etiqueta="Proceso"
              titulo={nosotros?.procesoTitulo ?? "Cómo trabajamos"}
              accion={<EnlaceFlecha href="/nosotros">Conocer más</EnlaceFlecha>}
            />
            <div className="relative">
              <div className="absolute top-0 right-0 left-0 hidden h-px bg-line lg:block" />
              <div className="linea-proceso absolute top-0 right-0 left-0 hidden h-px bg-walnut lg:block" />
              <ol data-fx-stagger className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
                {proceso.map((p, i) => (
                  <li key={p._key} data-fx className="relative pt-10">
                    <span className="absolute top-0 left-0 hidden h-3 w-3 -translate-y-1/2 rounded-full border border-walnut bg-bone lg:block" />
                    <span className="contorno display block text-[5.5rem] leading-none text-walnut/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="display mt-6 text-[2rem]">
                      <Texto>{p.titulo}</Texto>
                    </h3>
                    {p.texto && (
                      <p className="mt-4 max-w-xs leading-relaxed text-muted">
                        <Texto>{p.texto}</Texto>
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>
      )}

      {/* Differentiators (only when confirmed by the company) ------------ */}
      {diferenciales.length > 0 && (
        <section className="bg-stone py-28 lg:py-36">
          <Container>
            <SectionHead indice={sig()} etiqueta="Diferenciales" titulo={inicio.difTitulo} />
            <ul data-fx-stagger className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {diferenciales.map((d, i) => (
                <li key={d._key} data-fx className="bg-stone p-8 lg:p-10">
                  <span className="text-xs tabular-nums text-walnut">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-8 text-3xl">{d.titulo}</h3>
                  {d.texto && <p className="mt-4 text-sm leading-relaxed text-muted">{d.texto}</p>}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Gallery ------------------------------------------------------- */}
      {(inicio.galImagenes ?? []).length > 0 && (
        <section className="bg-bone pb-28 lg:pb-44">
          <Container>
            <SectionHead
              indice={sig()}
              etiqueta="Trabajos realizados"
              titulo={inicio.galTitulo}
              accion={<EnlaceFlecha href="/proyectos">Ver galerías por proyecto</EnlaceFlecha>}
            />
            <Galeria
              fotos={fotosData(inicio.galImagenes)}
              columnas="cuatro"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          </Container>
        </section>
      )}

      {/* Closing: quote + contact ---------------------------------------- */}
      <Cierre
        indice={sig()}
        titulo={inicio.ctaTitulo}
        texto={inicio.ctaTexto}
        boton={inicio.ctaBoton}
        imagen={inicio.ctaImagen}
        datos={datosContacto(config)}
        whatsapp={whatsappUrl(config)}
      />
    </>
  );
}
