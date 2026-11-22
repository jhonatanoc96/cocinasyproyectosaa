import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";

export const categoria = defineType({
  name: "categoria",
  title: "Tipo de trabajo",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "titulo",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: "titulo" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seccion",
      title: "Sección del sitio",
      type: "string",
      options: {
        list: [
          { title: "Cocinas", value: "cocinas" },
          { title: "Mobiliario", value: "mobiliario" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "imagen",
      title: "Imagen representativa",
      type: "fotografia",
    }),
    defineField({
      name: "orden",
      title: "Orden",
      type: "number",
      description: "Número menor aparece primero.",
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: "Orden",
      name: "orden",
      by: [{ field: "orden", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "titulo", subtitle: "seccion", media: "imagen" },
  },
});
