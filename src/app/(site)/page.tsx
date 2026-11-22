import { Galeria } from "@/components/Galeria";
import { HeroCarousel, type SlideData } from "@/components/HeroCarousel";
import {
  MobiliarioIndex,
  type LineaMobiliario,
} from "@/components/MobiliarioIndex";
import { SanityImg } from "@/components/SanityImg";
import {
  Boton,
  Container,
  CtaBanner,
  EnlaceFlecha,
  Flecha,
  ProyectoCard,
  SectionHead,
} from "@/components/ui";
import { cotizarHref, datosContacto, type DatoContacto } from "@/lib/contacto";
import { fotosData, hasAsset, toFotoData } from "@/lib/image";
import { getCategorias, getConfig, getInicio } from "@/sanity/data";

export default async function HomePage() {
  const [inicio, config, lineasMob] = await Promise.all([
    getInicio(),
    getConfig(),
    getCategorias("mobiliario"),
  ]);
  const cotizar = cotizarHref();
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
  const diferenciales = (inicio.diferenciales ?? []).filter((d) => d.titulo);

  return (
    <>
      {/* 1 · Hero ------------------------------------------------------- */}
      <section className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-ink text-bone">
        <HeroCarousel
          slides={slides}
          intervalo={inicio.heroIntervalo ?? 6}
          autoplay={inicio.heroAutoplay ?? true}
        />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ink via-ink/40 to-ink/15" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-ink/60 to-transparent" />

        <Container className="pointer-events-none relative z-[3] flex h-full flex-col justify-end pb-24 lg:pb-28">
          <div className="hero-copy pointer-events-auto max-w-4xl">
            {inicio.heroEtiqueta && (
              <p className="eyebrow mb-6 text-sand">{inicio.heroEtiqueta}</p>
            )}
            <h1 className="display text-[clamp(3.2rem,8.2vw,8.5rem)]">
              {inicio.heroTitulo ?? config.nombre}
            </h1>
            {inicio.heroTexto && (
              <p className="mt-7 max-w-xl text-base leading-relaxed text-bone/75 sm:text-lg">
                {inicio.heroTexto}
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Boton href="/proyectos" variante="claro">
                Ver proyectos <Flecha />
              </Boton>
              <Boton href={cotizar} variante="borde-claro">
                Cotizar proyecto
              </Boton>
            </div>
          </div>
        </Container>
      </section>

      {/* 2 · Presentación ------------------------------------------------ */}
      <section className="overflow-hidden bg-bone py-24 lg:py-40">
        <Container className="grid items-center gap-16 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            {inicio.presEtiqueta && (
              <p className="eyebrow mb-6 text-walnut">{inicio.presEtiqueta}</p>
            )}
            {inicio.presTitulo && (
              <h2 className="display text-[clamp(2.4rem,4.4vw,4rem)]">
                {inicio.presTitulo}
              </h2>
            )}
            {inicio.presTexto && (
              <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
                {inicio.presTexto}
              </p>
            )}
            <div className="mt-10">
              <EnlaceFlecha href="/nosotros">Conocer más</EnlaceFlecha>
            </div>
          </div>
          <div className="relative lg:col-span-6 lg:col-start-7">
            <div className="reveal relative ml-auto aspect-[4/5] w-[82%] overflow-hidden bg-stone">
              <SanityImg
                foto={inicio.presImagen}
                fill
                sizes="(min-width: 1024px) 40vw, 80vw"
              />
            </div>
            {inicio.presImagen2 && (
              <div className="reveal absolute -bottom-12 left-0 aspect-[3/4] w-[42%] overflow-hidden border-[6px] border-bone bg-stone lg:-bottom-16">
                <SanityImg
                  foto={inicio.presImagen2}
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 3 · Proyectos destacados --------------------------------------- */}
      {proyectos.length > 0 && (
        <section className="bg-bone pt-16 pb-24 lg:pt-24 lg:pb-40">
          <Container>
            <SectionHead
              etiqueta="Portafolio"
              titulo={inicio.proyTitulo}
              texto={inicio.proyTexto}
              accion={
                <EnlaceFlecha href="/proyectos">
                  Ver todos los proyectos
                </EnlaceFlecha>
              }
            />
            <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-16">
              {proyectos.map((p, i) => (
                <div key={p._id} className={i % 2 === 1 ? "md:mt-28" : ""}>
                  <ProyectoCard
                    proyecto={p}
                    aspecto={
                      i % 4 === 0 || i % 4 === 3
                        ? "aspect-[4/5]"
                        : "aspect-[5/6]"
                    }
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 4 · Cocinas ------------------------------------------------------- */}
      {cocinas.length > 0 && (
        <section className="bg-ink py-24 text-bone lg:py-40">
          <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="reveal lg:sticky lg:top-32">
                <p className="eyebrow mb-6 text-sand">Especialidad</p>
                <h2 className="display text-[clamp(3rem,6vw,5.5rem)]">
                  {inicio.cocTitulo ?? "Cocinas"}
                </h2>
                {inicio.cocTexto && (
                  <p className="mt-8 max-w-sm leading-relaxed text-bone/65">
                    {inicio.cocTexto}
                  </p>
                )}
                <div className="mt-10">
                  <EnlaceFlecha href="/cocinas" tono="claro">
                    Ver cocinas
                  </EnlaceFlecha>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-8">
              {cocinas.map((f, i) => (
                <div
                  key={f._key ?? i}
                  className={`reveal relative overflow-hidden bg-graphite ${
                    // First photo and an unpaired last photo span both columns.
                    i === 0 ||
                    (i === cocinas.length - 1 && (cocinas.length - 1) % 2 === 1)
                      ? "col-span-2 aspect-[4/3] sm:aspect-[16/10]"
                      : "aspect-[3/4]"
                  }`}
                >
                  <SanityImg
                    foto={f}
                    fill
                    sizes={
                      i === 0
                        ? "(min-width: 1024px) 60vw, 100vw"
                        : "(min-width: 1024px) 30vw, 50vw"
                    }
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 5 · Mobiliario -------------------------------------------------- */}
      {lineas.length > 0 && (
        <section className="bg-stone py-24 lg:py-40">
          <Container>
            <SectionHead
              etiqueta="Mobiliario"
              titulo={inicio.mobTitulo}
              texto={inicio.mobTexto}
            />
            <MobiliarioIndex lineas={lineas} />
          </Container>
        </section>
      )}

      {/* 6 · Diferenciales (only when the company has confirmed them) ---- */}
      {diferenciales.length > 0 && (
        <section className="bg-bone py-24 lg:py-32">
          <Container>
            <SectionHead etiqueta="Diferenciales" titulo={inicio.difTitulo} />
            <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {diferenciales.map((d, i) => (
                <li key={d._key} className="reveal bg-bone p-8 lg:p-10">
                  <span className="text-xs tabular-nums text-walnut">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-8 text-3xl">{d.titulo}</h3>
                  {d.texto && (
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {d.texto}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* 7 · Galería ------------------------------------------------------- */}
      {(inicio.galImagenes ?? []).length > 0 && (
        <section className="bg-bone py-24 lg:py-40">
          <Container>
            <SectionHead
              etiqueta="Trabajos realizados"
              titulo={inicio.galTitulo}
              accion={
                <EnlaceFlecha href="/proyectos">
                  Ver galerías por proyecto
                </EnlaceFlecha>
              }
            />
            <Galeria
              fotos={fotosData(inicio.galImagenes)}
              columnas="cuatro"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          </Container>
        </section>
      )}

      {/* 8 · Llamado a cotizar ------------------------------------------- */}
      <CtaBanner
        titulo={inicio.ctaTitulo}
        texto={inicio.ctaTexto}
        boton={inicio.ctaBoton || "Cotizar proyecto"}
        href={cotizar}
        imagen={inicio.ctaImagen}
      />

      {/* 9 · Contacto (only the data that exists in the CMS) ------------- */}
      <ContactoResumen datos={datosContacto(config)} />
    </>
  );
}

function ContactoResumen({ datos: items }: { datos: DatoContacto[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-bone py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="reveal lg:col-span-4">
          <p className="eyebrow mb-5 text-walnut">Contacto</p>
          <h2 className="display text-5xl">Hablemos</h2>
          <div className="mt-8">
            <EnlaceFlecha href="/contacto">Ir a contacto</EnlaceFlecha>
          </div>
        </div>
        <dl className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
          {items.map((d) => (
            <div key={d.label} className="min-w-0 bg-bone p-6 lg:p-8">
              <dt className="eyebrow text-muted">{d.label}</dt>
              <dd className="mt-3 truncate text-lg">
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
      </Container>
    </section>
  );
}
