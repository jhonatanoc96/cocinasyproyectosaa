import type { PortableTextBlock } from "next-sanity";

export interface Foto {
  _key?: string;
  alt?: string;
  descripcion?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  categoria?: {
    _id: string;
    titulo: string;
    slug: string;
    seccion: "cocinas" | "mobiliario";
  } | null;
}

export interface Video {
  _key: string;
  titulo?: string;
  url?: string;
  poster?: Foto;
}

export interface Categoria {
  _id: string;
  titulo: string;
  slug: string;
  seccion: "cocinas" | "mobiliario";
  descripcion?: string;
  imagen?: Foto;
}

export interface ProyectoResumen {
  _id: string;
  titulo: string;
  slug: string;
  resumen?: string;
  portada?: Foto;
  totalFotos: number;
  categorias?: { titulo: string; slug: string }[];
}

export interface Proyecto extends ProyectoResumen {
  descripcion?: PortableTextBlock[];
  galeria?: Foto[];
  videos?: Video[];
  ubicacion?: string;
  anio?: number;
}

export interface ProyectoConFotos {
  _id: string;
  titulo: string;
  slug: string;
  galeria?: Foto[];
}

export interface Configuracion {
  nombre: string;
  eslogan?: string;
  logo?: Foto;
  whatsapp?: string;
  mensajeWhatsapp?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  horario?: string;
  redes?: { _key: string; red?: string; url?: string }[];
  seoDescripcion?: string;
  imagenCompartir?: Foto;
}

export interface Inicio {
  heroEtiqueta?: string;
  heroTitulo?: string;
  heroTexto?: string;
  heroImagenes?: Foto[];
  presEtiqueta?: string;
  presTitulo?: string;
  presTexto?: string;
  presImagen?: Foto;
  presImagen2?: Foto;
  proyTitulo?: string;
  proyTexto?: string;
  proyectos?: ProyectoResumen[];
  cocTitulo?: string;
  cocTexto?: string;
  cocImagenes?: Foto[];
  mobTitulo?: string;
  mobTexto?: string;
  difTitulo?: string;
  diferenciales?: { _key: string; titulo?: string; texto?: string }[];
  galTitulo?: string;
  galImagenes?: Foto[];
  ctaTitulo?: string;
  ctaTexto?: string;
  ctaBoton?: string;
  ctaImagen?: Foto;
}

export interface Pagina {
  etiqueta?: string;
  titulo: string;
  intro?: string;
  imagen?: Foto;
  texto?: PortableTextBlock[];
  imagenes?: Foto[];
}
