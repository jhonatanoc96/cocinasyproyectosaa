import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { Foto } from "@/sanity/types";

const builder = createImageUrlBuilder({ projectId, dataset });

const WIDTHS = [360, 540, 720, 960, 1280, 1600];

/** Plain-data version of a photo, safe to pass to client components. */
export interface FotoData {
  key: string;
  src: string;
  srcSet: string;
  large: string;
  alt: string;
  descripcion?: string;
  width: number;
  height: number;
  lqip?: string;
  position: string;
}

export function hasAsset(
  foto: Foto | null | undefined
): foto is Foto & { asset: NonNullable<Foto["asset"]> } {
  return Boolean(foto?.asset?._id);
}

/** object-position from the editor's hotspot, so cropped photos keep their subject. */
export function objectPosition(foto: Foto): string {
  const x = foto.hotspot?.x ?? 0.5;
  const y = foto.hotspot?.y ?? 0.5;
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}

export function imageUrl(foto: Foto, width: number): string {
  return builder
    .image(foto)
    .width(width)
    .fit("max")
    .auto("format")
    .quality(82)
    .url();
}

export function toFotoData(
  foto: Foto & { asset: NonNullable<Foto["asset"]> },
  index = 0
): FotoData {
  const dims = foto.asset.metadata?.dimensions;
  const natural = dims?.width ?? 1600;
  // Never ask for a width larger than the original: upscaling only adds weight.
  const widths = WIDTHS.filter((w) => w < natural).concat(natural);
  return {
    key: foto._key ?? `${foto.asset._id}-${index}`,
    src: imageUrl(foto, Math.min(960, natural)),
    srcSet: widths.map((w) => `${imageUrl(foto, w)} ${w}w`).join(", "),
    large: imageUrl(foto, Math.min(1800, natural)),
    alt: foto.alt ?? "",
    descripcion: foto.descripcion,
    width: dims?.width ?? 3,
    height: dims?.height ?? 4,
    lqip: foto.asset.metadata?.lqip,
    position: objectPosition(foto),
  };
}

export function fotosData(fotos: Foto[] | null | undefined): FotoData[] {
  return (fotos ?? []).filter(hasAsset).map((f, i) => toFotoData(f, i));
}
