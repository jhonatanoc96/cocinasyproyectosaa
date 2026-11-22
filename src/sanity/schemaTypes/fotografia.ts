import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";

/**
 * Reusable photo: image with hotspot + alternative text, caption and the
 * category it belongs to (kitchen, closet, bathroom…). The category is what
 * feeds the "Cocinas" and "Mobiliario" pages, so one project can mix spaces.
 */
export const fotografia = defineType({
  name: "fotografia",
  title: "Fotografía",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description:
        'Describe lo que se ve en la foto (para accesibilidad y Google). Ej: "Cocina en L con muebles altos color arena".',
      validation: (rule) =>
        rule.required().warning("Agrega un texto alternativo."),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción (opcional)",
      type: "string",
      description: "Se muestra al ampliar la foto.",
    }),
    defineField({
      name: "categoria",
      title: "Tipo de trabajo",
      type: "reference",
      to: [{ type: "categoria" }],
      description:
        "Define en qué sección aparece la foto (Cocinas o Mobiliario).",
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt", subtitle: "categoria.titulo" },
    prepare: ({ media, title, subtitle }) => ({
      media,
      title: title || "Sin texto alternativo",
      subtitle,
    }),
  },
});
