import type { Metadata } from "next";
import { PaginaLegal } from "@/components/PaginaLegal";
import { getPagina } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-privacidad");
  return { title: pagina?.titulo ?? "Política de privacidad", description: pagina?.intro };
}

export default async function PrivacidadPage() {
  const pagina = await getPagina("pagina-privacidad");
  return <PaginaLegal pagina={pagina} fallbackTitulo="Política de privacidad" />;
}
