import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppIcon } from "@/components/ui";
import { cotizarHref, whatsappUrl } from "@/lib/contacto";
import { hasAsset, imageUrl } from "@/lib/image";
import { getConfig } from "@/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  const og = hasAsset(config.imagenCompartir)
    ? imageUrl(config.imagenCompartir, 1200)
    : undefined;
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    title: {
      default: `${config.nombre} — ${
        config.eslogan ?? "Diseño y fabricación a medida"
      }`,
      template: `%s · ${config.nombre}`,
    },
    description: config.seoDescripcion,
    openGraph: {
      siteName: config.nombre,
      locale: "es_CO",
      type: "website",
      images: og ? [og] : undefined,
    },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const config = await getConfig();
  const wa = whatsappUrl(config);
  return (
    <>
      <Header nombre={config.nombre} cotizar={cotizarHref(config)} />
      <main>{children}</main>
      <Footer config={config} />
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
          className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,.45)] transition-transform hover:scale-105 sm:right-8 sm:bottom-8"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      )}
    </>
  );
}
