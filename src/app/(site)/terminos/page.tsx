import type { Metadata } from "next";
import { PaginaLegal } from "@/components/PaginaLegal";
import { getPagina } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("pagina-terminos");
  return { title: pagina?.titulo ?? "Términos y condiciones", description: pagina?.intro };
}

export default async function TerminosPage() {
  const pagina = await getPagina("pagina-terminos");
  return <PaginaLegal pagina={pagina} fallbackTitulo="Términos y condiciones" />;
}
