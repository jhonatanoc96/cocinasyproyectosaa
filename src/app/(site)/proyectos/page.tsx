import type { Metadata } from "next";
import {
  Container,
  CtaBanner,
  PageHeader,
  ProyectoCard,
} from "@/components/ui";
import { cotizarHref } from "@/lib/contacto";
import { getConfig, getPagina, getProyectos } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-proyectos");
  return { title: pagina?.titulo ?? "Proyectos", description: pagina?.intro };
}

export default async function ProyectosPage() {
  const [pagina, proyectos, config] = await Promise.all([
    getPagina("pagina-proyectos"),
    getProyectos(),
    getConfig(),
  ]);
  const cotizar = cotizarHref(config);

  return (
    <>
      <PageHeader pagina={pagina} fallbackTitulo="Proyectos" />
      <section className="bg-bone pb-24 lg:pb-40">
        <Container>
          <div className="mb-12 flex items-baseline justify-between border-t border-line pt-6">
            <p className="eyebrow text-muted">{proyectos.length} proyectos</p>
          </div>
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
            {proyectos.map((p, i) => (
              <div key={p._id} className={i % 3 === 1 ? "lg:mt-20" : ""}>
                <ProyectoCard
                  proyecto={p}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <CtaBanner
        titulo="¿Tiene un proyecto en mente?"
        texto="Cuéntenos qué espacio quiere transformar."
        boton={
          cotizar.externo ? "Cotizar por WhatsApp" : "Solicitar cotización"
        }
        href={cotizar.href}
        externo={cotizar.externo}
      />
    </>
  );
}
